import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, User, MessageSquare, Send, Calendar, Tag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ArticleView = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`https://capstone-backend-56wo.onrender.com/user-api/articles/${articleId}`);
        if (!res.data.payload) {
          setError(res.data.reason || res.data.message || 'Article not found.');
          return;
        }
        setArticle(res.data.payload);
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError(err.response?.data?.message || 'Failed to load the article.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await axios.post(`https://capstone-backend-56wo.onrender.com/common-api/article/${articleId}/comment`, {
        comment: commentInput
      });
      if (res.data.payload) {
        setArticle(res.data.payload);
        setCommentInput('');
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p className="text-secondary" style={{ fontSize: '1.25rem' }}>Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container page-wrapper" style={{ maxWidth: '800px', marginTop: '2rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <p className="text-danger" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{error || 'Article not found.'}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <article className="glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            padding: '0.25rem 0.75rem', 
            background: 'rgba(59, 130, 246, 0.2)', 
            color: 'var(--primary-color)', 
            borderRadius: '20px', 
            fontSize: '0.85rem', 
            fontWeight: '600' 
          }}>
            <Tag size={12} /> {article.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Calendar size={14} />
            <span>{new Date(article.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <h1 style={{ fontSize: '2.75rem', lineHeight: '1.2', marginBottom: '1.5rem', fontWeight: '700' }}>{article.title}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} className="text-secondary" />
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '1rem' }}>
              {article.author ? `${article.author.firstName} ${article.author.lastName}` : 'Unknown Author'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Author</div>
          </div>
        </div>

        <div style={{ 
          fontSize: '1.125rem', 
          lineHeight: '1.8', 
          color: 'var(--text-primary)', 
          whiteSpace: 'pre-wrap',
          marginBottom: '2rem'
        }}>
          {article.content}
        </div>
      </article>

      {/* Comments Section */}
      <section className="glass" style={{ padding: '2.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} /> Comments ({article.comments?.length || 0})
        </h3>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Add a public comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={submittingComment || !commentInput.trim()}>
              <Send size={16} /> {submittingComment ? 'Sending...' : 'Comment'}
            </button>
          </form>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '1.5rem', 
            background: 'rgba(15, 23, 42, 0.4)', 
            borderRadius: 'var(--radius)', 
            marginBottom: '2rem',
            color: 'var(--text-secondary)'
          }}>
            Please <span style={{ color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>login</span> to join the conversation.
          </div>
        )}

        {/* Comments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {article.comments && article.comments.length > 0 ? (
            article.comments.map((commentObj, idx) => (
              <div key={idx} style={{ 
                background: 'rgba(15, 23, 42, 0.4)', 
                padding: '1.25rem', 
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(255, 255, 255, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--surface-color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={12} className="text-secondary" />
                  </div>
                  <span style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                    {commentObj.user ? `${commentObj.user.firstName} ${commentObj.user.lastName}` : 'Anonymous'}
                  </span>
                </div>
                <p className="text-secondary" style={{ fontSize: '1rem', marginLeft: '2rem' }}>
                  {commentObj.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-secondary" style={{ textAlign: 'center', fontStyle: 'italic', padding: '1rem 0' }}>
              No comments yet. Be the first to say something!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticleView;
