// literary-lens/src/pages/Library.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Library.css';
import axios from 'axios';


const Library = () => {
  const navigate = useNavigate();

  //Actually get the generated images from the backend
  // Array of objects representing the library items
  
  // State to make sure to render actual data and not place holder
  const [hasFetchedLibrary, setHasFetchedLibrary] = useState(false); // Use state for the flag

  // Mock data for library items
  const [libraryItems, setLibraryItems] = useState([
    {
      id: 'img-1',
      title: 'Emerald City Gates',
      preview: '🏙️',
      image: "null",
      text: 'The Emerald City glowed with a strange green light as Dorothy approached the magnificent gates...',
      style: 'fantasy',
      createdAt: '2023-12-10T14:30:00Z',
      collection: 'Wizard of Oz',
      obj_id: null,
    },
    {
      id: 'img-2',
      title: 'Ahab on Deck',
      preview: '⛵',
      image: "null",
      text: 'Captain Ahab stood on the deck, his eyes fixed on the horizon, searching for the white whale...',
      style: 'realistic',
      createdAt: '2023-12-15T09:45:00Z',
      collection: 'Moby Dick',
      obj_id: null,
    },
    {
      id: 'img-3',
      title: 'Gatsby\'s Mansion',
      preview: '🏛️',
      image: "null",
      text: 'The lights of Gatsby\'s mansion blazed with extraordinary brightness, casting golden reflections across the bay...',
      style: 'watercolor',
      createdAt: '2023-12-20T16:15:00Z',
      collection: 'The Great Gatsby',
      obj_id: null,
    },
    {
      id: "null",
      title: "null",
      preview: "null",
      image: "null",
      text: "null",
      style: "null",
      createdAt: "null",
      collection: "null",
      obj_id: null,
    }
  ]);


  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');


  // Code for getting library from backend
  const getLibraryItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/image/get-library',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await response.data;
    } catch (error) {
      console.error('Error fetching library items:', error);
      return [];
    }
  }
  if (!hasFetchedLibrary) {
    setHasFetchedLibrary(true); // Set the flag to true after fetching
  
    getLibraryItems().then((library) => {
      console.log(library);
      const libraryItems = library.map((item, index) => {
        let newItem = {
          id: "img-" + index,
          title: item.bookTitle,
          preview: "null",
          image: item.data,
          text: item.description,
          style: item.style,
          createdAt: item.createdAt,
          collection: item.collection,
          obj_id: item._id,
        };
        return newItem;
      });
      console.log("state gonna change");
      setLibraryItems(libraryItems);
    });
  }

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
      selectedItems.forEach(itemId => {
        const itemToDelete = libraryItems.find(item => item.id === itemId);
        handleBackendDelete(itemToDelete.obj_id);
      });
      setSelectedItems([]);
    }
  };

  const handleBackendDelete = async (obj_id) => {
    console.log("Item to delete on backend: ", obj_id);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/api/image/delete-image',
        { imageId: obj_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error deleting item from backend:', error);
    }
  }

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

  const handleEdit = async (obj_id) => {
    // This function will handle the edit action for an item, letting user change the book title
    const newTitle = prompt('Enter new title:');
    if (newTitle) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:8080/api/image/update-book-title',
          { imageId: obj_id, bookTitle: newTitle },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLibraryItems(libraryItems.map(item => item.obj_id === obj_id ? { ...item, title: newTitle } : item));
      } catch (error) {
        console.error('Error updating book title:', error);
      }
    }
  }

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
                  {item.image !== "null" && (
                    <img width="40px" src={item.image} alt={item.title} className="preview-image" />
                  )}
                  {item.preview !== "null" && (
                    <span className="preview-icon">{item.preview}</span>
                  )}
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
                  <button className="item-action-button" onClick={() => {handleEdit(item.obj_id)}}>Edit</button>
                  <button 
                    className="item-action-button danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this item?')) {
                        setLibraryItems(libraryItems.filter(i => i.id !== item.id));
                        handleBackendDelete(item.obj_id);
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