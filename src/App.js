import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaSoundcloud } from 'react-icons/fa';
import { Navbar, Nav, Container } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import MediaPage from './pages/MediaPage';
import MediaDetailPage from './pages/MediaDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Árabes</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Itens à esquerda */}
            <Nav className="">
              <Nav.Link as={Link} to="/news">Notícias</Nav.Link>
              <Nav.Link as={Link} to="/media">Mídia</Nav.Link>
              {isAuthenticated && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
              {isAuthenticated ? (
                <Nav.Link onClick={handleLogout}>Sair</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>

            <Nav className="ms-auto">
              <Nav.Link as="a" href="https://www.facebook.com/profile.php?id=61576591880951" 
                target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </Nav.Link>
              <Nav.Link as="a" href="https://youtube.com/@arabeoficial?si=da9ixNZnXbZTb9n9" 
                target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </Nav.Link>
              <Nav.Link as="a" href="https://m.soundcloud.com/mmodelo-filho-da-luisa-280257679?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" 
                target="_blank" rel="noopener noreferrer">
                <FaSoundcloud />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/media/:id" element={<MediaDetailPage />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Container>
    </>
  );
}

export default AppWrapper;