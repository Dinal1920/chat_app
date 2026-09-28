import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const  {logout, authUser} = useAuthStore();
  const location = useLocation()

  return (
    <header 
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto h-16 px-4">
        <div className="flex items-center justify-between h-full">
            {/* left - logo */}
            <div className="flex items-center gap-8">
              <Link to='/' className="flex items-center gap-2.5 transition-all">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="text-primary size-5"/>
                </div>
                <h1 className="text-lg font-bold">Mitra-Chat</h1>
              </Link>
            </div>


            {/* right - btns */}
            <div className="flex items-center gap-2">
              {/* Setting */}
              <NavLink 
                to={location.pathname === '/settings' ? '/' : 'settings'}
                className= {`btn btn-sm gap-2 transition-colors 
                  ${location.pathname === '/settings' ? 'bg-primary/50' : '' }`}
              >
                <Settings className="size-4"/>
                <span className="hidden sm:inline">Settings</span>
              </NavLink>

              {authUser && (
                <>
                  {/* Profile */}
                  <Link 
                    to={location.pathname === '/profile' ? '/' : '/profile'} 
                    className= {`btn btn-sm gap-2 ${location.pathname === '/profile' ? 'bg-primary/60' : '' }`}
                  >
                    <User className="size-5"/>
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                  {/* Logout */}
                  <button className="flex gap-2 items-center" onClick={logout}>
                    <LogOut className="size-5"/>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}

            </div> 
        </div>
      </div>
    </header>
    
  )
}

export default Navbar