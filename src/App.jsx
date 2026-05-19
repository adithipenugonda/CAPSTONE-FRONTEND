import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import ArticleView from './pages/ArticleView';
import EditArticle from './pages/EditArticle';
import axios from 'axios';
import './index.css';

axios.defaults.withCredentials = true;


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/articles/:articleId" element={<ArticleView />} />
            <Route path="/edit-article/:articleId" element={<EditArticle />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
