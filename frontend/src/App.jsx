import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ImageProvider } from './contexts/ImageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ImageProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </div>
        </Router>
      </ImageProvider>
    </AuthProvider>
  );
}

export default App;