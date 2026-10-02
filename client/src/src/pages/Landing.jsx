import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Calendar, Sparkles, Shield, Activity, Globe, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] transition-colors duration-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[30%] rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[120px]"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlMmU4ZjAiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/70 dark:bg-[#020817]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <span className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">VolunteerHub</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</a>
              </div>
              
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

              {user ? (
                <Link to="/dashboard" className="text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-50 px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2">
                  Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block">
                    Sign In
                  </Link>
                  <Link to="/register" className="text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-50 px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 hidden sm:block">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 lg:pt-48 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 border border-indigo-100 dark:border-indigo-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Join 10,000+ active volunteers
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8">
                Empower your <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500">
                  community
                </span> today.
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                VolunteerHub is the ultimate platform to discover local events, track your social impact, and connect with organizations making a real difference.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                  Start Volunteering <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/events" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-full font-bold text-lg transition-all hover:border-slate-300 dark:hover:border-slate-700">
                  Browse Events
                </Link>
              </div>
              
              {!user && (
                <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Want to try it out? Use <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">demo123@gmail.com</Link> / Demo123
                </div>
              )}

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-70 grayscale">
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Trusted by</div>
                <div className="flex gap-6">
                  <div className="text-xl font-black text-slate-400 dark:text-slate-500">UNICEF</div>
                  <div className="text-xl font-black text-slate-400 dark:text-slate-500">RedCross</div>
                  <div className="text-xl font-black text-slate-400 dark:text-slate-500">Oxfam</div>
                </div>
              </div>
            </div>

            {/* Hero Image/UI Mockup */}
            <div className="relative lg:ml-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl transform rotate-3 scale-105 opacity-20 dark:opacity-30 blur-2xl"></div>
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-2xl">
                
                {/* Mockup Header */}
                <div className="h-10 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                
                {/* Mockup Content */}
                <div className="p-2 sm:p-4 relative">
                  <img src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&q=80&w=1000" alt="Volunteer Dashboard" className="rounded-2xl w-full h-[300px] sm:h-[400px] object-cover" />
                  
                  {/* Floating cards */}
                  <div className="absolute -left-2 sm:-left-6 bottom-12 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{animationDuration: '3s'}}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Application</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Approved!</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-2 sm:-right-6 top-12 sm:top-32 bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Hours Logged</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">+ 24 Hrs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200 dark:divide-slate-800">
            <StatBox number="500+" label="Active Events" />
            <StatBox number="10k+" label="Volunteers" />
            <StatBox number="50k+" label="Hours Donated" />
            <StatBox number="120+" label="NGO Partners" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wide uppercase text-sm mb-3">Core Features</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">Everything you need to make a difference.</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">VolunteerHub provides powerful tools for both volunteers and organizers to connect, manage, and track their impact efficiently.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-blue-500" />}
              title="Discover Opportunities"
              description="Find events tailored to your skills, location, and passions with our advanced filtering system."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-emerald-500" />}
              title="Secure & Verified"
              description="All organizations are verified to ensure your time and efforts are going to legitimate causes."
            />
            <FeatureCard 
              icon={<Activity className="w-8 h-8 text-rose-500" />}
              title="Impact Analytics"
              description="Visualize your contribution with detailed charts, hours logged, and certificates of appreciation."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to start your journey?</h2>
              <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">Join thousands of others who are already making a positive impact in their communities. It takes less than 2 minutes to sign up.</p>
              <Link to={user ? "/dashboard" : "/register"} className="inline-flex justify-center items-center gap-2 text-indigo-600 bg-white hover:bg-slate-50 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#020817] pt-16 pb-8 border-t border-slate-200 dark:border-slate-800/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-2xl text-slate-900 dark:text-white">VolunteerHub</span>
            </div>
            <div className="flex gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-slate-400 dark:text-slate-500 text-sm">
            © {new Date().getFullYear()} VolunteerHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const StatBox = ({ number, label }) => (
  <div className="text-center px-4">
    <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">{number}</div>
    <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 group">
    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300 shadow-inner">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{description}</p>
  </div>
);

export default Landing;
