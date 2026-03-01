import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({message}) => {

  useEffect(() => {
    Prism.highlightAll();
  },[message.content])

  return (
    <div className='animate-fade-in-up'>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-3 gap-2.5'>
          <div className='flex flex-col gap-1.5 px-4 py-3 bg-[var(--msg-user-bg)] border border-[var(--msg-user-border)] rounded-2xl rounded-tr-md max-w-2xl'>
            <p className='text-sm text-[var(--text-primary)] leading-relaxed'>{message.content}</p>
            <span className='text-[10px] text-[var(--text-muted)] text-right'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <div className='w-7 h-7 rounded-full gradient-purple flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5'>
            U
          </div>
        </div>
      ) : (
        <div className='flex items-start gap-2.5 my-3'>
          <div className='w-7 h-7 rounded-lg gradient-purple flex items-center justify-center flex-shrink-0 mt-0.5'>
            <img src={assets.logo} alt="" className='w-4 h-4' />
          </div>
          <div className='flex flex-col gap-1.5 px-4 py-3 bg-[var(--msg-ai-bg)] border border-[var(--msg-ai-border)] rounded-2xl rounded-tl-md max-w-2xl'>
            {message.isImage ? (
              <img src={message.content} alt="" className='w-full max-w-md rounded-xl shadow-lg'/>
            ) : (
              <div className='text-sm text-[var(--text-primary)] leading-relaxed reset-tw'><Markdown>{message.content}</Markdown></div>
            )}
            <span className='text-[10px] text-[var(--text-muted)]'>{moment(message.timestamp).fromNow()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Message
