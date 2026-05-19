import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PenTool } from 'lucide-react';

const CreateArticle = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('https://capstone-backend-56wo.onrender.com/author-api/articles', {
        ...formData,
        author: user._id
      }, { withCredentials: true });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'AUTHOR') {
    return <div className="container page-wrapper">Access Denied</div>;
  }

  return (
    <div className="container page-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
            <PenTool size={24} />
          </div>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>Write a New Article</h2>
            <p className="text-secondary">Share your thoughts with the world</p>
          </div>
        </div>

        {error && <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input 
              type="text" 
              name="title" 
              className="form-control" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="E.g., The Future of Web Development"
              style={{ fontSize: '1.25rem', padding: '1rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
              <option value="" disabled>Select a category</option>
              <option value="Programming">Programming</option>
              <option value="Technology">Technology</option>
              <option value="Life">Life</option>
              <option value="Science">Science</option>
              <option value="Art">Art</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea 
              name="content" 
              className="form-control" 
              value={formData.content} 
              onChange={handleChange} 
              required 
              rows="10"
              placeholder="Write your amazing article here..."
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
