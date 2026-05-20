import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Edit, Trash2, Ban, Eye, Clock, Calendar, MessageSquare, Send, User } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'AUTHOR') {
          const res = await axios.get(`https://capstone-backend-56wo.onrender.com/author-api/articles/${user._id}`);
          setData(res.data.payload || []);
        } else if (user.role === 'USER') {
          const res = await axios.get('https://capstone-backend-56wo.onrender.com/user-api/articles');
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

  const handleCommentChange = (articleId, value) => {
    setCommentInputs({ ...commentInputs, [articleId]: value });
  };

  const submitComment = async (articleId) => {
    const comment = commentInputs[articleId];
    if (!comment || !comment.trim()) return;

    try {
      const res = await axios.post(`https://capstone-backend-56wo.onrender.com/common-api/article/${articleId}/comment`, { comment });
      if (res.data.payload) {
        setData(data.map(a => a._id === articleId ? res.data.payload : a));
        setCommentInputs({ ...commentInputs, [articleId]: '' });
      }
    } catch (err) {
      console.error('Failed to add comment', err);
      alert("Failed to add comment.");
    }
  };

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

  // eslint-disable-next-line no-unused-vars
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

      {user.role === 'USER' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Articles from all Authors</h2>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Total Articles: {data.length}</p>
          </div>
          {data.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p className="text-secondary">No articles published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {data.map(article => (
                <div key={article._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary-color)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {article.category}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        <span>
                          {new Date(article.createdAt).toLocaleDateString()} at{' '}
                          {new Date(article.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {article.updatedAt && new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          Updated: {new Date(article.updatedAt).toLocaleDateString()} at{' '}
                          {new Date(article.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '0.5rem' }}>{article.title}</h3>
                  <p className="text-secondary" style={{ marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.content}
                  </p>

                  <button 
                    onClick={() => navigate(`/articles/${article._id}`)} 
                    className="btn btn-outline" 
                    style={{ width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Eye size={14} /> View Article
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--surface-color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={14} className="text-secondary" />
                    </div>
                    <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                      {article.author ? `${article.author.firstName} ${article.author.lastName}` : 'Unknown Author'}
                    </span>
                  </div>

                  {/* Comments Section */}
                  <div style={{ marginTop: 'auto', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageSquare size={16} /> Comments ({article.comments?.length || 0})
                    </h4>
                    
                    <div style={{ maxHeight: '120px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {article.comments?.map((c, idx) => (
                        <div key={idx} style={{ fontSize: '0.875rem', background: 'var(--surface-color)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                          <span style={{ fontWeight: '600', color: 'var(--primary-color)', marginRight: '0.5rem' }}>
                            {c.user ? `${c.user.firstName}` : 'User'}:
                          </span>
                          <span className="text-secondary">{c.comment}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Add a comment..." 
                        value={commentInputs[article._id] || ''}
                        onChange={(e) => handleCommentChange(article._id, e.target.value)}
                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                        onKeyDown={(e) => e.key === 'Enter' && submitComment(article._id)}
                      />
                      <button onClick={() => submitComment(article._id)} className="btn btn-primary" style={{ padding: '0.5rem' }}>
                        <Send size={16} />
                      </button>
                    </div>
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
