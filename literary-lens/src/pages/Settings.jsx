// literary-lens/src/pages/Settings.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  
  // User profile state
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    bio: 'Book lover and literary enthusiast.',
    profileImage: null
  });

  // Theme preferences state
  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    generationQuality: 'standard'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form states
  const [profileEditing, setProfileEditing] = useState(false);
  const [preferencesEditing, setPreferencesEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle profile edit
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile({
          ...profile,
          profileImage: event.target.result
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle preferences change
  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Save profile changes
  const saveProfile = (e) => {
    e.preventDefault();
    
    // Simulate success
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    setProfileEditing(false);
  };

  // Save preferences changes
  const savePreferences = (e) => {
    e.preventDefault();
    
    // Simulate success
    setSuccessMessage('Preferences updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    setPreferencesEditing(false);
  };

  // Change password
  const changePassword = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    // Simulate success
    setSuccessMessage('Password changed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Reset password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
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
            className="nav-item"
            onClick={() => navigate('/generate')}
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
            className="nav-item active"
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

      <main className="settings-content">
        <h1 className="page-title">Settings</h1>
        
        {/* Success and error messages */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        
        {/* Profile Settings */}
        <section className="settings-section profile-settings">
          <div className="section-header">
            <h2>Profile Information</h2>
            <button 
              className="edit-button"
              onClick={() => setProfileEditing(!profileEditing)}
            >
              {profileEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {profileEditing ? (
            <form onSubmit={saveProfile} className="profile-form">
              <div className="profile-image-container">
                <div className="profile-image">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" />
                  ) : (
                    <span className="profile-placeholder">👤</span>
                  )}
                </div>
                <div className="image-upload">
                  <label htmlFor="profileImage" className="upload-button">
                    Change Photo
                  </label>
                  <input 
                    type="file" 
                    id="profileImage" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-button">Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="profile-image-display">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" />
                ) : (
                  <span className="profile-placeholder">👤</span>
                )}
              </div>
              
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{profile.firstName} {profile.lastName}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Bio:</span>
                  <span className="info-value bio-value">{profile.bio}</span>
                </div>
              </div>
            </div>
          )}
        </section>
        
        {/* Preferences Settings */}
        <section className="settings-section preferences-settings">
          <div className="section-header">
            <h2>Preferences</h2>
            <button 
              className="edit-button"
              onClick={() => setPreferencesEditing(!preferencesEditing)}
            >
              {preferencesEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {preferencesEditing ? (
            <form onSubmit={savePreferences} className="preferences-form">
              <div className="form-group">
                <label htmlFor="theme">Theme</label>
                <select
                  id="theme"
                  name="theme"
                  value={preferences.theme}
                  onChange={handlePreferencesChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={preferences.emailNotifications}
                  onChange={handlePreferencesChange}
                />
                <label htmlFor="emailNotifications">
                  Email notifications about new features and updates
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="generationQuality">Image Generation Quality</label>
                <select
                  id="generationQuality"
                  name="generationQuality"
                  value={preferences.generationQuality}
                  onChange={handlePreferencesChange}
                >
                  <option value="basic">Basic (Faster)</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium (Higher Quality)</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-button">Save Preferences</button>
              </div>
            </form>
          ) : (
            <div className="preferences-display">
              <div className="info-row">
                <span className="info-label">Theme:</span>
                <span className="info-value">
                  {preferences.theme === 'light' ? 'Light' : 
                   preferences.theme === 'dark' ? 'Dark' : 
                   'System Default'}
                </span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Email Notifications:</span>
                <span className="info-value">
                  {preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Image Generation Quality:</span>
                <span className="info-value">
                  {preferences.generationQuality === 'basic' ? 'Basic (Faster)' : 
                   preferences.generationQuality === 'standard' ? 'Standard' : 
                   'Premium (Higher Quality)'}
                </span>
              </div>
            </div>
          )}
        </section>
        
        {/* Security Settings */}
        <section className="settings-section security-settings">
          <div className="section-header">
            <h2>Security</h2>
          </div>
          
          <form onSubmit={changePassword} className="password-form">
            <h3>Change Password</h3>
            
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <p className="password-hint">Must be at least 8 characters long</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button">Change Password</button>
            </div>
          </form>
        </section>
        
        {/* Account Settings */}
        <section className="settings-section account-settings">
          <div className="section-header">
            <h2>Account</h2>
          </div>
          
          <div className="account-actions">
            <div className="action-item">
              <div className="action-info">
                <h3>Export Data</h3>
                <p>Download all your Literary Lens data including saved visualizations and collections.</p>
              </div>
              <button className="action-button secondary">Export Data</button>
            </div>
            
            <div className="action-item danger-zone">
              <div className="action-info">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
              <button className="action-button danger">Delete Account</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;