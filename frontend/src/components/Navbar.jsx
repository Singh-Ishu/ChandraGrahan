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
    <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 text-white hover:text-indigo-400 transition-colors">
            <Moon className="w-8 h-8" />
            <span className="text-2xl font-bold">ChandraGrahan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className={`text-lg font-medium transition-colors ${
                location.pathname === '/' ? 'text-indigo-400' : 'text-white hover:text-indigo-400'
              }`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === '/profile' ? 'text-indigo-400' : 'text-white hover:text-indigo-400'
                  }`}
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-6">
                  <span className="text-lg text-gray-300">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-lg text-white hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="btn-primary"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-indigo-400 transition-colors p-2"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-4 bg-black/50 backdrop-blur-xl rounded-2xl mt-4 border border-white/10">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-lg font-medium transition-colors rounded-lg ${
                  location.pathname === '/' ? 'text-indigo-400 bg-indigo-400/10' : 'text-white hover:text-indigo-400 hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-lg font-medium transition-colors rounded-lg ${
                      location.pathname === '/profile' ? 'text-indigo-400 bg-indigo-400/10' : 'text-white hover:text-indigo-400 hover:bg-white/5'
                    }`}
                  >
                    Profile
                  </Link>
                  <div className="px-4 py-3">
                    <span className="text-lg text-gray-300">Welcome, {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-lg text-white hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-white hover:text-indigo-400 transition-colors rounded-lg hover:bg-white/5"
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