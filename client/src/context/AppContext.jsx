import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL

const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/user/data', {headers: {Authorization: token}})
            if(data.success){
                setUser(data.user)
            } else {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    }

    // Optimistic create — instantly adds chat, no extra fetch
    const createNewChat = async () => {
        try {
            if(!user) return toast('Login to create a new chat');
            navigate('/')
            const {data} = await axios.post('/api/chat/create', {}, {headers: {Authorization: token}})
            if(data.success){
                if(data.chat){
                    setChats(prev => [data.chat, ...prev]);
                    setSelectedChat(data.chat);
                } else {
                    // Chat created on server but response missing chat — refresh list
                    await fetchUserChats();
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserChats = async () => {
        try {
            const {data} = await axios.get('/api/chat/get', {headers: {Authorization: token}})
            if(data.success){
                setChats(data.chats)
                if(data.chats.length === 0){
                    return await createNewChat();
                }
                setSelectedChat(prev => {
                    const match = data.chats.find(c => c._id === prev?._id);
                    return match || data.chats[0];
                })
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Optimistic single delete
    const deleteChat = async (chatId) => {
        const prevChats = [...chats];
        const remaining = chats.filter(c => c._id !== chatId);
        setChats(remaining);
        if(selectedChat?._id === chatId) setSelectedChat(remaining[0] || null);
        try {
            const {data} = await axios.post('/api/chat/delete', {chatId}, {headers: {Authorization: token}})
            if(data.success){
                toast.success(data.message)
                if(remaining.length === 0) await createNewChat();
            } else {
                toast.error(data.message)
                setChats(prevChats);
            }
        } catch (error) {
            toast.error(error.message)
            setChats(prevChats);
        }
    }

    // Optimistic bulk delete
    const bulkDeleteChats = async (chatIds) => {
        const prevChats = [...chats];
        const remaining = chats.filter(c => !chatIds.includes(c._id));
        setChats(remaining);
        if(chatIds.includes(selectedChat?._id)) setSelectedChat(remaining[0] || null);
        try {
            const {data} = await axios.post('/api/chat/bulk-delete', {chatIds}, {headers: {Authorization: token}})
            if(data.success){
                toast.success(data.message)
                if(remaining.length === 0) await createNewChat();
            } else {
                toast.error(data.message)
                setChats(prevChats);
            }
        } catch (error) {
            toast.error(error.message)
            setChats(prevChats);
        }
    }

    // Optimistic rename
    const renameChat = async (chatId, name) => {
        const prevChats = [...chats];
        setChats(prev => prev.map(c => c._id === chatId ? {...c, name} : c));
        if(selectedChat?._id === chatId) setSelectedChat(prev => ({...prev, name}));
        try {
            const {data} = await axios.post('/api/chat/rename', {chatId, name}, {headers: {Authorization: token}})
            if(!data.success){
                toast.error(data.message)
                setChats(prevChats);
            }
        } catch (error) {
            toast.error(error.message)
            setChats(prevChats);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setChats([]);
        setSelectedChat(null);
        navigate('/');
        toast.success('Logged out');
    }

    useEffect(()=>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    },[theme])

    useEffect(()=>{
        if(user){
            fetchUserChats();
        }
        else{
            setChats([]);
            setSelectedChat(null);
        }
    },[user])

    useEffect(()=>{
        if(token){
            fetchUser();
        }
    },[token])

    const value = {
        navigate, user, setUser, chats, setChats, selectedChat, setSelectedChat,
        theme, setTheme, token, setToken, axios, createNewChat, deleteChat, logout,
        fetchUserChats, renameChat, bulkDeleteChats
    }


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext);