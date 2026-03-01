import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Message from './Message';
import toast from 'react-hot-toast';

const ChatBox = () => {

const containerRef = useRef(null);

  const {selectedChat, theme, user, axios, token, setUser} = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!user) return toast('Login to send a message');
      if (!prompt.trim()) return;
      if (!selectedChat?._id) return toast.error("No chat selected");

      setLoading(true);

      const promptCopy = prompt;
      setPrompt('');

      setMessages(prev => [
        ...prev,
        { role: 'user', content: promptCopy, timestamp: Date.now(), isImage: false }
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat._id, prompt: promptCopy, isPublished },
        { headers: { Authorization: token }, timeout: mode === 'image' ? 90000 : 30000 }
      );

      if (data.success) {
        setMessages(prev => [...prev, data.reply]);

        setUser(prev => ({
          ...prev,
          credits: mode === 'image' ? prev.credits - 2 : prev.credits - 1
        }));

      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages || selectedChat.message || [])
    }
  },[selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior:"smooth",
      })
    }
  },[messages])


  return (
    <div className='flex-1 flex flex-col justify-between relative bg-[var(--bg-base)] overflow-hidden'>
      {/* Subtle background mesh */}
      <div className='absolute inset-0 gradient-mesh pointer-events-none opacity-50' />
      
      <div className='relative z-10 flex-1 flex flex-col min-h-0 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-4'>
        {/* Chat Messages */}
        <div ref={containerRef} className='flex-1 min-h-0 overflow-y-auto premium-scroll pb-4'>
          {messages.length === 0 && (
            <div className='h-full flex flex-col items-center justify-center gap-4'>
              <div className='w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center animate-pulse-glow'>
                <img src={assets.logo} alt="" className='w-8 h-8' />
              </div>
              <div className='text-center space-y-2'>
                <p className='text-3xl sm:text-4xl font-bold text-[var(--text-heading)]'>How can I help?</p>
                <p className='text-[var(--text-muted)] text-sm'>Ask anything or generate images with AI</p>
              </div>
              
              {/* Quick Suggestions */}
              <div className='flex flex-wrap items-center justify-center gap-2 mt-6 max-w-lg'>
                {['Explain quantum computing', 'Write a poem', 'Generate an image', 'Help me code'].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(suggestion)}
                    className='px-4 py-2 text-xs text-[var(--text-secondary)] glass rounded-xl hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-all cursor-pointer'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index)=> <Message key={index} message={message}/>)}

          {/* Typing Indicator */}
          {loading && (
            <div className='flex items-start gap-3 my-4 animate-fade-in-up'>
              <div className='w-7 h-7 rounded-lg gradient-purple flex items-center justify-center flex-shrink-0'>
                <img src={assets.logo} alt="" className='w-4 h-4' />
              </div>
              <div className='glass rounded-xl px-4 py-3'>
                <div className='loader flex items-center gap-1.5'>
                  <div className='w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce' />
                  <div className='w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce' />
                  <div className='w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce' />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Publish Toggle */}
        {mode === 'image' && (
          <label className='flex-shrink-0 inline-flex items-center justify-center gap-2 mb-3 text-sm mx-auto cursor-pointer'>
            <p className='text-xs text-[var(--text-secondary)]'>Publish to Community</p>
            <div className='relative inline-flex'>
              <input type="checkbox" className='sr-only peer' checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)}/>
              <div className='w-8 h-4.5 bg-[var(--bg-surface)] rounded-full peer-checked:bg-purple-600 transition-all' />
              <span className='absolute left-0.5 top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-3.5 shadow-sm' />
            </div>
          </label>
        )}

        {/* Input Area */}
        <form onSubmit={onSubmit} className='flex-shrink-0 glass-strong rounded-2xl p-2 flex items-center gap-2 input-glow transition-all'>
          {/* Mode Selector */}
          <select
            onChange={(e)=>setMode(e.target.value)} value={mode}
            className='text-sm px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-main)] text-[var(--text-secondary)] outline-none cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-all appearance-none'
          >
            <option className='bg-[var(--bg-base)]' value="text">💬 Text</option>
            <option className='bg-[var(--bg-base)]' value="image">🎨 Image</option>
          </select>

          {/* Text Input */}
          <input
            onChange={(e)=>setPrompt(e.target.value)} value={prompt}
            type="text"
            placeholder='Message Nexus...'
            className='flex-1 w-full text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent outline-none px-2'
            required
          />

          {/* Send Button */}
          <button
            disabled={loading}
            className='w-9 h-9 rounded-xl gradient-purple flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-90 disabled:opacity-40 transition-all'
          >
            {loading ? (
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
            ) : (
              <img src={assets.send_icon} className='w-4 invert' alt="" />
            )}
          </button>
        </form>
        
        <p className='text-center text-[10px] text-[var(--text-muted)] mt-2'>Nexus can make mistakes. Verify important information.</p>
      </div>
    </div>
  )
}

export default ChatBox
