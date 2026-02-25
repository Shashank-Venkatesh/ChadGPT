import { createContext, useContext, useEffect, useState } from "react";
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
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/user/data', {headers: {Authorization: token}})
            if(data.success){
                setUser(data.user)
            } else {
                // Token invalid or expired — clear it silently
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            // Server unreachable or auth failed — clear stale token
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    }

    const createNewChat = async () => {
        try {
            if(!user) return toast('Login to create a new chat');
            navigate('/')
            const {data} = await axios.post('/api/chat/create', {}, {headers: {Authorization: token}})
            if(data.success){
                await fetchUserChats()
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

    const deleteChat = async (chatId) => {
        try {
            const {data} = await axios.post('/api/chat/delete', {chatId}, {headers: {Authorization: token}})
            if(data.success){
                toast.success(data.message)
                await fetchUserChats()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
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
        fetchUserChats
    }


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext);