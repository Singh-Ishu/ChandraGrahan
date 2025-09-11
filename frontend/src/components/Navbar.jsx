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
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Moon className="navbar-logo-icon" />
            <span className="navbar-logo-text">ChandraGrahan</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            <Link 
              to="/" 
              className={`navbar-link ${location.pathname === '/' ? 'navbar-link-active' : ''}`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`navbar-link ${location.pathname === '/profile' ? 'navbar-link-active' : ''}`}
                >
                  Profile
                </Link>
                <div className="navbar-user-section">
                  <span className="navbar-welcome">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="navbar-logout"
                  >
                    <LogOut className="navbar-logout-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="btn-primary"
              >
                <User className="btn-icon" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="navbar-mobile-toggle">
            <button
              onClick={toggleMenu}
              className="navbar-mobile-button"
            >
              {isMenuOpen ? <X className="navbar-mobile-icon" /> : <Menu className="navbar-mobile-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="navbar-mobile">
            <div className="navbar-mobile-menu">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`navbar-mobile-link ${location.pathname === '/' ? 'navbar-mobile-link-active' : ''}`}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`navbar-mobile-link ${location.pathname === '/profile' ? 'navbar-mobile-link-active' : ''}`}
                  >
                    Profile
                  </Link>
                  <div className="navbar-mobile-user">
                    <span className="navbar-mobile-welcome">Welcome, {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="navbar-mobile-logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                  className="navbar-mobile-link"
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