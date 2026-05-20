import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
    profileImageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = formData.role === 'AUTHOR' ? '/author-api/users' : '/user-api/users';
      await axios.post(`https://capstone-backend-56wo.onrender.com${endpoint}`, formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', margin: '2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary-color)' }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>Create Account</h2>
          <p className="text-secondary">Join our community today</p>
        </div>

        {error && <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required autoComplete="off" />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Profile Image URL (Optional)</label>
            <input type="url" name="profileImageUrl" className="form-control" value={formData.profileImageUrl} onChange={handleChange} placeholder="https://example.com/avatar.png" />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">I want to join as</label>
            <select name="role" className="form-control" value={formData.role} onChange={handleChange}>
              <option value="USER">Reader (User)</option>
              <option value="AUTHOR">Writer (Author)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }} className="text-secondary">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
