import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const Login = () => {

  const { setToken, axios } = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (state === "register") {
        const { data } = await axios.post('/api/user/register', { name, email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Account created successfully');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post('/api/user/login', { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success('Logged in successfully');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A12]'>
      {/* Animated Orbs */}
      <div className='orb orb-purple w-[500px] h-[500px] -top-40 -left-40 animate-float' />
      <div className='orb orb-blue w-[400px] h-[400px] -bottom-32 -right-32 animate-float delay-200' />
      <div className='orb orb-pink w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow' />

      {/* Main Card */}
      <div className='relative z-10 w-full max-w-md mx-4 animate-fade-in-up'>
        {/* Logo */}
        <div className='flex justify-center mb-8'>
          <img src={assets.logo_full} alt="ChadGPT" className='w-48 drop-shadow-lg' />
        </div>

        <form onSubmit={handleSubmit} className='glass-strong rounded-2xl p-8 sm:p-10 space-y-6'>
          {/* Header */}
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-white'>
              {state === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className='text-gray-400 text-sm'>
              {state === "login" ? "Sign in to continue to ChadGPT" : "Get started with ChadGPT today"}
            </p>
          </div>

          {/* Input Fields */}
          <div className='space-y-4'>
            {state === "register" && (
              <div className='space-y-1.5'>
                <label className='text-sm font-medium text-gray-300'>Full Name</label>
                <input
                  onChange={(e) => setName(e.target.value)} value={name}
                  placeholder="John Doe"
                  className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300'
                  type="text" required
                />
              </div>
            )}
            <div className='space-y-1.5'>
              <label className='text-sm font-medium text-gray-300'>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)} value={email}
                placeholder="you@example.com"
                className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300'
                type="email" required
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium text-gray-300'>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)} value={password}
                placeholder="••••••••"
                className='w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all duration-300'
                type="password" required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='btn-premium w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                <span>Please wait...</span>
              </div>
            ) : (
              state === "register" ? "Create Account" : "Sign In"
            )}
          </button>

          {/* Toggle */}
          <p className='text-center text-sm text-gray-400'>
            {state === "register" ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => setState(state === "register" ? "login" : "register")}
              className='ml-1 text-purple-400 hover:text-purple-300 cursor-pointer font-medium transition-colors'
            >
              {state === "register" ? "Sign in" : "Sign up"}
            </span>
          </p>
        </form>

        {/* Footer */}
        <p className='text-center text-xs text-gray-600 mt-6'>
          Powered by Gemini AI &middot; Built with purpose
        </p>
      </div>
    </div>
  )
}

export default Login
