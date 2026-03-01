import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'

const App = () => {

  const {user} = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname} = useLocation();

  if(pathname === '/loading') return <Loading/>

  // Show landing page for unauthenticated users on root path
  if(!user && pathname === '/') return <LandingPage/>

  // Show login page
  if(!user && pathname === '/login') return <Login/>

  // Redirect to landing if not authenticated
  if(!user) return <LandingPage/>

  return (
    <div className='bg-[var(--bg-base)] text-[var(--text-primary)] min-h-screen min-h-dvh'>
      {/* Mobile menu button */}
      {!isMenuOpen && (
        <button
          onClick={()=>setIsMenuOpen(true)}
          className='fixed top-4 left-4 z-50 w-9 h-9 rounded-xl glass flex items-center justify-center md:hidden cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-all'
        >
          <img src={assets.menu_icon} className='w-5 h-5 invert dark:invert-0' alt="menu"/>
        </button>
      )}

      <div className='flex h-dvh h-screen w-screen overflow-hidden'>
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        <Routes>
          <Route path='/' element={<ChatBox/>}/> 
          <Route path='/credits' element={<Credits/>}/> 
          <Route path='/community' element={<Community/>}/> 
        </Routes>
      </div>
    </div>
  )
}

export default App
