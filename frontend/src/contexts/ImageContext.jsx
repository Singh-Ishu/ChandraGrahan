import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ImageContext = createContext();

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

export const ImageProvider = ({ children }) => {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserImages();
      // Set up auto-deletion timer
      const interval = setInterval(checkExpiredImages, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUserImages = () => {
    const savedImages = localStorage.getItem('userImages');
    if (savedImages) {
      const parsedImages = JSON.parse(savedImages);
      // Filter out expired images
      const validImages = parsedImages.filter(img => {
        const uploadTime = new Date(img.uploadedAt);
        const now = new Date();
        const hoursDiff = (now - uploadTime) / (1000 * 60 * 60);
        return hoursDiff < 24;
      });
      setImages(validImages);
      if (validImages.length !== parsedImages.length) {
        localStorage.setItem('userImages', JSON.stringify(validImages));
      }
    }
  };

  const checkExpiredImages = () => {
    setImages(prevImages => {
      const validImages = prevImages.filter(img => {
        const uploadTime = new Date(img.uploadedAt);
        const now = new Date();
        const hoursDiff = (now - uploadTime) / (1000 * 60 * 60);
        return hoursDiff < 24;
      });
      
      if (validImages.length !== prevImages.length) {
        localStorage.setItem('userImages', JSON.stringify(validImages));
      }
      
      return validImages;
    });
  };

  const processImage = async (file) => {
    if (!user) return { success: false, error: 'Please login first' };
    
    setProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const originalUrl = URL.createObjectURL(file);
      
      // Create a canvas to simulate enhanced image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw original image
          ctx.drawImage(img, 0, 0);
          
          // Apply brightness enhancement simulation
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.3);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * 1.3); // Green
            data[i + 2] = Math.min(255, data[i + 2] * 1.3); // Blue
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          canvas.toBlob((blob) => {
            const enhancedUrl = URL.createObjectURL(blob);
            
            const newImage = {
              id: Date.now(),
              originalName: file.name,
              originalUrl,
              enhancedUrl,
              uploadedAt: new Date().toISOString(),
              size: file.size,
              type: file.type
            };
            
            const updatedImages = [...images, newImage];
            setImages(updatedImages);
            localStorage.setItem('userImages', JSON.stringify(updatedImages));
            
            setProcessing(false);
            resolve({ success: true, image: newImage });
          });
        };
        
        img.src = originalUrl;
      });
      
    } catch (error) {
      setProcessing(false);
      return { success: false, error: error.message };
    }
  };

  const deleteImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);
    localStorage.setItem('userImages', JSON.stringify(updatedImages));
  };

  const getTimeRemaining = (uploadedAt) => {
    const uploadTime = new Date(uploadedAt);
    const now = new Date();
    const hoursPassed = (now - uploadTime) / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, 24 - hoursPassed);
    
    if (hoursRemaining < 1) {
      const minutesRemaining = Math.max(0, (24 * 60) - ((now - uploadTime) / (1000 * 60)));
      return `${Math.floor(minutesRemaining)}m`;
    }
    
    return `${Math.floor(hoursRemaining)}h ${Math.floor((hoursRemaining % 1) * 60)}m`;
  };

  const value = {
    images,
    processing,
    processImage,
    deleteImage,
    getTimeRemaining
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};