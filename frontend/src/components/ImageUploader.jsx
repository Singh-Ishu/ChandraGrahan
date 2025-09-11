import { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Download, Loader } from 'lucide-react';
import { useImages } from '../contexts/ImageContext';
import { useAuth } from '../contexts/AuthContext';
import { gsap } from 'gsap';

const ImageUploader = () => {
  const { user } = useAuth();
  const { processImage, processing } = useImages();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();
  const uploaderRef = useRef();

  useEffect(() => {
    if (uploaderRef.current) {
      gsap.fromTo(uploaderRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setResult(null);
    } else {
      alert('Please select an image file');
    }
  };

  const handleUpload = async () => {
    if (!user) {
      alert('Please login to upload images');
      return;
    }

    if (!selectedFile) return;

    const result = await processImage(selectedFile);
    if (result.success) {
      setResult(result.image);
      setSelectedFile(null);
    } else {
      alert(result.error);
    }
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced_${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div ref={uploaderRef} className="w-full max-w-4xl mx-auto">
      {!selectedFile && !result && (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-indigo-400 bg-indigo-400/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-indigo-400" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Upload Your Low Light Image
              </h3>
              <p className="text-gray-400">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPG, PNG, WebP up to 10MB
              </p>
            </div>
            
            <button className="btn-primary">
              Choose File
            </button>
          </div>
        </div>
      )}

      {selectedFile && !processing && !result && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Selected Image</h3>
            <button
              onClick={resetUploader}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-400 mt-2">Original Image</p>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Enhanced image will appear here</p>
              </div>
              
              <button
                onClick={handleUpload}
                className="btn-primary w-full"
                disabled={!user}
              >
                {!user ? 'Login Required' : 'Enhance Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {processing && (
        <div className="card text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <Loader className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold">Enhancing Your Image</h3>
            <p className="text-gray-400">
              Our AI is working to brighten and enhance your low light image...
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Enhancement Complete!</h3>
            <button
              onClick={resetUploader}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={result.originalUrl}
                alt="Original"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-400 mt-2">Original Image</p>
            </div>
            
            <div>
              <img
                src={result.enhancedUrl}
                alt="Enhanced"
                className="w-full h-64 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-400 mt-2">Enhanced Image</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <button
              onClick={() => downloadImage(result.enhancedUrl, result.originalName)}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Enhanced Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;