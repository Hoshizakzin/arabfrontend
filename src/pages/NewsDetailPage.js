import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/news/${id}`);
        if (res.data.success) {
          setArticle(res.data.data);
        } else {
          console.error('API retornou erro:', res.data.message);
        }
      } catch (err) {
        console.error('Erro ao carregar artigo:', err);
      }
    };
    fetchArticle();
  }, [id]);

  if (!article) return <div>Carregando...</div>;

  return (
    <Container className="my-5">
      <Card className="shadow">
        {article.imageUrl && (
          <Card.Img 
            variant="top" 
            src={article.imageUrl} 
            style={{ maxHeight: '500px', objectFit: 'cover' }} 
          />
        )}
        <Card.Body>
          <Card.Title className="display-4">{article.title}</Card.Title>
          <Card.Text className="lead mt-4">{article.content}</Card.Text>

          {article.videoUrl && (
            <Button
              variant="danger"
              href={article.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3"
            >
              Assistir no YouTube
            </Button>
          )}

          <div className="text-muted mt-5">
            Publicado em: {new Date(article.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NewsDetailPage;