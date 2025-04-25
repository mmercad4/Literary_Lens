import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Generate.css';

const Generate = () => {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [imageStyle, setImageStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [bookTitle, setBookTitle] = useState('');

  const handleStyleChange = (e) => {
    setImageStyle(e.target.value);
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleTitleChange = (e) => {
    setBookTitle(e.target.value);
  };

  const handleGenerate = async () => {
    if (!textInput.trim()) {
      alert('Please enter some text to visualize.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/image/generate',
        {
          prompt: textInput,
          style: imageStyle
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Set the generated image data
      setGeneratedImage({
        id: 'img-' + Date.now(),
        data: response.data.imageData || response.data.image.data,
        text: textInput,
        style: imageStyle,
        createdAt: new Date().toISOString()
      });
      
      // Suggest a title based on the first few words of the text input
      const suggestedTitle = textInput.split(' ').slice(0, 3).join(' ') + '...';
      setBookTitle(suggestedTitle);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err.response?.data?.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // resize the image
  const resizeImageBeforeSaving = (base64Data) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw the resized image
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get the base64 data (use JPEG with 0.8 quality for better compression)
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        resolve(resizedBase64);
      };
      
      // Set the source of the image
      img.src = `data:image/png;base64,${base64Data}`;
    });
  };

  const handleSave = async () => {
    if (!bookTitle.trim()) {
      alert('Please enter a title for your visualization.');
      return;
    }

    try {
      setIsSaving(true);
      // Get the token from local storage
      const token = localStorage.getItem('token');
      
      // image size debugging
      console.log("Original image data size:", generatedImage.data.length);
      const resizedImageData = await resizeImageBeforeSaving(generatedImage.data);
      console.log("Resized image data size:", resizedImageData.length);
      
      const response = await axios.post(
        'http://localhost:8080/api/image/save',
        {
          image: `data:image/jpeg;base64,${resizedImageData}`,
          description: generatedImage.text,
          bookTitle: bookTitle,
          style: generatedImage.style,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 60000
        }
      );
      
      console.log(response.data);
      alert('Image saved to your library!');
      
      localStorage.setItem('refreshLibrary', 'true');
      navigate('/library');
    } catch (error) {
      console.error('Error saving image:', error);
      
      if (error.response) {
        console.error("Response error:", error.response.status, error.response.data);
        
        if (error.response.status === 401) {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      alert('Failed to save image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="generate-container">
      <header className="generate-header">
        <div className="header-logo">
          <span className="logo-icon">📚</span>
          <h1 className="logo-text">Literary Lens</h1>
        </div>
        
        <nav className="header-nav">
          <button 
            className="nav-item" 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button 
            className="nav-item active"
          >
            Generate
          </button>
          <button 
            className="nav-item"
            onClick={() => navigate('/library')}
          >
            Library
          </button>
          <button 
            className="nav-item"
          >
            Settings
          </button>
        </nav>
        
        <div className="user-menu">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          <button onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }} className="logout-button">Logout</button>
        </div>
      </header>

      <main className="generate-content">
        <h1 className="page-title">Create Visualization</h1>
        <p className="page-description">Enter text from your favorite book to generate a visual representation</p>

        <div className="generate-workspace">
          <div className="text-input-section">
            <h2>Enter Text</h2>
            <textarea 
              className="text-input"
              placeholder="Paste text from your book here (minimum 50 characters for best results)"
              value={textInput}
              onChange={handleTextChange}
              rows={10}
            ></textarea>

            <button 
              className="generate-button"
              onClick={handleGenerate}
              disabled={isGenerating || !textInput.trim()}
            >
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </button>
          </div>

          <div className="preview-section">
            <h2>Preview</h2>
            <div className="preview-container">
              {isGenerating ? (
                <div className="generating-indicator">
                  <div className="loading-spinner"></div>
                  <p>Creating your visualization...</p>
                  <p className="generating-subtext">This may take a moment as our AI analyzes the text and generates an image.</p>
                </div>
              ) : generatedImage ? (
                <div className="generated-result">
                  <div className="image-container">
                    {}
                    <img 
                      src={`data:image/png;base64,${generatedImage.data}`}
                      id="image-save" 
                      alt="Generated book cover visualization"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                  
                  {}
                  <div className="title-input-container" style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <label htmlFor="book-title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Visualization Title:
                    </label>
                    <input
                      type="text"
                      id="book-title"
                      value={bookTitle}
                      onChange={handleTitleChange}
                      placeholder="Enter a title for your visualization"
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div className="image-actions">
                    <button 
                      className="action-button" 
                      onClick={handleSave}
                      disabled={isSaving || !bookTitle.trim()}
                    >
                      {isSaving ? 'Saving...' : 'Save to Library'}
                    </button>
                    <button className="action-button secondary">Download</button>
                    <button className="action-button secondary">Share</button>
                  </div>
                </div>
              ) : (
                <div className="empty-preview">
                  <span className="empty-icon">🔍</span>
                  <p>Your visualization will appear here</p>
                  <p className="empty-subtext">Enter text and click "Generate Image" to create a visualization</p>
                </div>
              )}
              
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generate;