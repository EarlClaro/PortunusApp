import './Documents.css';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

function Documents() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Passport.pdf', type: 'file' },
    { id: 2, name: 'Certificates', type: 'folder' },
  ]);

  const addDocument = () => {
    const newDoc = { id: Date.now(), name: `NewDoc_${documents.length + 1}.pdf`, type: 'file' };
    setDocuments([...documents, newDoc]);
  };

  const addFolder = () => {
    const newFolder = { id: Date.now(), name: `NewFolder_${documents.length + 1}`, type: 'folder' };
    setDocuments([...documents, newFolder]);
  };

  return (
    <div className="documents-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h2>Documents</h2>
        </header>
        <div className="content">
          <div className="document-actions">
            <button onClick={addDocument}>+ Add Document</button>
            <button onClick={addFolder} style={{ marginLeft: '10px' }}>+ Add Folder</button>
          </div>
          <div className="document-list">
            {documents.map(doc => (
              <div
                key={doc.id}
                className={`document-card ${doc.type === 'folder' ? 'folder-card' : ''}`}
              >
                <p>{doc.name}</p>
                <small>{doc.type}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documents;
