import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, ChevronDown, Calendar, Edit, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin, isLoading, authStatus } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = !!user;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 ${
      isAuthenticated ? 'animate-slide-in-top' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 text-blue-600">
              <div className="w-6 h-6 md:w-8 md:h-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    clipRule="evenodd" 
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" 
                    fill="currentColor" 
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-blue-600 text-xl md:text-2xl font-bold tracking-tight">Evently</h1>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Dashboard link for admins */}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors font-medium ${
                  isActive('/admin') 
                    ? 'text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg border border-blue-200' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg'
                }`}
              >
                Dashboard
              </Link>
            )}
            

            
            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin ? (
                                     /* Admin Profile Dropdown */
                   <div className="relative" ref={dropdownRef}>
                     <button
                       onClick={toggleProfileDropdown}
                       className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
                     >
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full border-2 border-gray-200"
                  />
                       <span className="font-medium hidden sm:block">{user?.name}</span>
                       <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>
                     
                     {/* Dropdown Menu */}
                     {isProfileDropdownOpen && (
                       <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] sm:max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in transform origin-top-right transition-all duration-200 ease-out scale-100">
                         <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl">
                           {/* User Info Header */}
                           <div className="px-4 sm:px-6 py-4 border-b border-white/10">
                             <div className="flex items-center space-x-3">
                               <img
                                 src={user?.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'}
                                 alt={user?.name}
                                 className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white/30 shadow-lg"
                               />
                               <div className="flex-1 min-w-0">
                                 <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{user?.name}</p>
                                 <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.email}</p>
                               </div>
                             </div>
                             <span className="inline-block mt-3 px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-700 rounded-full border border-blue-300/30 backdrop-blur-sm">
                               Administrator
                             </span>
                           </div>
                           
                           {/* Menu Items */}
                           <div className="py-2">
                             <Link
                               to="/"
                               onClick={() => setIsProfileDropdownOpen(false)}
                               className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base transition-all duration-200 group backdrop-blur-sm ${
                                 isActive('/') 
                                   ? 'text-blue-700 bg-blue-500/20 border-l-4 border-blue-500' 
                                   : 'text-gray-800 hover:bg-white/20 hover:text-blue-700'
                               }`}
                             >
                               <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 border border-blue-300/20 mr-3 sm:mr-4 group-hover:bg-blue-500/20 group-hover:border-blue-400/30 transition-all duration-200">
                                 <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                               </div>
                               <span className="font-medium">Browse Events</span>
                             </Link>
                             
                             <button
                               onClick={handleLogout}
                               disabled={isLoading}
                               className={`w-full flex items-center px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base transition-all duration-200 group backdrop-blur-sm ${
                                 isLoading 
                                   ? 'text-gray-500 cursor-not-allowed' 
                                   : 'text-gray-800 hover:bg-red-500/10 hover:text-red-700'
                               }`}
                             >
                               <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-3 sm:mr-4 transition-all duration-200 ${
                                 isLoading 
                                   ? 'bg-gray-500/10 border border-gray-300/20' 
                                   : 'bg-red-500/10 border border-red-300/20 group-hover:bg-red-500/20 group-hover:border-red-400/30'
                               }`}>
                                 {isLoading ? (
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                                 ) : (
                                   <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                                 )}
                               </div>
                               <span className="font-medium">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                             </button>
                           </div>
                         </div>
                       </div>
                     )}
                  </div>
                                 ) : (
                   /* Regular User Dropdown */
                   <div className="relative" ref={dropdownRef}>
                     <button
                       onClick={toggleProfileDropdown}
                       className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
                     >
                       <img
                         src={user?.avatar || 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'}
                         alt={user?.name}
                         className="h-8 w-8 rounded-full border-2 border-gray-200"
                       />
                       <span className="font-medium hidden sm:block">{user?.name}</span>
                       <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>
                     
                     {/* User Dropdown Menu */}
                     {isProfileDropdownOpen && (
                       <div className="absolute right-0 mt-3 w-72 max-w-[calc(100vw-2rem)] sm:max-w-xs bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in transform origin-top-right transition-all duration-200 ease-out scale-100">
                         <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl">
                           {/* User Info Header */}
                           <div className="px-4 py-3 border-b border-white/10">
                             <div className="flex items-center space-x-3">
                               <img
                                 src={user?.avatar || 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'}
                                 alt={user?.name}
                                 className="h-8 w-8 rounded-full border-2 border-white/30 shadow-lg"
                               />
                               <div className="flex-1 min-w-0">
                                 <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                                 <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                               </div>
                             </div>
                           </div>
                           
                           {/* Menu Items */}
                           <div className="py-1">
                             <Link
                               to="/my-events"
                               onClick={() => setIsProfileDropdownOpen(false)}
                               className={`flex items-center px-4 py-2.5 text-sm transition-all duration-200 group backdrop-blur-sm ${
                                 isActive('/my-events') 
                                   ? 'text-blue-700 bg-blue-500/20 border-l-4 border-blue-500' 
                                   : 'text-gray-800 hover:bg-white/20 hover:text-blue-700'
                               }`}
                             >
                               <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-300/20 mr-3 group-hover:bg-blue-500/20 group-hover:border-blue-400/30 transition-all duration-200">
                                 <Calendar className="h-3.5 w-3.5 text-blue-600" />
                               </div>
                               <span className="font-medium">My Events</span>
                             </Link>
                             
                             <Link
                               to="/profile"
                               onClick={() => setIsProfileDropdownOpen(false)}
                               className={`flex items-center px-4 py-2.5 text-sm transition-all duration-200 group backdrop-blur-sm ${
                                 isActive('/profile') 
                                   ? 'text-blue-700 bg-blue-500/20 border-l-4 border-blue-500' 
                                   : 'text-gray-800 hover:bg-white/20 hover:text-blue-700'
                               }`}
                             >
                               <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/10 border border-green-300/20 mr-3 group-hover:bg-green-500/20 group-hover:border-green-400/30 transition-all duration-200">
                                 <Edit className="h-3.5 w-3.5 text-green-600" />
                               </div>
                               <span className="font-medium">Edit Profile</span>
                             </Link>
                             
                             <Link
                               to="/change-password"
                               onClick={() => setIsProfileDropdownOpen(false)}
                               className={`flex items-center px-4 py-2.5 text-sm transition-all duration-200 group backdrop-blur-sm ${
                                 isActive('/change-password') 
                                   ? 'text-blue-700 bg-blue-500/20 border-l-4 border-blue-500' 
                                   : 'text-gray-800 hover:bg-white/20 hover:text-blue-700'
                               }`}
                             >
                               <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-300/20 mr-3 group-hover:bg-purple-500/20 group-hover:border-purple-400/30 transition-all duration-200">
                                 <Lock className="h-3.5 w-3.5 text-purple-600" />
                </div>
                               <span className="font-medium">Change Password</span>
                             </Link>
                             
                <button
                  onClick={handleLogout}
                               disabled={isLoading}
                               className={`w-full flex items-center px-4 py-2.5 text-sm transition-all duration-200 group backdrop-blur-sm ${
                                 isLoading 
                                   ? 'text-gray-500 cursor-not-allowed' 
                                   : 'text-gray-800 hover:bg-red-500/10 hover:text-red-700'
                               }`}
                             >
                               <div className={`flex items-center justify-center w-7 h-7 rounded-lg mr-3 transition-all duration-200 ${
                                 isLoading 
                                   ? 'bg-gray-500/10 border border-gray-300/20' 
                                   : 'bg-red-500/10 border border-red-300/20 group-hover:bg-red-500/20 group-hover:border-red-400/30'
                               }`}>
                                 {isLoading ? (
                                   <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gray-500"></div>
                                 ) : (
                                   <LogOut className="h-3.5 w-3.5 text-red-600" />
                                 )}
                               </div>
                               <span className="font-medium">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                </button>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors border border-gray-200"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/90 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Dashboard link for admins on mobile */}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`block text-base font-medium transition-colors mx-3 rounded-lg ${
                  isActive('/admin') 
                    ? 'text-blue-600 font-semibold bg-blue-50 px-3 py-3 border border-blue-200' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            

            
            {isAuthenticated ? (
              <div className="pt-4 pb-2 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <img
                    src={user?.avatar || (isAdmin 
                      ? 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
                      : 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'
                    )}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full border-2 border-gray-200"
                  />
                  <div className="ml-3">
                    <span className="text-gray-700 font-medium block">{user?.name}</span>
                    {isAdmin && (
                      <span className="text-xs text-blue-600 font-medium">Admin</span>
                    )}
                    {!isAdmin && (
                      <span className="text-xs text-gray-500 font-medium">User</span>
                    )}
                  </div>
                </div>
                
                                                 {/* Mobile Admin Menu */}
                {isAdmin && (
                  <Link
                    to="/"
                    className={`block text-base font-medium transition-colors mx-3 rounded-lg ${
                      isActive('/') 
                        ? 'text-blue-600 font-semibold bg-blue-50 px-3 py-3 border border-blue-200' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Events</span>
                    </div>
                  </Link>
                )}
                
                {/* Mobile User Menu */}
                {!isAdmin && (
                  <>
                    <Link
                      to="/my-events"
                      className={`block text-base font-medium transition-colors mx-3 rounded-lg ${
                        isActive('/my-events') 
                          ? 'text-blue-600 font-semibold bg-blue-50 px-3 py-3 border border-blue-200' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>My Events</span>
                      </div>
                    </Link>
                    
                    <Link
                      to="/profile"
                      className={`block text-base font-medium transition-colors mx-3 rounded-lg ${
                        isActive('/profile') 
                          ? 'text-blue-600 font-semibold bg-blue-50 px-3 py-3 border border-blue-200' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </div>
                    </Link>
                    
                    <Link
                      to="/change-password"
                      className={`block text-base font-medium transition-colors mx-3 rounded-lg ${
                        isActive('/change-password') 
                          ? 'text-blue-600 font-semibold bg-blue-50 px-3 py-3 border border-blue-200' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-3'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Change Password</span>
                      </div>
                    </Link>
                  </>
                )}
                
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isLoading 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                    ) : (
                    <LogOut className="h-4 w-4" />
                    )}
                    <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-base font-medium mx-3 text-center transition-colors border border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </div>
                </Link>
                <Link
                  to="/signup"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium mx-3 text-center transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 