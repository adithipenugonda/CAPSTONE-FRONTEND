import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, User, Edit, Trash2, MessageSquare, Send, Eye } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      const res = await axios.get('https://capstone-backend-56wo.onrender.com/user-api/articles');
      setArticles(res.data.payload || []);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (articleId) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`https://capstone-backend-56wo.onrender.com/author-api/articles/${articleId}`, { withCredentials: true });
      setArticles(articles.filter(a => a._id !== articleId));
    } catch (err) {
      console.error('Failed to delete article', err);
      alert("Failed to delete article.");
    }
  };

  const handleEdit = (article) => {
    navigate(`/edit-article/${article._id}`);
  };

  const handleCommentChange = (articleId, value) => {
    setCommentInputs({ ...commentInputs, [articleId]: value });
  };

  const submitComment = async (articleId) => {
    const comment = commentInputs[articleId];
    if (!comment || !comment.trim()) return;

    try {
      const res = await axios.post(`https://capstone-backend-56wo.onrender.com/common-api/article/${articleId}/comment`, { comment });
      if (res.data.payload) {
        setArticles(articles.map(a => a._id === articleId ? res.data.payload : a));
        setCommentInputs({ ...commentInputs, [articleId]: '' });
      }
    } catch (err) {
      console.error('Failed to add comment', err);
      alert("Failed to add comment.");
    }
  };

  if (loading) {
    return <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container page-wrapper animate-fade-in" style={{ paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '800px', 
          margin: '4rem auto 5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1.5rem' 
        }}>
          <h1 className="text-gradient" style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
            Share Your Story with the World
          </h1>
          <p className="text-secondary" style={{ fontSize: '1.25rem', lineHeight: '1.7', maxWidth: '600px' }}>
            Join our professional community of writers and readers to share knowledge, explore new ideas, and build conversations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Get Started
            </button>
            <button onClick={() => navigate('/register')} className="btn btn-outline" style={{ padding: '0.875rem 2rem' }}>
              Create Account
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>Why Choose BlogApp?</h2>
          <div className="grid grid-cols-3">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                <Edit size={24} />
              </div>
              <h3>Write Articles</h3>
              <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
                Use our rich posting interface to create beautifully formatted stories, technology logs, or personal experiences.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(167, 139, 250, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                <MessageSquare size={24} />
              </div>
              <h3>Join Conversations</h3>
              <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
                Comment on published articles to share your feedback, ask questions, and interact directly with content authors.
              </p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                <Clock size={24} />
              </div>
              <h3>Custom Dashboards</h3>
              <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
                Manage all of your written content in a personal dashboard where you can easily modify or delete your articles.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action banner */}
        <div className="glass" style={{ padding: '3.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Ready to start reading?</h2>
          <p className="text-secondary" style={{ maxWidth: '500px', fontSize: '1.1rem' }}>
            Login to unlock the full potential of BlogApp and browse hundreds of stories from programmers, designers, and thinkers.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '0.875rem 2.5rem' }}>
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Welcome to BlogApp</h1>
        <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover amazing stories, insights, and knowledge from our community of writers.
        </p>
      </div>

      <div className="grid grid-cols-2">
        {articles.map((article) => (
          <div key={article._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary-color)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                {article.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} />
                    <span>
                      {new Date(article.createdAt || new Date()).toLocaleDateString()} at{' '}
                      {new Date(article.createdAt || new Date()).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {article.updatedAt && new Date(article.updatedAt).getTime() !== new Date(article.createdAt).getTime() && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      Updated: {new Date(article.updatedAt).toLocaleDateString()} at{' '}
                      {new Date(article.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                
                {/* Edit and Delete Buttons for Author */}
                {user && article.author && user._id === article.author._id && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(article)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(article._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
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
              
              <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {article.comments?.map((c, idx) => (
                  <div key={idx} style={{ fontSize: '0.875rem', background: 'var(--surface-color)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary-color)', marginRight: '0.5rem' }}>
                      {c.user ? `${c.user.firstName}` : 'User'}:
                    </span>
                    <span className="text-secondary">{c.comment}</span>
                  </div>
                ))}
              </div>

              {user ? (
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
              ) : (
                <p className="text-secondary" style={{ fontSize: '0.75rem', textAlign: 'center' }}>Please login to comment.</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }} className="glass-card">
          <h2>No articles found</h2>
          <p>Be the first one to write an amazing story!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
