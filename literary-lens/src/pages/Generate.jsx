// literary-lens/src/pages/Generate.jsx
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

  const handleStyleChange = (e) => {
    setImageStyle(e.target.value);
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleGenerate = () => {
    if (!textInput.trim()) {
      alert('Please enter some text to visualize.');
      return;
    }

    setIsGenerating(true);

    // Mock image generation
    setTimeout(() => {
      setGeneratedImage({
        id: 'img-' + Date.now(),
        url: 'placeholder',
        text: textInput,
        style: imageStyle,
        createdAt: new Date().toISOString()
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = async () => {
    try {
      const imageElement = document.getElementById('image-save');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      ctx.drawImage(imageElement, 0, 0);
      const dataURL = canvas.toDataURL('image/png');

      // Get the token from local storage
      const token = localStorage.getItem('token');

      // Example: axios.post('/api/save-image', { image: dataURL })
      // Make the API call to login endpoint
      const response = await axios.post(
        'http://localhost:8080/api/image/save',
        {
          image: dataURL,
          description: generatedImage.text,
          bookTitle: "0",
          style: generatedImage.style,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    }
    alert('Image saved to your library!');
    navigate('/library');
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

            <div className="style-selection">
              <h2>Select Style</h2>
              <div className="style-options">
                <label className={`style-option ${imageStyle === 'realistic' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="style" 
                    value="realistic" 
                    checked={imageStyle === 'realistic'} 
                    onChange={handleStyleChange}
                  />
                  <span className="style-name">Realistic</span>
                  <div className="style-preview">🖼️</div>
                </label>

                <label className={`style-option ${imageStyle === 'watercolor' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="style" 
                    value="watercolor" 
                    checked={imageStyle === 'watercolor'} 
                    onChange={handleStyleChange}
                  />
                  <span className="style-name">Watercolor</span>
                  <div className="style-preview">🎨</div>
                </label>

                <label className={`style-option ${imageStyle === 'sketch' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="style" 
                    value="sketch" 
                    checked={imageStyle === 'sketch'} 
                    onChange={handleStyleChange}
                  />
                  <span className="style-name">Sketch</span>
                  <div className="style-preview">✏️</div>
                </label>

                <label className={`style-option ${imageStyle === 'fantasy' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="style" 
                    value="fantasy" 
                    checked={imageStyle === 'fantasy'} 
                    onChange={handleStyleChange}
                  />
                  <span className="style-name">Fantasy</span>
                  <div className="style-preview">🧙</div>
                </label>
              </div>
            </div>

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
                    <div className="placeholder-image">
                      <span className="placeholder-icon">🖼️</span>
                      <span className="placeholder-text">Generated Image</span>
                      <img src="./logo192.png" id="image-save" alt="placeholder"></img>
                    </div>
                  </div>
                  <div className="image-actions">
                    <button className="action-button" onClick={handleSave}>Save to Library</button>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generate;