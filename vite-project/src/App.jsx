import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './ImageResizer.css'; // Import a CSS file for custom styles

const ImageResizer = () => {
  const [file, setFile] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
    }
  });

  const resizeImage = async () => {
    if (!file) return alert('Please upload an image file.');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `https://api.apyhub.com/processor/image/resize/file?width=${width}&height=${height}&preserve_format=true`,
        formData,
        {
          headers: {
            'apy-token': "APY0Y4TwEQhD7OOv4sn5rjoBxMzQHaiSX11cUz7AndEhFQZD9Zdv4zF95jkrwFNPtGvxSi",
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob' 
        }
      );

      const resizedImageUrl = URL.createObjectURL(response.data);
      setResizedImage(resizedImageUrl);
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };

  return (
    <div className="image-resizer-container">
      <h1>Image Resizer</h1>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag 'n' drop an image file here, or click to select one</p>
        )}
      </div>
      <div className="input-group">
        <label>
          Width:
          <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
        </label>
        <label>
          Height:
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </label>
      </div>
      <button onClick={resizeImage} className="resize-button">Resize Image</button>
      {resizedImage && (
        <div className="resized-image-container">
          <h2>Resized Image</h2>
          <img src={resizedImage} alt="Resized" />
          <div>
            <a href={resizedImage} download="resized-image.jpg">Download Resized Image</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageResizer;