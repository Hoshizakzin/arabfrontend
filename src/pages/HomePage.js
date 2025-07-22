import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const miniCards = [
    {
      id: 2,
      image: '/imaluca.jpg',
      text: 'Inteligência Maluca!',
    },
    {
      id: 1,
      image: '/arabes1.jpg',
      text: 'Gang',
    },
    {
      id: 3,
      image: '/arabes2.jpg',
      text: 'Para artes e artistas',
    }
  ];

  return (
    <Container className="home-page">
      <h1 className="text-center my-5">Bem-vindo ao nosso espaço!</h1>

      {/* Seção principal */}
      <Card className="shadow-lg mb-5">
        <Card.Body className="text-center">
          <Card.Title className="display-4 mb-4">🎵 Artistas & Músicas</Card.Title>
          <Card.Text className="lead">
            Descubra os últimos lançamentos e as novidades mais quentes do momento!
          </Card.Text>
         <div className="container mt-3">
          <div className="row g-2 justify-content-center">
            <div className="col-12 col-md-auto">
              <Button as={Link} to="/media" variant="primary" size="lg" className="w-100">Ver Músicas</Button>
            </div>
            <div className="col-12 col-md-auto">
              <Button as={Link} to="/news" variant="primary" size="lg" className="w-100">Ver Notícias</Button>
            </div>
            <div className="col-12 col-md-auto">
              <Button as="a"
                href="https://wa.me/244931734266"
                target="_blank"
                rel="noopener noreferrer" variant="primary" size="lg" className="w-100"
              >Contactar</Button>
            </div>
          </div>
        </div>
        </Card.Body>
      </Card>

      {/* Mini cards personalizados */}
      <Row className="g-3 mb-5">
        {miniCards.map((card) => (
          <Col key={card.id} xs={12} md={4}>
            <Card className="h-100 shadow-sm mini-card">
              <Card.Img 
                variant="top" 
                src={card.image} 
                style={{ height: '300px', objectFit: 'cover' }} 
                alt="Card image"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Text>{card.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;