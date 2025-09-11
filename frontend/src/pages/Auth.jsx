import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Loader } from 'lucide-react';
import { gsap } from 'gsap';

const Auth = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const authRef = useRef();

  useEffect(() => {
    if (authRef.current) {
      gsap.fromTo('.auth-form',
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        navigate('/');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div ref={authRef} className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="auth-form card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400">
              {isLogin 
                ? 'Sign in to enhance your images' 
                : 'Join us to start enhancing your low light images'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              Your images are automatically deleted after 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;