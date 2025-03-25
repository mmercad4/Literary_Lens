// literary-lens/src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <span className="logo-icon">📚</span>
          <h1 className="logo-text">Literary Lens</h1>
        </div>
        
        <nav className="dashboard-nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item" onClick={() => navigate('/generate')}>Generate</button>
          <button className="nav-item" onClick={() => navigate('/library')}>Library</button>
          <button className="nav-item" onClick={() => navigate('/settings')}>Settings</button>
        </nav>
        
        <div className="user-menu">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Welcome to Literary Lens</h2>
          <p>Your personal book visualization library</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3 className="stat-title">Total Images</h3>
            <p className="stat-value">0</p>
          </div>
          
          <div className="stat-card">
            <h3 className="stat-title">Collections</h3>
            <p className="stat-value">0</p>
          </div>
          
          <div className="stat-card">
            <h3 className="stat-title">Generated Today</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        
        <div className="create-first">
          <div className="create-icon">🎨</div>
          <h3>Create your first visualization</h3>
          <p>Start by generating an image from your favorite book passage</p>
          <button className="create-button" onClick={() => navigate('/generate')}>Get Started</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;