import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUploadSimple = ({ 
  value = [], 
  onChange, 
  maxImages = 10, 
  multiple = true, 
  label = "Upload Images",
  accept = "image/*",
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const images = React.useMemo(() => {
    return Array.isArray(value) ? value : (value ? [value] : []);
  }, [value]);

  const triggerFileSelect = () => {
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click();
    }
  };

  const processFiles = async (files) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Check limits
    const totalImages = images.length + validFiles.length;
    if (totalImages > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`);
      return;
    }

    setUploading(true);
    
    try {
      const newImageUrls = [];
      
      for (const file of validFiles) {
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        newImageUrls.push(dataUrl);
      }

      const updatedImages = multiple ? [...images, ...newImageUrls] : newImageUrls;
      onChange(multiple ? updatedImages : updatedImages[0]);
      
      toast.success(`${validFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const removeImage = useCallback((indexToRemove) => {
    if (multiple) {
      const updatedImages = images.filter((_, index) => index !== indexToRemove);
      onChange(updatedImages);
    } else {
      onChange('');
    }
    toast.success('Image removed');
  }, [images, multiple, onChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {multiple && ` (${images.length}/${maxImages})`}
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            processFiles(files);
            e.target.value = ''; // Reset for reselection
          }
        }}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileSelect}
      >
        <div className="text-center">
          {uploading ? (
            <Loader className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-600">
              {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB each. {multiple && `Maximum ${maxImages} images.`}
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              
              {/* Error fallback */}
              <div className="w-full h-full hidden items-center justify-center bg-gray-100">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>

              {/* Remove button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Featured badge */}
              {!multiple && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Featured
                </div>
              )}
              
              {/* Index badge for gallery */}
              {multiple && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload status */}
      {multiple && images.length >= maxImages && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Maximum number of images reached ({maxImages}). Remove some images to add new ones.
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSimple;