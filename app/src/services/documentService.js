import axios from 'axios';

const API_URL = 'http://localhost:8001/api';

const tokenHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const documentService = {
  listDocuments: async () => {
    const res = await axios.get(`${API_URL}/documents`, tokenHeader());
    return res.data;
  },
  createDocument: async (data, file) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    formData.append('file', file);
    const res = await axios.post(`${API_URL}/documents`, formData, tokenHeader());
    return res.data;
  },
  listFolders: async () => {
    const res = await axios.get(`${API_URL}/folders`, tokenHeader());
    return res.data;
  },
  createFolder: async (name) => {
    const res = await axios.post(`${API_URL}/folders`, { name }, tokenHeader());
    return res.data;
  }
};

export default documentService;
