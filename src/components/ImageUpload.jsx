import React, { useState, useCallback, useId, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
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
  const inputId = useId(); // Generate unique ID for each component instance
  const fileInputRef = useRef(null);

  // Convert single value to array for consistent handling
  const images = React.useMemo(() => {
    return Array.isArray(value) ? value : (value ? [value] : []);
  }, [value]);
  
  console.log('ImageUpload: render with value', value, 'converted to images', images);

  const handleUploadClick = useCallback(() => {
    console.log('ImageUpload: handleUploadClick called, uploading:', uploading);
    if (!uploading && fileInputRef.current) {
      console.log('ImageUpload: triggering file input click');
      fileInputRef.current.click();
    }
  }, [uploading]);

  const handleFiles = useCallback(async (files) => {
    console.log('ImageUpload: handleFiles called with', files.length, 'files');
    const fileArray = Array.from(files);
    
    // Validate file types
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Check if we exceed maximum images
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
      console.log('ImageUpload: calling onChange with', multiple ? updatedImages : updatedImages[0]);
      onChange(multiple ? updatedImages : updatedImages[0]);
      
      toast.success(`${validFiles.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, multiple, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    console.log('ImageUpload: file input change event fired', files ? files.length : 0, 'files selected');
    
    if (files && files.length > 0) {
      console.log('ImageUpload: processing files...');
      handleFiles(files);
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    } else {
      console.log('ImageUpload: no files selected or files is null');
    }
  }, [handleFiles]);

  const removeImage = useCallback((indexToRemove) => {
    if (multiple) {
      const updatedImages = images.filter((_, index) => index !== indexToRemove);
      onChange(updatedImages);
    } else {
      onChange('');
    }
    toast.success('Image removed');
  }, [images, multiple, onChange]);

  const moveImage = useCallback((fromIndex, toIndex) => {
    if (!multiple) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  }, [images, multiple, onChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {multiple && ` (${images.length}/${maxImages})`}
      </label>
      
      {/* Debug: Test button to manually trigger file dialog */}
      <button 
        type="button"
        onClick={() => {
          console.log('Debug button clicked, fileInputRef.current:', fileInputRef.current);
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        className="mb-2 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
      >
        Debug: Click to open file dialog
      </button>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleUploadClick}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={uploading}
      />

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

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  {/* Move left */}
                  {multiple && index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index - 1);
                      }}
                      className="p-1 bg-white rounded-full text-gray-600 hover:text-gray-800 transition-colors"
                      title="Move left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Remove */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Move right */}
                  {multiple && index < images.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index + 1);
                      }}
                      className="p-1 bg-white rounded-full text-gray-600 hover:text-gray-800 transition-colors"
                      title="Move right"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
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

export default ImageUpload;