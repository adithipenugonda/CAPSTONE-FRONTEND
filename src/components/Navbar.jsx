import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { BookOpen, LogOut, LayoutDashboard, PlusCircle, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-content">
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          <BookOpen className="text-primary" />
          <span className="text-gradient">BlogApp</span>
        </Link>
        
        <div className="nav-links">
          <button 
            onClick={toggleTheme} 
            className="btn btn-outline" 
            style={{ 
              padding: '0.5rem', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid var(--border-color)',
              background: 'transparent'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <Link to="/" className="nav-link">Home</Link>
          
          {user ? (
            <>
              {user.role === 'AUTHOR' && (
                <Link to="/create-article" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <PlusCircle size={18} /> Write
                </Link>
              )}
              {user && (
                <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img 
                    src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} 
                    alt="profile" 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span className="text-secondary" style={{ fontSize: '0.875rem' }}>{user.firstName}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
