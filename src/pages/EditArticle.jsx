import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PenTool, ArrowLeft } from 'lucide-react';

const EditArticle = () => {
  const { articleId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`https://capstone-backend-56wo.onrender.com/user-api/articles/${articleId}`);
        const article = res.data.payload;
        // Verify article exists
        if (!article) {
          setError(res.data.reason || res.data.message || 'Article not found.');
          setLoading(false);
          return;
        }

        // Verify ownership
        if (!article.author || article.author._id !== user?._id) {
          setError('You are not authorized to edit this article.');
          setLoading(false);
          return;
        }

        setFormData({
          title: article.title || '',
          category: article.category || '',
          content: article.content || ''
        });
      } catch (err) {
        console.error('Failed to fetch article details:', err);
        setError('Failed to load article details.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchArticle();
    } else {
      setError('Please login to edit this article.');
      setLoading(false);
    }
  }, [articleId, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await axios.put(`https://capstone-backend-56wo.onrender.com/author-api/articles/${articleId}`, {
        ...formData,
        author: user._id
      }, { withCredentials: true });
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update article:', err);
      setError(err.response?.data?.message || 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p className="text-secondary" style={{ fontSize: '1.25rem' }}>Loading article details...</p>
      </div>
    );
  }

  return (
    <div className="container page-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
            <PenTool size={24} />
          </div>
          <div>
            <h2 style={{ marginBottom: '0.25rem' }}>Edit Article</h2>
            <p className="text-secondary">Modify your article details and save changes</p>
          </div>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--danger)', 
            borderRadius: 'var(--radius)', 
            marginBottom: '1.5rem', 
            fontSize: '0.875rem', 
            border: '1px solid rgba(239, 68, 68, 0.2)' 
          }}>
            {error}
          </div>
        )}

        {!error && (
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
                rows="12"
                placeholder="Write your amazing article here..."
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditArticle;
