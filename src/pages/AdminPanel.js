import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Container, Form, Button, Alert, Spinner, Modal, Table } from 'react-bootstrap';
import api from '../api';
import { FaEdit, FaTrash, FaMinus } from 'react-icons/fa';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsData, setNewsData] = useState({
    title: '',
    content: '',
    category: 'geral',
    videoUrl: ''
  });
  const [mediaData, setMediaData] = useState({
    title: '',
    artist: '',
    category: 'music'
  });
  const [newsImage, setNewsImage] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaThumbnail, setMediaThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mediaList, setMediaList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [editingMedia, setEditingMedia] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', data: null });

  useEffect(() => {
    if (activeTab === 'media') {
      fetchMediaList();
    } else if (activeTab === 'news') {
      fetchNewsList();
    }
  }, [activeTab]);

  const fetchMediaList = async () => {
    try {
      const res = await api.get('/api/media');
      setMediaList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Erro ao carregar músicas:', err);
      setMessage({
        type: 'danger',
        text: 'Erro ao carregar lista de músicas'
      });
      setMediaList([]);
    }
  };

  const fetchNewsList = async () => {
    try {
      const res = await api.get('/api/news');
      const data = res.data?.data || res.data;
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar notícias:', err);
      setMessage({
        type: 'danger',
        text: 'Erro ao carregar lista de notícias'
      });
      setNewsList([]);
    }
  };

const handleNewsSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: '', text: '' });

  const formData = new FormData();
  formData.append('title', newsData.title);
  formData.append('content', newsData.content);
  formData.append('category', newsData.category);
  if (newsData.videoUrl) formData.append('videoUrl', newsData.videoUrl);
  if (newsImage) formData.append('image', newsImage);

  try {
    const url = editingNews ? `/api/news/${editingNews._id}` : '/api/news';
    const method = editingNews ? 'put' : 'post';

    const response = await api[method](url, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // ✅ Logs importantes pós-cadastro
    console.log('✅ Notícia cadastrada ou atualizada com sucesso!');
    console.log('📝 Dados da notícia:', response.data);
    console.log('🔗 URL do item cadastrado:', response.data?.imageUrl || 'Sem imagem');
    console.log('▶️ Link do vídeo (se houver):', response.data?.videoUrl || 'Sem vídeo');

    setMessage({
      type: 'success',
      text: editingNews
        ? 'Notícia atualizada com sucesso!'
        : 'Notícia publicada com sucesso!'
    });

    resetNewsForm();
    fetchNewsList();
  } catch (err) {
    console.error('Erro ao processar notícia:', err);
    setMessage({
      type: 'danger',
      text: err.response?.data?.message || 'Erro ao processar notícia'
    });
  } finally {
    setLoading(false);
  }
};

const handleMediaSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: '', text: '' });

  const formData = new FormData();
  formData.append('title', mediaData.title);
  formData.append('artist', mediaData.artist);
  formData.append('category', 'music');
  if (mediaFile) formData.append('file', mediaFile);
  if (mediaThumbnail) formData.append('thumbnail', mediaThumbnail);

  const url = editingMedia ? `/api/media/${editingMedia._id}` : '/api/media';
  const method = editingMedia ? 'put' : 'post';

  console.log('🔎 [handleMediaSubmit]');
  console.log('🔗 Método:', method.toUpperCase());
  console.log('📎 URL final:', `${api.defaults.baseURL}${url}`);
  console.log('🔐 Token:', localStorage.getItem('token'));
  console.log('📦 FormData:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }

  try {
    const response = await api[method](url, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('✅ Música enviada com sucesso!');
    console.log('📝 Dados da música:', response.data);
    console.log('🔗 URL do arquivo:', response.data?.fileUrl || 'Sem arquivo');
    console.log('🖼️ Thumbnail:', response.data?.thumbnailUrl || 'Sem thumbnail');

    setMessage({
      type: 'success',
      text: editingMedia
        ? 'Música atualizada com sucesso!'
        : 'Música enviada com sucesso!'
    });

    resetMediaForm();
    fetchMediaList();
  } catch (err) {
    console.error('❌ Erro ao processar música:', err);
    console.log('🧵 Resposta:', err.response?.data);
    console.log('📡 Requisição:', err.request);
    console.log('💬 Mensagem:', err.message);

    setMessage({
      type: 'danger',
      text: err.response?.data?.error ||
        (editingMedia ? 'Erro ao atualizar música' : 'Erro ao enviar música')
    });
  } finally {
    setLoading(false);
  }
};

  const handleEditNews = (news) => {
    setEditingNews(news);
    setNewsData({
      title: news.title || '',
      content: news.content || '',
      category: news.category || 'geral',
      videoUrl: news.videoUrl || ''
    });
  };

  const handleEditMedia = (media) => {
    setEditingMedia(media);
    setMediaData({
      title: media.title || '',
      artist: media.artist || '',
      category: 'music'
    });
  };

  const handleDeleteClick = (item, type) => {
    setItemToDelete({ type, data: item });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      if (itemToDelete.type === 'news') {
        await api.delete(`/api/news/${itemToDelete.data._id}`, { headers });
        setMessage({ type: 'success', text: 'Notícia removida com sucesso!' });
        fetchNewsList();
      } else if (itemToDelete.type === 'media') {
        await api.delete(`/api/media/${itemToDelete.data._id}`, { headers });
        setMessage({ type: 'success', text: 'Música removida com sucesso!' });
        fetchMediaList();
      } else if (itemToDelete.type === 'admin') {
        await api.delete(`/api/admins/${itemToDelete.data._id}`, { headers });
        setMessage({ type: 'success', text: 'Administrador removido com sucesso!' });
        fetchAdmins();
      }
    } catch (err) {
      console.error('Erro ao remover item:', err);
      setMessage({
        type: 'danger',
        text: err.response?.data?.error || 'Erro ao remover item'
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setItemToDelete({ type: '', data: null });
    }
  };

  const resetNewsForm = () => {
    setNewsData({ title: '', content: '', category: 'geral', videoUrl: '' });
    setNewsImage(null);
    setEditingNews(null);
  };

  const resetMediaForm = () => {
    setMediaData({ title: '', artist: '', category: 'music' });
    setMediaFile(null);
    setMediaThumbnail(null);
    setEditingMedia(null);
  };

  const [admins, setAdmins] = useState([]);
  const [adminData, setAdminData] = useState({ fullName: '', username: '', password: '' });

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/api/admins', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setAdmins(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Erro ao buscar admins:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'admins') fetchAdmins();
  }, [activeTab]);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admins', adminData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setAdminData({ fullName: '', username: '', password: '' });
      fetchAdmins();
      setMessage({ type: 'success', text: 'Administrador cadastrado com sucesso!' });
    } catch (err) {
      console.error('Erro ao cadastrar admin:', err);
      setMessage({ type: 'danger', text: 'Erro ao cadastrar administrador' });
    }
  };

return (
  <Container className="my-5">
    <h2 className="mb-4">Painel Administrativo</h2>

    {message.text && (
      <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
        {message.text}
      </Alert>
    )}

    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
      {/* TAB NOTÍCIAS */}
      <Tab eventKey="news" title="Gerenciar Notícias">
        <div className="mt-4">
          <h4>{editingNews ? 'Editar Notícia' : 'Adicionar Nova Notícia'}</h4>
          <Form onSubmit={handleNewsSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título *</Form.Label>
              <Form.Control
                type="text"
                value={newsData.title}
                onChange={(e) => setNewsData({ ...newsData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Conteúdo *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={newsData.content}
                onChange={(e) => setNewsData({ ...newsData, content: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                value={newsData.category}
                onChange={(e) => setNewsData({ ...newsData, category: e.target.value })}
              >
                <option value="geral">Geral</option>
                <option value="musica">Música</option>
                <option value="cinema">Cinema</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL do Vídeo (YouTube)</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://youtube.com/..."
                value={newsData.videoUrl}
                onChange={(e) => setNewsData({ ...newsData, videoUrl: e.target.value })}
              />
              <Form.Text className="text-muted">
                Insira o link do vídeo relacionado à notícia (opcional).
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagem de Capa {!editingNews && '(opcional)'}</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewsImage(e.target.files[0])}
              />
              {editingNews && (
                <Form.Text muted>Deixe em branco para manter a imagem atual</Form.Text>
              )}
            </Form.Group>

            <div className="d-flex gap-2 mb-4">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">{editingNews ? 'Atualizando...' : 'Publicando...'}</span>
                  </>
                ) : (
                  editingNews ? 'Atualizar Notícia' : 'Publicar Notícia'
                )}
              </Button>

              {editingNews && (
                <Button variant="outline-secondary" onClick={resetNewsForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </Form>

          <h4>Lista de Notícias</h4>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Vídeo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(newsList) && newsList.length > 0 ? (
                  newsList.map((newsItem) => (
                    <tr key={newsItem._id || Math.random().toString(36).substr(2, 9)}>
                      <td>{newsItem.title || 'Sem título'}</td>
                      <td>{newsItem.category || 'Geral'}</td>
                      <td>{newsItem.createdAt ? new Date(newsItem.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        {newsItem.videoUrl ? (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            href={newsItem.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Assistir no YouTube
                          </Button>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditNews(newsItem)}
                          className="me-2"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(newsItem, 'news')}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Nenhuma notícia encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Tab>

      {/* TAB MÚSICAS */}
      <Tab eventKey="media" title="Gerenciar Músicas">
        <div className="mt-4">
          <h4>{editingMedia ? 'Editar Música' : 'Adicionar Nova Música'}</h4>
          <Form onSubmit={handleMediaSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título *</Form.Label>
              <Form.Control
                type="text"
                value={mediaData.title}
                onChange={(e) => setMediaData({ ...mediaData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Artista *</Form.Label>
              <Form.Control
                type="text"
                value={mediaData.artist}
                onChange={(e) => setMediaData({ ...mediaData, artist: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Arquivo de Música *</Form.Label>
              <Form.Control
                type="file"
                accept="audio/*"
                onChange={(e) => setMediaFile(e.target.files[0])}
                required={!editingMedia}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagem de Capa (Thumbnail)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setMediaThumbnail(e.target.files[0])}
              />
            </Form.Group>

            <div className="d-flex gap-2 mb-4">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">{editingMedia ? 'Atualizando...' : 'Enviando...'}</span>
                  </>
                ) : (
                  editingMedia ? 'Atualizar Música' : 'Enviar Música'
                )}
              </Button>

              {editingMedia && (
                <Button variant="outline-secondary" onClick={resetMediaForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </Form>

      <h4>Lista de Músicas</h4>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Título</th>
              <th>Artista</th>
              <th>Data</th>
              <th>Downloads</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(mediaList) && mediaList.length > 0 ? (
              mediaList.map((media) => (
                <tr key={media._id}>
                  <td>{media.title?.trim() || 'Sem título'}</td>
                  <td>{media.artist?.trim() || <FaMinus />}</td>
                  <td>
                    {media.createdAt
                      ? new Date(media.createdAt).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                  <td>{typeof media.downloads === 'number' ? media.downloads : 0}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditMedia(media)}
                      className="me-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(media, 'media')}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Nenhuma música encontrada
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      </div>
      </Tab>

      <Tab eventKey="admins" title="Gerenciar Admins">
        <div className="mt-4">
          <h4>Cadastro de Novo Administrador</h4>
          <Form onSubmit={handleAdminSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo *</Form.Label>
              <Form.Control
                type="text"
                required
                value={adminData.fullName}
                onChange={(e) => setAdminData({ ...adminData, fullName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nome de Usuário *</Form.Label>
              <Form.Control
                type="text"
                required
                value={adminData.username}
                onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha *</Form.Label>
              <Form.Control
                type="password"
                required
                value={adminData.password}
                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="primary">Cadastrar</Button>
          </Form>

          <hr />

          <h4>Lista de Administradores</h4>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Usuário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin._id}>
                      <td>{admin.fullName}</td>
                      <td>{admin.username}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(admin, 'admin')}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      Nenhum administrador encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Tab>

      </Tabs>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este{' '}
          {itemToDelete?.type === 'admin'
            ? 'administrador'
            : itemToDelete?.type === 'news'
            ? 'notícia'
            : 'item de mídia'}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanel;