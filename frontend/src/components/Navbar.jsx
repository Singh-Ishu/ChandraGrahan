import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Moon, User, LogOut, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Animate navbar on mount
    gsap.fromTo('.navbar', 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-colors">
            <Moon className="w-8 h-8" />
            <span className="text-xl font-bold">ChandraGrahan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-indigo-400' : 'text-white hover:text-indigo-400'
              }`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/profile' ? 'text-indigo-400' : 'text-white hover:text-indigo-400'
                  }`}
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-300">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm text-white hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="flex items-center space-x-1 btn-primary"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-indigo-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/40 backdrop-blur-md rounded-lg mt-2">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'text-indigo-400' : 'text-white hover:text-indigo-400'
                }`}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === '/profile' ? 'text-indigo-400' : 'text-white hover:text-indigo-400'
                    }`}
                  >
                    Profile
                  </Link>
                  <div className="px-3 py-2">
                    <span className="text-sm text-gray-300">Welcome, {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm text-white hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;