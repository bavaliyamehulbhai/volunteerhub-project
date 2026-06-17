import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Key, ArrowLeft, ShieldCheck } from "lucide-react";

import { loginUser, verifyMfa } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [mfaToken, setMfaToken] = useState(null);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 minutes

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.mfaRequired) {
        setMfaToken(data.mfaToken);
        setCountdown(300); // Reset timer
        toast.success("Verification code sent to email!");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast.success("Login Successful");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const mfaMutation = useMutation({
    mutationFn: verifyMfa,
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast.success("Login verified successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  });

  useEffect(() => {
    if (!mfaToken) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mfaToken]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleMfaSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }
    mfaMutation.mutate({ token: mfaToken, otp });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
        
        {!mfaToken ? (
          <>
            <h2 className="text-3xl font-extrabold text-white text-center tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-center text-sm mb-8">
              Sign in to your volunteer account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {mutation.isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-slate-400 text-sm text-center mt-8">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors duration-200"
              >
                Sign up
              </span>
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <span className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                <ShieldCheck className="w-8 h-8" />
              </span>
            </div>
            
            <h2 className="text-2xl font-extrabold text-white text-center tracking-tight mb-2">
              Security Verification
            </h2>
            <p className="text-slate-400 text-center text-sm mb-6">
              Please enter the 6-digit code sent to your registered email address.
            </p>

            <form onSubmit={handleMfaSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-center text-xl font-bold tracking-[8px] text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-slate-400 font-medium">Expires in:</span>
                  <span className={`font-bold ${countdown === 0 ? "text-red-500" : "text-blue-400"}`}>
                    {countdown === 0 ? "Code Expired" : formatTime(countdown)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={mfaMutation.isPending || countdown === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {mfaMutation.isPending ? "Verifying..." : "Verify Code"}
              </button>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    // Resend by trigger login request again
                    const values = handleSubmit((data) => data)();
                    if (values) {
                      mutation.mutate(values);
                    }
                  }}
                  disabled={countdown > 240} // 60 seconds throttle
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                  {countdown > 240 ? `Resend Code in ${countdown - 240}s` : "Resend Verification Code"}
                </button>

                <button
                  type="button"
                  onClick={() => setMfaToken(null)}
                  className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;