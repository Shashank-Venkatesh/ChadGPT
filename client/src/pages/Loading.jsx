import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { assets } from '../assets/assets';

const Loading = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      navigate('/')
    },8000)
    return ()=> clearTimeout(timeout);
  },[])

  return (
    <div className='fixed inset-0 bg-[#0A0A12] flex items-center justify-center z-50'>
      {/* Background orbs */}
      <div className='orb orb-purple w-[300px] h-[300px] top-1/4 left-1/4 animate-pulse-glow opacity-30' />
      <div className='orb orb-blue w-[200px] h-[200px] bottom-1/4 right-1/4 animate-float opacity-20' />
      
      <div className='relative z-10 flex flex-col items-center gap-6 animate-fade-in-up'>
        {/* Logo pulse */}
        <div className='w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center animate-pulse-glow'>
          <img src={assets.logo} alt="" className='w-8 h-8' />
        </div>
        
        {/* Spinner */}
        <div className='relative w-10 h-10'>
          <div className='absolute inset-0 rounded-full border-2 border-purple-500/20' />
          <div className='absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin' />
        </div>
        
        <p className='text-sm text-gray-500'>Loading ChadGPT...</p>
      </div>
    </div>
  )
}

export default Loading
