import React, { useState, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import moment from 'moment';

const Sidebar = ({ isMenuOpen, setIsMenuOpen}) => {

  const {chats, selectedChat, setSelectedChat, theme, setTheme, user, navigate, createNewChat, deleteChat, logout, renameChat, bulkDeleteChats} = useAppContext()
  const [search, setSearch] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const renameGuard = useRef(false);

  const filteredChats = chats.filter((chat) =>
    chat.messages?.[0]
      ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
      : chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (chatId) => {
    setSelectedIds(prev =>
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
  };

  const selectAll = () => {
    if(selectedIds.length === filteredChats.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredChats.map(c => c._id));
    }
  };

  const handleBulkDelete = async () => {
    if(selectedIds.length === 0) return;
    await bulkDeleteChats(selectedIds);
    setSelectedIds([]);
    setSelectMode(false);
  };

  const startEditing = (e, chat) => {
    e.stopPropagation();
    renameGuard.current = false;
    setEditingId(chat._id);
    setEditName(chat.name || (chat.messages?.[0]?.content?.slice(0, 32) || 'New Chat'));
  };

  const submitRename = (chatId) => {
    if(renameGuard.current) return;
    renameGuard.current = true;
    const name = editName.trim();
    setEditingId(null);
    if(name) renameChat(chatId, name);
    setTimeout(() => { renameGuard.current = false; }, 200);
  };

  const getChatLabel = (chat) => {
    if(chat.name && chat.name !== 'New Chat') return chat.name;
    return chat.messages?.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name;
  };

  return (
    <div className={`flex flex-col h-dvh h-screen w-72 p-4 bg-[var(--bg-sidebar)] border-r border-[var(--border-main)] backdrop-blur-2xl transition-all duration-500 max-md:fixed max-md:inset-y-0 left-0 z-50 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      
      {/* Logo */}
      <div className='flex items-center justify-between mb-6'>
        <img src={assets.logo_full} alt="ChadGPT" className='h-7'/>
        <img onClick={()=>setIsMenuOpen(false)} src={assets.close_icon} className='w-5 h-5 cursor-pointer md:hidden invert dark:invert-0 opacity-50 hover:opacity-100 transition-opacity' alt="" />
      </div>

      {/* New Chat Button */}
      <button onClick={createNewChat} className='btn-premium flex items-center justify-center gap-2 w-full py-2.5 text-sm text-white rounded-xl font-medium cursor-pointer'>
        <span className='text-lg leading-none'>+</span> New Chat
      </button>

      {/* Search */}
      <div className='flex items-center gap-2.5 px-3 py-2.5 mt-4 bg-[var(--bg-input)] border border-[var(--border-main)] rounded-xl input-glow transition-all'>
        <img src={assets.search_icon} className='w-4 opacity-40 invert dark:invert-0' alt=""/>
        <input onChange={(e)=>setSearch(e.target.value)} value={search} type='text' placeholder='Search conversations...' className='text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent outline-none w-full'/>
      </div>

      {/* Select Mode Toggle & Actions */}
      {chats.length > 0 && (
        <div className='flex items-center justify-between mt-5 mb-2 px-1'>
          <p className='text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]'>Recent</p>
          <div className='flex items-center gap-2'>
            {selectMode && (
              <>
                <button onClick={selectAll} className='text-[10px] text-purple-500 dark:text-purple-400 hover:text-purple-400 dark:hover:text-purple-300 cursor-pointer transition-colors'>
                  {selectedIds.length === filteredChats.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedIds.length > 0 && (
                  <button onClick={handleBulkDelete} className='text-[10px] text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 cursor-pointer transition-colors'>
                    Delete ({selectedIds.length})
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => { setSelectMode(!selectMode); setSelectedIds([]); }}
              className={`text-[10px] cursor-pointer transition-colors ${selectMode ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
            >
              {selectMode ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>
      )}
      
      {/* Chat List */}
      <div className='flex-1 overflow-y-scroll space-y-1 premium-scroll pr-1'>
        {filteredChats.map((chat) => (
          <div
            onClick={() => {
              if(selectMode) { toggleSelect(chat._id); return; }
              navigate('/'); setSelectedChat(chat); setIsMenuOpen(false);
            }}
            key={chat._id}
            className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-start gap-2 group transition-all duration-200 hover:bg-[var(--bg-surface-hover)] ${
              !selectMode && selectedChat?._id === chat._id ? 'bg-[var(--bg-surface-hover)] border border-[var(--border-main)]' : 'border border-transparent'
            } ${selectMode && selectedIds.includes(chat._id) ? 'bg-purple-500/10 border-purple-500/20' : ''}`}
          >
            {/* Checkbox in select mode */}
            {selectMode && (
              <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                selectedIds.includes(chat._id) ? 'bg-purple-600 border-purple-600' : 'border-[var(--text-muted)]'
              }`}>
                {selectedIds.includes(chat._id) && (
                  <svg className='w-2.5 h-2.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                )}
              </div>
            )}

            <div className='min-w-0 flex-1'>
              {editingId === chat._id ? (
                <form onSubmit={(e) => { e.preventDefault(); submitRename(chat._id); }} className='flex'>
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => submitRename(chat._id)}
                    onKeyDown={(e) => { if(e.key === 'Escape') { setEditingId(null); renameGuard.current = true; setTimeout(() => { renameGuard.current = false; }, 200); }}}
                    onClick={(e) => e.stopPropagation()}
                    className='text-sm text-[var(--text-primary)] bg-[var(--bg-input)] border border-purple-500/30 rounded-lg px-2 py-0.5 outline-none w-full'
                  />
                </form>
              ) : (
                <>
                  <p className='text-sm text-[var(--text-primary)] truncate'>{getChatLabel(chat)}</p>
                  <p className='text-[11px] text-[var(--text-muted)] mt-0.5'>{moment(chat.updatedAt).fromNow()}</p>
                </>
              )}
            </div>

            {/* Actions (rename + delete) on hover — only in non-select mode */}
            {!selectMode && editingId !== chat._id && (
              <div className='opacity-0 group-hover:opacity-100 flex items-center gap-1 flex-shrink-0 ml-1 transition-opacity'>
                <button
                  onClick={(e) => startEditing(e, chat)}
                  className='w-6 h-6 rounded flex items-center justify-center hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer'
                  title='Rename'
                >
                  <svg className='w-3.5 h-3.5 text-[var(--text-muted)]' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }}
                  className='w-6 h-6 rounded flex items-center justify-center hover:bg-red-500/20 transition-colors cursor-pointer'
                  title='Delete'
                >
                  <svg className='w-3.5 h-3.5 text-[var(--text-muted)] hover:text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className='space-y-2 pt-3 border-t border-[var(--border-main)]'>
        {/* Community */}
        <div onClick={()=>{navigate('/community'); setIsMenuOpen(false)}} className='flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-all group'>
          <img src={assets.gallery_icon} className='w-4 invert dark:invert-0 opacity-50 group-hover:opacity-80 transition-opacity' alt="" />
          <span className='text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'>Community</span>
        </div>

        {/* Credits */}
        <div onClick={()=>{navigate('/credits'); setIsMenuOpen(false)}} className='flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-all group'>
          <img src={assets.diamond_icon} className='w-4 invert-0 dark:invert opacity-50 group-hover:opacity-80 transition-opacity' alt="" />
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors'>Credits</span>
              <span className='text-xs font-semibold gradient-text'>{user?.credits}</span>
            </div>
          </div>
        </div>

        {/* Dark Mode */}
        <div className='flex items-center justify-between px-3 py-2.5 rounded-xl'>
          <div className='flex items-center gap-3'>
            <img src={assets.theme_icon} className='w-4 invert dark:invert-0 opacity-50' alt="" />
            <span className='text-sm text-[var(--text-secondary)]'>Theme</span>
          </div>
          <label className='relative inline-flex cursor-pointer'>
            <input onChange={()=> setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" className='sr-only peer' checked={theme === 'dark'}/>
            <div className='w-9 h-5 bg-[var(--bg-surface)] rounded-full peer-checked:bg-purple-600 transition-all'>
            </div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm'>
            </span>
          </label>
        </div>

        {/* User Account */}
        <div className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-surface-hover)] transition-all cursor-pointer group'>
          <div className='w-7 h-7 rounded-full gradient-purple flex items-center justify-center text-xs font-bold text-white flex-shrink-0'>
            {user ? user.name?.charAt(0).toUpperCase() : '?'}
          </div>
          <p className='flex-1 text-sm text-[var(--text-secondary)] truncate'>{user ? user.name : 'Login'}</p>
          {user && <img onClick={logout} src={assets.logout_icon} className='h-4 cursor-pointer invert dark:invert-0 opacity-50 group-hover:opacity-80 hover:opacity-100 transition-opacity'/>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
