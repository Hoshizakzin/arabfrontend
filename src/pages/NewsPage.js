import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:5000/api/news');
        if (!response.data) throw new Error('Resposta da API vazia ou inválida');

        const newsData = Array.isArray(response.data)
          ? response.data
          : (response.data.data || []);

        const validatedNews = newsData.map(item => ({
          _id: item._id || Math.random().toString(36).substring(2, 9),
          title: item.title || 'Título não disponível',
          content: item.content || 'Conteúdo não disponível',
          imageUrl: item.imageUrl || null,
          videoUrl: item.videoUrl || null,
          createdAt: item.createdAt || new Date().toISOString()
        }));

        setNews(validatedNews);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setError(error.response?.data?.message || error.message || 'Erro ao carregar notícias');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.content.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando notícias...</span>
        </Spinner>
        <p className="mt-2">Carregando notícias...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Erro ao carregar notícias</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </Alert>
      </Container>
    );
  }

  if (filteredNews.length === 0) {
    return (
      <Container className="my-5">
        <Form.Control
          type="text"
          placeholder="Buscar notícias por título ou conteúdo..."
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Alert variant="info">Nenhuma notícia encontrada.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="mb-0">Últimas Notícias</h2>
        <Form.Control
          type="text"
          placeholder="Buscar notícias por título ou conteúdo..."
          className="mt-3 mt-sm-0 ms-sm-3"
          style={{ maxWidth: '300px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Row>
        {filteredNews.map((article) => (
          <Col key={article._id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              {article.imageUrl && (
                <Card.Img
                  variant="top"
                  src={article.imageUrl}
                  alt={article.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title>{article.title}</Card.Title>
                <Card.Text className="flex-grow-1">
                  {article.content.substring(0, 100)}...
                </Card.Text>

                <Button
                  as={Link}
                  to={`/news/${article._id}`}
                  variant="primary"
                  className="mt-2"
                >
                  Ler Mais
                </Button>

                {article.videoUrl && (
                  <Button
                    variant="outline-danger"
                    className="mt-2"
                    href={article.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Assistir no YouTube
                  </Button>
                )}
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Publicado em: {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default NewsPage;