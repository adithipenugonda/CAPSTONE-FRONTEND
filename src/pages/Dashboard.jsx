import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Edit, Trash2, Ban, Eye, Clock, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'AUTHOR') {
          const res = await axios.get(`https://capstone-backend-56wo.onrender.com/author-api/articles/${user._id}`);
          setData(res.data.payload || []);
        } else if (user.role === 'ADMIN') {
          // Assuming an endpoint exists or we are just showing a placeholder for now
          // For demo, we might want an endpoint to get all users, but we can just show UI
          // I'll leave data empty to show "No users" since we lack an API for it
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article permanently?")) return;
    try {
      await axios.delete(`https://capstone-backend-56wo.onrender.com/author-api/articles/${articleId}`, { withCredentials: true });
      setData(data.filter(article => article._id !== articleId));
    } catch (err) {
      console.error('Failed to delete article', err);
      alert("Failed to delete article.");
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const endpoint = isBlocked ? 'unblock-user' : 'block-user';
      await axios.put(`https://capstone-backend-56wo.onrender.com/admin-api/${endpoint}/${userId}`);
      // Refresh user data if we had it
    } catch (err) {
      console.error('Failed to toggle user status', err);
    }
  };

  if (loading) return <div className="container page-wrapper">Loading...</div>;

  return (
    <div className="container page-wrapper animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient">Dashboard</h1>
        <p className="text-secondary">Welcome back, {user.firstName} ({user.role})</p>
      </div>

      {user.role === 'AUTHOR' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Articles</h2>
          {data.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p className="text-secondary">You haven't written any articles yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {data.map(article => (
                <div key={article._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{article.title}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', background: 'var(--surface-color-light)', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {article.category}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      <Calendar size={12} />
                      <span>{new Date(article.createdAt).toLocaleDateString()} {new Date(article.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {article.updatedAt && new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        <Clock size={12} />
                        <span>Updated: {new Date(article.updatedAt).toLocaleDateString()} {new Date(article.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => navigate(`/articles/${article._id}`)}><Eye size={16} /> View</button>
                    <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => navigate(`/edit-article/${article._id}`)}><Edit size={16} /> Edit</button>
                    <button className="btn btn-danger" style={{ flex: 1, padding: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => handleDelete(article._id)}><Trash2 size={16} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user.role === 'ADMIN' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Manage Users</h2>
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
             <Ban size={48} className="text-secondary" style={{ margin: '0 auto 1rem' }} />
             <p className="text-secondary">User management tools will appear here.</p>
             <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Use the /admin-api/block-user endpoints to manage status.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
