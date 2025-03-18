// literary-lens/src/pages/Home.jsx
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="logo-container">
          <span className="logo-icon">📚</span>
          <h1 className="logo-text">Literary Lens</h1>
        </div>
        <nav className="home-nav">
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/register" className="nav-button">Get Started</Link>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Transform Your Reading Experience</h1>
            <p className="hero-description">
              Literary Lens uses AI to visualize scenes and characters from your favorite books,
              bringing your reading experience to life with custom-generated imagery.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="primary-button">Create Free Account</Link>
              <a href="#how-it-works" className="secondary-button">Learn More</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <span className="image-icon">🖼️</span>
              <p>Book visualization example</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="features-section">
          <h2 className="section-title">How Literary Lens Works</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Step 1: Enter Text</h3>
              <p className="feature-description">Paste any passage from your favorite book that you'd like to visualize.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Step 2: AI Analysis</h3>
              <p className="feature-description">Our AI analyzes the text to understand the scene, characters, and mood.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Step 3: Generate Image</h3>
              <p className="feature-description">Custom artwork is generated based on the analysis of your text.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3 className="feature-title">Step 4: Save & Share</h3>
              <p className="feature-description">Save your creations to your library and share them with friends.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to bring your books to life?</h2>
            <p className="cta-description">Join thousands of readers who use Literary Lens to enhance their reading experience.</p>
            <Link to="/register" className="cta-button">Start Here!</Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          {/* <div className="footer-logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">Literary Lens</span>
          </div> */}
          
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <a href="./Home.jsx" className="footer-link">About Us</a>
              <a href="./Home.jsx" className="footer-link">Careers</a>
              <a href="./Home.jsx" className="footer-link">Contact</a>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <a href="./Home.jsx" className="footer-link">Blog</a>
              <a href="./Home.jsx" className="footer-link">Help Center</a>
              <a href="./Home.jsx" className="footer-link">Tutorials</a>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Legal</h4>
              <a href="./Home.jsx" className="footer-link">Terms of Service</a>
              <a href="./Home.jsx" className="footer-link">Privacy Policy</a>
              <a href="./Home.jsx" className="footer-link">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Literary Lens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;