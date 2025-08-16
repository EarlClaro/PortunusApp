import './Documents.css';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import documentService from '../services/documentService';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [folders, setFolders] = useState([]);

  const fetchFolders = async () => {
    try {
      const res = await documentService.listFolders();
      setFolders(res);
    } catch (err) {
      console.error('Failed to load folders', err);
    }
  };

  useEffect(() => {
    fetchDocs();
    fetchFolders();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const docs = await documentService.listDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      type: form.type.value,
      issuer: form.issuer.value,
      issueDate: form.issueDate.value,
      expiryDate: form.expiryDate.value,
      label: form.label.value,
    };
    const file = form.file.files[0];

    try {
      await documentService.createDocument(data, file);
      setShowUpload(false);
      fetchDocs();
    } catch (err) {
      console.error('Upload failed', err);
    }
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
            <button onClick={() => setShowUpload(!showUpload)}>+ Upload Document</button>
              {/* Upload Form */}
              <select name="folderId">
                <option value="">No Folder</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
          </div>

          {showUpload && (
            <form onSubmit={handleUpload} className="upload-form">
              <input type="text" name="type" placeholder="Document Type" required />
              <input type="text" name="issuer" placeholder="Issuer" />
              <input type="date" name="issueDate" />
              <input type="date" name="expiryDate" />
              <input type="text" name="label" placeholder="Folder/Label" />
              <input type="file" name="file" required />
              <button type="submit">Upload</button>
            </form>
          )}

          {loading ? (
            <p>Loading documents...</p>
          ) : (
            <div className="document-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-card">
                  <p>{doc.type}</p>
                  <small>Status: {doc.status}</small>
                  <a href={doc.currentUrl} target="_blank" rel="noreferrer">
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;
