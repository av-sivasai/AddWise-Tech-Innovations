import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../redux/user/user.slice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Navbar";
import { useRef, useEffect, useState } from 'react';

const SimpleFooter = () => (
  <footer className="w-full border-t border-gray-800 py-6 bg-gray-900 text-center mt-16">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2">
      <div className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Innovate. All rights reserved.</div>
      <div className="flex gap-4 text-sm">
        <a href="#" className="hover:underline text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:underline text-gray-300 hover:text-purple-400 transition-colors">Terms</a>
        <a href="#" className="hover:underline text-gray-300 hover:text-purple-400 transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

function useFadeInOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return [ref, visible];
}

const HomePage = () => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Animation for hero section
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => { if (heroRef.current) observer.unobserve(heroRef.current); };
  }, []);

  const handlelogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'get',
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        toast.error("Logout failed. Please check your credentials.");
        return;
      }
      dispatch(removeUser());
      toast.success("Logout successful! Redirecting...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-900">
      <Navbar/>
      <div
        className="relative flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 group/design-root overflow-x-hidden"
        style={{ fontFamily: "Inter, Noto Sans, sans-serif" }}
      >
        {/* Hero Section - Dark Theme Redesign */}
        <section
          ref={heroRef}
          className={`transition-all duration-1000 ease-in-out transform ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} w-full flex flex-col items-center justify-center min-h-[60vh] pt-24 pb-16 px-4 text-center relative overflow-hidden`}
        >
          {/* Dark theme background elements */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
            <div className="w-[800px] h-[800px] bg-gradient-to-tr from-purple-900 via-gray-800 to-blue-900 opacity-60 rounded-full blur-3xl animate-pulse-slow"></div>
            {/* Animated floating shapes */}
            <div className="absolute left-1/4 top-10 animate-float-slow">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 opacity-30 rounded-full blur-xl"></div>
            </div>
            <div className="absolute right-1/4 bottom-20 animate-float-reverse-slow">
              <div className="w-40 h-40 bg-gradient-to-br from-amber-600 to-pink-600 opacity-20 rounded-full blur-xl"></div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center max-w-6xl mx-auto">
            <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
              Unleash Your Team's Potential<br/>
              <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-text-gradient">
                with Innovate
              </span>
            </h1>
            <h2 className="text-gray-300 text-lg md:text-xl font-normal max-w-2xl mb-8">
              A modern platform designed for productivity, seamless collaboration, and growth. Plan, track, and accomplish more as a team.
            </h2>
            <a 
              href="#features" 
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 border border-transparent hover:border-purple-400 animate-fade-in-up"
            >
              Get Started
            </a>
            {user.isLoggedIn && (
              <p className="text-lg text-white font-bold mt-6">
                Hi, welcome back{user.user.name ? `, ${user.user.name}` : ""}!
              </p>
            )}
          </div>
        </section>

        {/* Features Section - Dark Theme */}
        <section id="features" className="w-full py-20 px-2 bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-white text-center">Why Choose Innovate?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '⚡', title: 'Fast & Modern', desc: 'Lightning-fast, intuitive interface for all your needs.', color: 'from-purple-900 to-gray-800' },
                { icon: '🤝', title: 'Collaboration', desc: 'Work together in real-time, wherever you are.', color: 'from-blue-900 to-gray-800' },
                { icon: '🔒', title: 'Secure', desc: 'Your data is protected with industry-leading security.', color: 'from-gray-800 to-gray-900' },
                { icon: '📱', title: 'Mobile Ready', desc: 'Access your workspace from any device, anytime.', color: 'from-gray-900 to-purple-900' },
              ].map((f, i) => {
                const [ref, visible] = useFadeInOnScroll();
                return (
                  <div
                    key={f.title}
                    ref={ref}
                    className={`flex flex-col items-center p-8 rounded-2xl shadow-xl bg-gradient-to-br ${f.color} border border-gray-700 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  >
                    <div className="text-5xl mb-4">{f.icon}</div>
                    <div className="text-xl font-bold mb-2 text-white">{f.title}</div>
                    <div className="text-gray-300 text-center">{f.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Dark Theme */}
        <section className="w-full py-20 px-2 bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-white text-center">What Our Users Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Aarav', text: 'Innovate transformed our workflow. The UI is so clean and easy to use!', color: 'from-purple-900 to-gray-800' },
                { name: 'Priya', text: 'Collaboration has never been easier. Our team loves it!', color: 'from-blue-900 to-gray-800' },
                { name: 'Rahul', text: 'Secure, fast, and reliable. Highly recommended for any team.', color: 'from-gray-800 to-gray-900' },
              ].map((t, i) => {
                const [ref, visible] = useFadeInOnScroll();
                return (
                  <div
                    key={t.name}
                    ref={ref}
                    className={`rounded-2xl p-8 shadow-xl bg-gradient-to-br ${t.color} border border-gray-700 transition-all duration-700 hover:scale-[1.02] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  >
                    <div className="text-lg italic mb-4 text-gray-200">"{t.text}"</div>
                    <div className="font-bold text-white">- {t.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section - Dark Theme */}
        <section id="pricing" className="w-full py-20 px-2 bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-white text-center">Simple Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { plan: 'Starter', price: 'Free', features: ['Basic features', 'Community support', 'Single user'], color: 'border-purple-500' },
                { plan: 'Pro', price: '$9/mo', features: ['All Starter features', 'Team collaboration', 'Priority support'], color: 'border-blue-500' },
                { plan: 'Enterprise', price: 'Contact Us', features: ['Custom solutions', 'Dedicated manager', 'Advanced security'], color: 'border-purple-600' },
              ].map((p, i) => {
                const [ref, visible] = useFadeInOnScroll();
                return (
                  <div
                    key={p.plan}
                    ref={ref}
                    className={`rounded-2xl p-8 shadow-2xl bg-gray-900 border-2 ${p.color} transition-all duration-700 flex flex-col items-center hover:shadow-purple-500/20 hover:-translate-y-2 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  >
                    <div className="text-xl font-bold mb-2 text-white">{p.plan}</div>
                    <div className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {p.price}
                    </div>
                    <ul className="mb-6 text-gray-300 text-center space-y-2">
                      {p.features.map(f => <li key={f}>• {f}</li>)}
                    </ul>
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-purple-700 hover:to-blue-700 transition-all duration-300 border border-transparent hover:border-purple-400">
                      Choose
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <ToastContainer 
          position="top-center" 
          autoClose={2000} 
          theme="dark"
          toastClassName="bg-gray-800 border border-gray-700 rounded-lg"
          progressClassName="bg-gradient-to-r from-purple-500 to-blue-500"
        />
        <SimpleFooter />
      </div>
      
      {/* Global Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-2deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-reverse-slow {
          animation: float-reverse 10s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 12s ease-in-out infinite;
        }
        .animate-text-gradient {
          background-size: 200% 200%;
          animation: text-gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;