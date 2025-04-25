// literary-lens/src/pages/Library.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Library.css';
import axios from 'axios';


const Library = () => {
  const navigate = useNavigate();

  const [hasFetchedLibrary, setHasFetchedLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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


  useEffect(() => {
    if (!hasFetchedLibrary) {
      setIsLoading(true);
      fetchLibraryItems();
    }
  }, [hasFetchedLibrary]);

  const fetchLibraryItems = async () => {
    const token = localStorage.getItem('token');
console.log("Token available:", !!token);
console.log("Token first 20 chars:", token ? token.substring(0, 20) + "..." : "none");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/image/get-library',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Library response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const mappedItems = response.data.map((item, index) => {
          let imageData = item.data;
          if (imageData && !imageData.startsWith('data:image')) {
            imageData = `data:image/jpeg;base64,${imageData}`;
          }
          
          return {
            id: `img-${index}`,
            title: item.bookTitle || "Untitled",
            preview: "null",
            image: imageData,
            text: item.description || "No description available",
            style: item.style || "Default",
            createdAt: item.createdAt || new Date().toISOString(),
            collection: item.collection === "Uncategorized" ? null : item.collection,
            obj_id: item._id,
          };
        });
        
        console.log("Mapped library items:", mappedItems);
        setLibraryItems(mappedItems);
      }
      
      setHasFetchedLibrary(true);
    } catch (error) {
      console.error('Error fetching library items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = libraryItems.filter(item => {
    if (item.id === "null") return false;
    
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'uncategorized' && !item.collection) return true;
    return selectedFilter === item.collection;
  }).sort((a, b) => {
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

  const collections = ['all', ...new Set(libraryItems.filter(item => item.collection && item.id !== "null").map(item => item.collection)), 'uncategorized'];

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

  const handleDelete = async (itemId, objId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (objId) {
          const token = localStorage.getItem('token');
          const response = await axios.post(
            'http://localhost:8080/api/image/delete-image',
            { imageId: objId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (response.status === 200) {
            setLibraryItems(prevItems => prevItems.filter(item => item.id !== itemId));
            console.log("Item deleted successfully from database and UI");
          }
        } else {
          setLibraryItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      }
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
      console.log("Item deleted successfully");
    } catch (error) {
      console.error('Error deleting item from backend:', error);
    }
  }

  const handleCreateCollection = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to add to a collection.');
      return;
    }
    
    let collectionName = prompt('Enter a name for your new collection:');
    if (collectionName) {
      selectedItems.forEach(itemId => {
        let itemToUpdate = libraryItems.find(item => item.id === itemId);
        if (itemToUpdate && itemToUpdate.obj_id) {
          handleBackendUpdateCollection(itemToUpdate.obj_id, collectionName);
        }
      });

      const updatedItems = libraryItems.map(item => {
        if (selectedItems.includes(item.id)) {
          return { ...item, collection: collectionName === 'Uncategorized' ? null : collectionName };
        }
        return item;
      });
      
      setLibraryItems(updatedItems);
      setSelectedItems([]);
    }
  };

  const handleBackendUpdateCollection = async (obj_id, collection) => {
    if (collection && obj_id) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:8080/api/image/update-collection',
          { imageId: obj_id, collection: collection },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Collection updated successfully");
      } catch (error) {
        console.error('Error updating collection:', error);
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleEdit = async (obj_id) => {
    const newTitle = prompt('Enter new visualization title:');
    
    if (newTitle && newTitle.trim()) {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.post(
          'http://localhost:8080/api/image/update-book-title',
          {
            imageId: obj_id,
            bookTitle: newTitle.trim()
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.status === 200) {
          setLibraryItems(prevItems => 
            prevItems.map(item => 
              item.obj_id === obj_id ? { ...item, title: newTitle.trim() } : item
            )
          );
          
          alert('Title updated successfully!');
        }
      } catch (error) {
        console.error('Error updating visualization title:', error);
        
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
          
          if (error.response.status === 401) {
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
        }
        
        alert('Failed to update title. Please try again.');
      }
    }
  };

  const refreshLibrary = () => {
    setHasFetchedLibrary(false);
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
            <button 
              className="action-button secondary" 
              onClick={refreshLibrary}
            >
              Refresh Library
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

        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading your library...</p>
          </div>
        ) : filteredItems.length > 0 ? (
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
                  {item.image && item.image !== "null" ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="preview-image" 
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  ) : item.preview && item.preview !== "null" ? (
                    <span className="preview-icon">{item.preview}</span>
                  ) : (
                    <span className="preview-icon">📄</span>
                  )}
                </div>
                
                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-text">{item.text ? item.text.substring(0, 80) + '...' : 'No description'}</p>
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
                  <button className="item-action-button" onClick={() => {
                    if (item.image && item.image !== "null") {
                      const newTab = window.open();
                      newTab.document.write(`
                        <html>
                          <head>
                            <title>${item.title}</title>
                            <style>
                              body { 
                                margin: 0; 
                                display: flex; 
                                justify-content: center; 
                                align-items: center; 
                                min-height: 100vh;
                                background-color: #f0f0f0;
                                flex-direction: column;
                                font-family: Arial, sans-serif;
                              }
                              .image-container {
                                max-width: 90%;
                                max-height: 80vh;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                              }
                              img {
                                max-width: 100%;
                                max-height: 100%;
                                display: block;
                              }
                              h2 {
                                margin-bottom: 20px;
                                color: #333;
                              }
                              p {
                                margin-top: 20px;
                                color: #666;
                                max-width: 800px;
                                text-align: center;
                              }
                            </style>
                          </head>
                          <body>
                            <h2>${item.title}</h2>
                            <div class="image-container">
                              <img src="${item.image}" alt="${item.title}" />
                            </div>
                            <p>${item.text}</p>
                          </body>
                        </html>
                      `);
                    }
                  }}>View</button>
                  <button className="item-action-button" onClick={() => {handleEdit(item.obj_id)}}>Edit</button>
                  <button 
  className="item-action-button danger"
  onClick={() => handleDelete(item.id, item.obj_id)}
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