// literary-lens/src/pages/Library.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Library.css';

const Library = () => {
  const navigate = useNavigate();
  
  // Mock data for library items
  const [libraryItems, setLibraryItems] = useState([
    {
      id: 'img-1',
      title: 'Emerald City Gates',
      preview: '🏙️',
      text: 'The Emerald City glowed with a strange green light as Dorothy approached the magnificent gates...',
      style: 'fantasy',
      createdAt: '2023-12-10T14:30:00Z',
      collection: 'Wizard of Oz'
    },
    {
      id: 'img-2',
      title: 'Ahab on Deck',
      preview: '⛵',
      text: 'Captain Ahab stood on the deck, his eyes fixed on the horizon, searching for the white whale...',
      style: 'realistic',
      createdAt: '2023-12-15T09:45:00Z',
      collection: 'Moby Dick'
    },
    {
      id: 'img-3',
      title: 'Gatsby\'s Mansion',
      preview: '🏛️',
      text: 'The lights of Gatsby\'s mansion blazed with extraordinary brightness, casting golden reflections across the bay...',
      style: 'watercolor',
      createdAt: '2023-12-20T16:15:00Z',
      collection: 'The Great Gatsby'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');

  // Filter and sort library items
  const filteredItems = libraryItems.filter(item => {
    // Apply search query filter
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'uncategorized' && !item.collection) return true;
    return selectedFilter === item.collection;
  }).sort((a, b) => {
    // Apply sort order
    if (sortOrder === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOrder === 'az') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  // Get unique collections for filter dropdown
  const collections = ['all', ...new Set(libraryItems.filter(item => item.collection).map(item => item.collection)), 'uncategorized'];

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?`)) {
      setLibraryItems(libraryItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const handleCreateCollection = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to add to a collection.');
      return;
    }
    
    const collectionName = prompt('Enter a name for your new collection:');
    if (collectionName) {
      const updatedItems = libraryItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, collection: collectionName };
        }
        return item;
      });
      
      setLibraryItems(updatedItems);
      setSelectedItems([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="library-container">
      <header className="library-header">
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
            className="nav-item active"
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

      <main className="library-content">
        <div className="library-header-section">
          <h1 className="page-title">My Library</h1>
          
          <div className="library-actions">
            <button 
              className="action-button" 
              onClick={() => navigate('/generate')}
            >
              Create New Visualization
            </button>
          </div>
        </div>

        <div className="library-controls">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search visualizations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button">🔍</button>
          </div>
          
          <div className="filter-controls">
            <div className="filter-dropdown">
              <label htmlFor="collection-filter">Collection:</label>
              <select 
                id="collection-filter" 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                {collections.map(collection => (
                  <option key={collection} value={collection}>
                    {collection === 'all' ? 'All Collections' : 
                     collection === 'uncategorized' ? 'Uncategorized' : 
                     collection}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sort-dropdown">
              <label htmlFor="sort-order">Sort by:</label>
              <select 
                id="sort-order" 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">{selectedItems.length} item(s) selected</span>
            <div className="action-buttons">
              <button className="bulk-action-button" onClick={handleCreateCollection}>
                Add to Collection
              </button>
              <button className="bulk-action-button danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        )}

        {filteredItems.length > 0 ? (
          <div className="library-grid">
            <div className="library-header-row">
              <div className="select-all-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedItems.length > 0 && selectedItems.length === filteredItems.length}
                  onChange={handleSelectAll}
                  id="select-all"
                />
                <label htmlFor="select-all">Select All</label>
              </div>
              <div className="header-title">Title</div>
              <div className="header-collection">Collection</div>
              <div className="header-date">Created</div>
              <div className="header-actions">Actions</div>
            </div>
            
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`library-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
              >
                <div className="item-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    id={`check-${item.id}`}
                  />
                  <label htmlFor={`check-${item.id}`}></label>
                </div>
                
                <div className="item-preview">
                  <span className="preview-icon">{item.preview}</span>
                </div>
                
                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-text">{item.text.substring(0, 80)}...</p>
                </div>
                
                <div className="item-collection">
                  {item.collection ? (
                    <span className="collection-tag">{item.collection}</span>
                  ) : (
                    <span className="collection-none">Uncategorized</span>
                  )}
                </div>
                
                <div className="item-date">
                  {formatDate(item.createdAt)}
                </div>
                
                <div className="item-actions">
                  <button className="item-action-button">View</button>
                  <button className="item-action-button">Edit</button>
                  <button 
                    className="item-action-button danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this item?')) {
                        setLibraryItems(libraryItems.filter(i => i.id !== item.id));
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-library">
            <div className="empty-icon">📚</div>
            <h2>No visualizations found</h2>
            {searchQuery ? (
              <p>No results match your search criteria. Try a different search term.</p>
            ) : (
              <p>Your library is empty. Create your first visualization to get started!</p>
            )}
            <button 
              className="action-button"
              onClick={() => navigate('/generate')}
            >
              Create New Visualization
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Library;