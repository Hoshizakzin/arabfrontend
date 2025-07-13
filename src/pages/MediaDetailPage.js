import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaPlay, FaPause, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import './MediaPage.css'; // Reutiliza o estilo do MediaPage

const MediaDetailPage = () => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
     if (!id || id.includes('<')) {
        console.warn('🚫 ID inválido detectado:', id);
        setError('ID inválido');
        setIsLoading(false);
        return;
    }
  console.log('🆔 ID recebido pela URL:', id); // <- AQUI
  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/media/${id}`);
      console.log('📥 Resposta da API:', res); // <- AQUI
    if (res.data && res.data._id) {
        setMedia(res.data);
    } else {
        setError('Mídia não encontrada');
    }
    } catch (err) {
      console.error('❌ Erro ao carregar mídia:', err); // <- AQUI
      setError('Erro ao carregar mídia');
    } finally {
      setIsLoading(false);
    }
  };

  fetchMedia();
    return () => {
        if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        }
    };
  }, [id]);

  const handlePlayPause = () => {
    if (!media?.url) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(media.url);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Erro ao reproduzir:', err);
          setError('Erro ao reproduzir a mídia');
        });
    }

    audioRef.current.onended = () => setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Carregando mídia...</p>
      </Container>
    );
  }

  if (error || !media) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Mídia não encontrada'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="media-card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="media-content">
          {media.thumbnailUrl && (
            <div className="media-thumbnail">
              <img
                src={media.thumbnailUrl}
                alt={`Capa de ${media.title}`}
                className="thumbnail-image"
              />
              <button className="play-button" onClick={handlePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>
          )}

          <Card.Body className="d-flex flex-column">
            <Card.Title className="media-title h4">{media.title}</Card.Title>
            <Card.Text className="media-artist">
              {media.artist || 'Artista desconhecido'}
            </Card.Text>

            <div className="media-controls mt-3">
              <span className="media-date text-muted">
                Publicado em: {new Date(media.createdAt).toLocaleDateString('pt-BR')}
              </span>

              <Button
                variant="outline-dark"
                className="mt-3"
                onClick={() =>
                  window.open(`${process.env.REACT_APP_API_URL}/api/media/download/${media._id}`, '_blank')
                }
              >
                <FaDownload className="me-2" />
                Baixar
              </Button>
            </div>
          </Card.Body>
        </div>
      </Card>
    </Container>
  );
};

export default MediaDetailPage;