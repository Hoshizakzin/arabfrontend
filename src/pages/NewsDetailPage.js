import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import './NewsDetailPage.css'

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
            style={{
              width: '100%',
              maxHeight: '480px',
              objectFit: 'cover',
              borderTopLeftRadius: '0.5rem',
              borderTopRightRadius: '0.5rem'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}

        <Card.Body>
          <Card.Title className="h2 fw-bold mb-4">{article.title}</Card.Title>

          <Card.Text className="news-content text-justify" style={{ lineHeight: '1.7em', fontSize: '1.1rem' }}>
            {article.content}
          </Card.Text>

          {article.videoUrl && (
            <Button
              variant="outline-danger"
              href={article.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              🎬 Assistir no YouTube
            </Button>
          )}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Button
              variant="outline-success"
              className="share-button"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: article.title,
                      text: 'Veja esta mídia incrível!',
                      url: `${window.location.origin}/news/${article._id}`,
                    })
                    .catch((error) => console.log('Erro ao partilhar:', error));
                } else {
                  alert('O compartilhamento direto não é suportado neste navegador. Copie o link com o botão!');
                }
              }}
            >
              Partilhar
            </Button>

            <Button
              variant="outline-secondary"
              className="share-button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/news/${article._id}`);
                alert('Link copiado para a área de transferência!');
              }}
            >
              Copiar Link
            </Button>
          </div>
          <div className="text-muted mt-5">
            Publicado em: {new Date(article.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NewsDetailPage;