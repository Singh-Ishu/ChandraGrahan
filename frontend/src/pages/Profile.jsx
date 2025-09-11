import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useImages } from '../contexts/ImageContext';
import { Download, Trash2, Clock, Image as ImageIcon, User } from 'lucide-react';
import { gsap } from 'gsap';

const Profile = () => {
  const { user } = useAuth();
  const { images, deleteImage, getTimeRemaining } = useImages();
  const profileRef = useRef();

  useEffect(() => {
    if (profileRef.current) {
      gsap.fromTo('.profile-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
      );
    }
  }, []);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced_${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImage(imageId);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div ref={profileRef} className="min-h-screen pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="profile-content card mb-10">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-gray-400 text-lg">{user.email}</p>
              <p className="text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-content grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-3">{images.length}</div>
            <div className="text-gray-400 text-lg">Total Images</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-green-400 mb-3">
              {images.reduce((acc, img) => acc + img.size, 0) > 0 ? formatFileSize(images.reduce((acc, img) => acc + img.size, 0)) : '0 MB'}
            </div>
            <div className="text-gray-400 text-lg">Storage Used</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-purple-400 mb-3">24h</div>
            <div className="text-gray-400 text-lg">Auto-Delete Timer</div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="profile-content">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Your Enhanced Images</h2>
            <div className="text-gray-400">
              Images are automatically deleted after 24 hours
            </div>
          </div>

          {images.length === 0 ? (
            <div className="card text-center py-16">
              <ImageIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">No Images Yet</h3>
              <p className="text-gray-400 mb-8 text-lg">
                Upload your first low light image to get started with AI enhancement.
              </p>
              <a href="/" className="btn-primary text-lg">
                Upload Image
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image) => (
                <div key={image.id} className="card">
                  <div className="relative mb-6">
                    <img
                      src={image.enhancedUrl}
                      alt={image.originalName}
                      className="w-full h-56 object-cover rounded-2xl"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 text-sm text-white flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeRemaining(image.uploadedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold truncate text-lg">{image.originalName}</h3>
                      <p className="text-gray-400">
                        {formatFileSize(image.size)} • {new Date(image.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => downloadImage(image.enhancedUrl, image.originalName)}
                        className="flex-1 btn-primary flex items-center justify-center space-x-2 py-3"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="btn-secondary flex items-center justify-center px-4 py-3 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;