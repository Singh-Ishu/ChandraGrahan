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
    <div ref={profileRef} className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="profile-content card mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-content grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-2">{images.length}</div>
            <div className="text-gray-400">Total Images</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {images.reduce((acc, img) => acc + img.size, 0) > 0 ? formatFileSize(images.reduce((acc, img) => acc + img.size, 0)) : '0 MB'}
            </div>
            <div className="text-gray-400">Storage Used</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">24h</div>
            <div className="text-gray-400">Auto-Delete Timer</div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="profile-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Enhanced Images</h2>
            <div className="text-sm text-gray-400">
              Images are automatically deleted after 24 hours
            </div>
          </div>

          {images.length === 0 ? (
            <div className="card text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Images Yet</h3>
              <p className="text-gray-400 mb-6">
                Upload your first low light image to get started with AI enhancement.
              </p>
              <a href="/" className="btn-primary">
                Upload Image
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="card">
                  <div className="relative mb-4">
                    <img
                      src={image.enhancedUrl}
                      alt={image.originalName}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeRemaining(image.uploadedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold truncate">{image.originalName}</h3>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(image.size)} • {new Date(image.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadImage(image.enhancedUrl, image.originalName)}
                        className="flex-1 btn-primary flex items-center justify-center space-x-1 text-sm py-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="btn-secondary flex items-center justify-center px-3 py-2 text-red-400 hover:text-red-300"
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