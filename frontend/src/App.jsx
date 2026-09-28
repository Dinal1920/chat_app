import { Navigate, Route, Routes } from "react-router-dom";
import {Loader } from 'lucide-react'
import {Toaster} from 'react-hot-toast'

import Navbar from "./components/Navbar";
import {HomePage, SignUpPage, LoginPage, SettingsPage, ProfilePage} from './pages/index.js'
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {currentTheme} =useThemeStore()

  useEffect(() => {
    checkAuth() 
  }, [checkAuth])
  
  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-pulse" />  {/* loading component */} 
      </div>
    )
  }

  return (
    <div data-theme={currentTheme}>
      <Navbar />

      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login" /> } />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to='/'/> } /> 
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to='/' /> } />
        <Route path="/settings" element={ <SettingsPage /> } />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to='/login'/> } />
      </Routes>
    
      <Toaster />
    </div>
  );
};

export default App;
