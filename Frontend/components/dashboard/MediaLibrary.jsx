'use client';

import { useState } from 'react';
import style from '../../public/assets/css/dashboard/media-library.module.css';

const MediaLibrary = () => {
  // 1. Mock Data (Replace this with a database fetch later)
  const [mediaItems, setMediaItems] = useState([
    { id: 1, name: 'audi-rs4-front.jpg', url: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=400&auto=format&fit=crop', size: '1.2MB', type: 'JPG', date: 'Oct 24, 2024' },
    { id: 2, name: 'land-rover-logo.png', url: 'https://media.wired.com/photos/63b8d0a771c6b526845f15a6/master/w_1600,c_limit/CES-2023-PEUGEOT_INCEPTION_CONCEPT_2301CN202.jpg' },
    { id: 3, name: 'interior-details.jpg', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400&auto=format&fit=crop', size: '2.1MB', type: 'JPG', date: 'Oct 19, 2024' },
     { id: 4, name: 'audi-rs4-front.jpg', url: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=400&auto=format&fit=crop', size: '1.2MB', type: 'JPG', date: 'Oct 24, 2024' },
    { id: 5, name: 'land-rover-logo.png', url: 'https://media.wired.com/photos/63b8d0a771c6b526845f15a6/master/w_1600,c_limit/CES-2023-PEUGEOT_INCEPTION_CONCEPT_2301CN202.jpg' },
    { id: 6, name: 'interior-details.jpg', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400&auto=format&fit=crop', size: '2.1MB', type: 'JPG', date: 'Oct 19, 2024' },
    { id: 7, name: 'audi-rs4-front.jpg', url: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=400&auto=format&fit=crop', size: '1.2MB', type: 'JPG', date: 'Oct 24, 2024' },
    { id: 8, name: 'land-rover-logo.png', url: 'https://media.wired.com/photos/63b8d0a771c6b526845f15a6/master/w_1600,c_limit/CES-2023-PEUGEOT_INCEPTION_CONCEPT_2301CN202.jpg' },
    { id: 9, name: 'interior-details.jpg', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400&auto=format&fit=crop', size: '2.1MB', type: 'JPG', date: 'Oct 19, 2024' },
     { id: 10, name: 'audi-rs4-front.jpg', url: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=400&auto=format&fit=crop', size: '1.2MB', type: 'JPG', date: 'Oct 24, 2024' },
    { id: 11, name: 'land-rover-logo.png', url: 'https://media.wired.com/photos/63b8d0a771c6b526845f15a6/master/w_1600,c_limit/CES-2023-PEUGEOT_INCEPTION_CONCEPT_2301CN202.jpg' },
    { id: 12, name: 'interior-details.jpg', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400&auto=format&fit=crop', size: '2.1MB', type: 'JPG', date: 'Oct 19, 2024' },
   
]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Add New Media (Mock)
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newItem = {
        id: Date.now(),
        name: file.name,
        url: URL.createObjectURL(file), // Mock preview
        size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        type: file.type.split('/')[1].toUpperCase(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setMediaItems([newItem, ...mediaItems]); // Add to the grid
    }
  };

  // 3. Delete Media (Mock)
  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this asset?")) {
      setMediaItems(mediaItems.filter(item => item.id !== id));
      setSelectedItem(null); // Close sidebar
    }
  };

  return (
    <div className={style['media-wrapper']}>
      <header className={style['media-header']}>
        <div>
          <h1 className={style['media-title']}>Media Library</h1>
          <p className={style['media-subtitle']}>Central hub for all your website images and assets</p>
        </div>
        
        {/* Hidden File Input for Upload Button */}
        <label className={style['upload-btn-main']}>
          + Add New Media
          <input type="file" className={style['file-hidden-input']} onChange={handleUpload} accept="image/*" />
        </label>
      </header>

      {/* 4. Statistics Bar */}
      <div className={style['stats-bar']}>
        <div className={style['stat-card']}>
          <h4>Total Assets</h4>
          <p>{mediaItems.length}</p>
        </div>
        <div className={style['stat-card']}>
          <h4>Storage Used</h4>
          <p>4.3 GB <small>/ 10 GB</small></p>
          <div className={style['progress-bar-bg']}><div className={style['progress-bar-fill']} style={{width: '43%'}}></div></div>
        </div>
      </div>

      <div className={style['library-layout']}>
        <main className={style['main-content']}>
          
          {/* 5. Control Panel (Search & Filter) */}
          <div className={style['control-panel']}>
            <input 
              type="text" 
              placeholder="Search images by name..." 
              className={style['search-input']}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className={style['filter-select']}>
              <option>All Types</option>
              <option>Images (JPG, PNG)</option>
              <option>Vectors (SVG)</option>
              <option>Documents (PDF)</option>
            </select>
          </div>

          {/* 6. The Image Grid */}
          <div className={style['media-grid']}>
            {mediaItems
              .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(item => (
              <div 
                key={item.id} 
                className={`grid-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className={style['thumbnail-wrapper']}>
                  <img src={item.url} alt={item.name} className={style['thumbnail']} />
                  <span className={style['file-type-badge']}>{item.type}</span>
                </div>
                <p className={style['file-name']}>{item.name}</p>
              </div>
            ))}
          </div>
        </main>

        {/* 7. Details Sidebar (on click) */}
        {selectedItem && (
          <aside className={style['details-sidebar']}>
            <div className={style['sidebar-header']}>
              <h3 className={style['sidebar-title']}>File Details</h3>
              <button onClick={() => setSelectedItem(null)} className={style['close-sidebar']}>×</button>
            </div>

            <img src={selectedItem.url} alt="Preview" className={style['sidebar-preview']} />

            <div className={style['metadata-list']}>
              <div className={style['metadata-item']}><span>Name:</span> <strong>{selectedItem.name}</strong></div>
              <div className={style['metadata-item']}><span>Size:</span> <strong>{selectedItem.size}</strong></div>
              <div className={style['metadata-item']}><span>Type:</span> <strong>{selectedItem.type}</strong></div>
              <div className={style['metadata-item']}><span>Upload Date:</span> <strong>{selectedItem.date}</strong></div>
            </div>

            <div className={style['sidebar-actions']}>
              <button className={style['btn-secondary']}>Get Link</button>
              <button className={style['btn-secondary']}>Edit Alt Text</button>
              <button onClick={() => handleDelete(selectedItem.id)} className={style['btn-danger']}>Delete</button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;