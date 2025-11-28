import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from './Button';

const ImageUpload = ({
  value,
  onChange,
  onRemove,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  className = '',
  placeholder = 'Click to upload or drag and drop',
  help = 'PNG, JPG or JPEG (MAX. 5MB)'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      setError('Please select a valid image file.');
      return false;
    }

    if (file.size > maxSize) {
      setError(`Image size should be less than ${Math.round(maxSize / (1024 * 1024))}MB.`);
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(file, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <label 
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : error 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-8 h-8 mb-2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{placeholder}</span>
              </p>
              <p className="text-xs text-gray-500">{help}</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={acceptedTypes.join(',')}
              onChange={handleChange}
            />
          </label>
        </div>
        
        {value && (
          <div className="relative">
            <img
              src={typeof value === 'string' ? value : URL.createObjectURL(value)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-xl"
            />
            {onRemove && (
              <Button
                variant="danger"
                size="sm"
                onClick={onRemove}
                className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                icon={<X size={12} />}
              />
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="form-error">{error}</div>
      )}
    </div>
  );
};

export default ImageUpload;