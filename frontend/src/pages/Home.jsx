import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThreeBackground from '../components/ThreeBackground';
import ImageUploader from '../components/ImageUploader';
import { Sparkles, Zap, Shield, Clock } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { user } = useAuth();
  const heroRef = useRef();
  const featuresRef = useRef();

  useEffect(() => {
    // Hero animation
    const tl = gsap.timeline();
    tl.fromTo('.hero-title', 
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.hero-subtitle', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.hero-cta', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.3'
    );

    // Features animation
    gsap.fromTo('.feature-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Enhancement',
      description: 'Advanced machine learning algorithms brighten and enhance your low light images with incredible detail preservation.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Get your enhanced images in seconds, not minutes. Our optimized processing pipeline ensures quick results.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'Your images are processed securely and automatically deleted after 24 hours. We never store your personal photos.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24-Hour Storage',
      description: 'Access your enhanced images anytime within 24 hours. Perfect for reviewing and downloading when convenient.'
    }
  ];

  return (
    <div className="home-page">
      <ThreeBackground />
      
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            ChandraGrahan
          </h1>
          <p className="hero-subtitle">
            Transform your low light images with AI-powered enhancement. 
            Bring out hidden details and create stunning visuals from dark photos.
          </p>
          
          <div className="hero-cta">
            {!user && (
              <Link to="/auth" className="btn-primary hero-button">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="upload-section">
        <div className="upload-container">
          <div className="upload-header">
            <h2 className="upload-title">
              Enhance Your Images
            </h2>
            <p className="upload-description">
              Upload your low light images and watch our AI transform them into bright, detailed masterpieces.
            </p>
          </div>
          
          <ImageUploader />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Why Choose ChandraGrahan?
            </h2>
            <p className="features-description">
              Experience the power of advanced AI technology combined with user-friendly design.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon-container">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="card cta-card">
            <h2 className="cta-title">
              Ready to Transform Your Images?
            </h2>
            <p className="cta-description">
              Join thousands of users who trust ChandraGrahan for their low light image enhancement needs.
            </p>
            
            {!user ? (
              <Link to="/auth" className="btn-primary cta-button">
                Start Enhancing Now
              </Link>
            ) : (
              <p className="cta-welcome">
                Welcome back! Start uploading your images above.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;