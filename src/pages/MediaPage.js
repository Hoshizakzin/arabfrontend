import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaPlay, FaPause, FaDownload } from 'react-icons/fa';
import './MediaPage.css';

const MediaPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [currentMedia, setCurrentMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('📡 Buscando mídias da API...');

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/media`);
        console.log('🎶 Mídias recebidas:', res.data);
        setMediaList(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('❌ Erro ao carregar mídias:', err);
        setError('Erro ao carregar músicas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
    return () => stopAudio();
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  const handlePlayMedia = (media) => {
    if (!media.url) return;
    stopAudio();

    const newAudio = new Audio(media.url);
    audioRef.current = newAudio;

    newAudio.play()
      .then(() => {
        setCurrentMedia(media);
        console.log('▶️ Tocando:', media.title);
      })
      .catch(err => {
        console.error('❌ Erro ao reproduzir áudio:', err);
        setError('Erro ao reproduzir a música.');
      });
  };

  const handlePause = () => {
    stopAudio();
    setCurrentMedia(null);
  };

  const filteredMedia = mediaList.filter(media => {
    const matchesFilter = filter === 'todos' || media.category === filter;
    const matchesSearch = media.title?.toLowerCase().includes(search.toLowerCase()) ||
                          media.artist?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando músicas...</span>
        </Spinner>
        <p className="mt-2">Carregando músicas...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Erro ao carregar músicas</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="media-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1 className="page-title">Músicas</h1>
        <Form.Control
          type="text"
          placeholder="Buscar por título ou artista..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      {filteredMedia.length === 0 ? (
        <Alert variant="info">Nenhuma música encontrada.</Alert>
      ) : (
        <Row>
          {filteredMedia.map((media) => (
            <Col key={media._id} md={6} lg={4} className="mb-4">
              <Card className="media-card h-100 shadow-sm">
                <div className="media-content">
                  {media.thumbnailUrl && (
                    <div className="media-thumbnail">
                      <img
                        src={
                          media.thumbnailUrl.startsWith('http')
                            ? media.thumbnailUrl
                            : `${process.env.REACT_APP_API_URL}${media.thumbnailUrl}`
                        }
                        alt={`Capa de ${media.title}`}
                        className="thumbnail-image"
                      />
                      <button
                        className="play-button"
                        onClick={() =>
                          currentMedia?._id === media._id
                            ? handlePause()
                            : handlePlayMedia(media)
                        }
                      >
                        {currentMedia?._id === media._id ? <FaPause /> : <FaPlay />}
                      </button>
                    </div>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="media-title">{media.title}</Card.Title>
                    <Card.Text className="media-artist">
                      {media.artist || 'Artista Desconhecido'}
                    </Card.Text>

                    <div className="media-controls mt-auto">
                      <span className="media-date">
                        {new Date(media.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        className="download-button"
                        onClick={() =>
                          window.open(`${process.env.REACT_APP_API_URL}/api/media/download/${media._id}`, '_blank')
                        }
                      >
                        <FaDownload className="me-1" />
                        Baixar
                      </Button>
                    </div>
                  </Card.Body>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MediaPage;