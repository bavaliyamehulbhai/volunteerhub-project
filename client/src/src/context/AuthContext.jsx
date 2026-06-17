import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { logoutUser } from "../services/authService";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Failed to clear cookie on logout", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);