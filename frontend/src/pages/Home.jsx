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
    <div className="min-h-screen">
      <ThreeBackground />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            ChandraGrahan
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your low light images with AI-powered enhancement. 
            Bring out hidden details and create stunning visuals from dark photos.
          </p>
          
          <div className="hero-cta space-y-4">
            {!user && (
              <div className="mb-8">
                <Link to="/auth" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enhance Your Images
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload your low light images and watch our AI transform them into bright, detailed masterpieces.
            </p>
          </div>
          
          <ImageUploader />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose ChandraGrahan?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the power of advanced AI technology combined with user-friendly design.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card text-center">
                <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Images?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of users who trust ChandraGrahan for their low light image enhancement needs.
            </p>
            
            {!user ? (
              <Link to="/auth" className="btn-primary text-lg px-8 py-4">
                Start Enhancing Now
              </Link>
            ) : (
              <p className="text-indigo-400 font-semibold">
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