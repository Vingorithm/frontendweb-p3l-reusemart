import React, { useState, useEffect } from 'react';
import { 
  GetAllPegawai, 
  CreatePegawai, 
  UpdatePegawai, 
  DeletePegawai,
  GetPegawaiById,
  GetAkunByPegawaiId
} from '../../clients/PegawaiService';
import { Container, Row, Col, Form, Button, Card, Modal, Pagination, Nav } from 'react-bootstrap';
import defaultAvatar from '../../assets/images/logo.png';

const ManagePegawaiPage = () => {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentPegawai, setCurrentPegawai] = useState({
    id_pegawai: '',
    id_akun: '',
    nama_pegawai: '',
    tanggal_lahir: '',
    akun: {
      profile_picture: '',
      email: '',
      role: ''
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [error, setError] = useState('');

  const roles = [
    { id: 'gudang', name: 'Gudang' },
    { id: 'kurir', name: 'Kurir' },
    { id: 'admin', name: 'Admin' },
    { id: 'customerservice', name: 'Customer Service' },
    { id: 'hunter', name: 'Hunter' },
  ];

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    try {
      setLoading(true);
      const response = await GetAllPegawai();
      const enhancedPegawaiList = await Promise.all(response.data.map(async (pegawai) => {
        try {
          const akunResponse = await GetAkunByPegawaiId(pegawai.id_pegawai);
          return {
            ...pegawai,
            akun: akunResponse.data
          };
        } catch (error) {
          console.error(`Failed to fetch akun for pegawai ${pegawai.id_pegawai}:`, error);
          return {
            ...pegawai,
            akun: {
              profile_picture: null,
              role: 'Unknown'
            }
          };
        }
      }));
      
      setPegawaiList(enhancedPegawaiList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pegawai data:', error);
      setError('Failed to load employee data. Please try again.');
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role === selectedRole ? '' : role);
  };

  const handleAddPegawai = () => {
    setModalType('add');
    setCurrentPegawai({
      id_pegawai: '',
      id_akun: '',
      nama_pegawai: '',
      tanggal_lahir: '',
      akun: {
        profile_picture: '',
        email: '',
        password: '',
        role: ''
      }
    });
    setError('');
    setShowModal(true);
  };

  const handleEditPegawai = async (id) => {
    try {
      const pegawaiResponse = await GetPegawaiById(id);
      const akunResponse = await GetAkunByPegawaiId(id);
      
      setCurrentPegawai({
        ...pegawaiResponse.data,
        akun: akunResponse.data
      });
      
      setModalType('edit');
      setError('');
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching pegawai details:', error);
      setError('Failed to load employee details. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('akun.')) {
      const akunField = name.split('.')[1];
      setCurrentPegawai({
        ...currentPegawai,
        akun: {
          ...currentPegawai.akun,
          [akunField]: value
        }
      });
    } else {
      setCurrentPegawai({
        ...currentPegawai,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const pegawaiData = {
        id_akun: currentPegawai.id_akun,
        nama_pegawai: currentPegawai.nama_pegawai,
        tanggal_lahir: currentPegawai.tanggal_lahir
      };

      if (modalType === 'add') {
        await CreatePegawai({
          ...pegawaiData,
          akun: {
            id_akun: currentPegawai.id_akun,
            email: currentPegawai.akun.email,
            password: currentPegawai.akun.password || 'defaultPassword',
            role: currentPegawai.akun.role,
            profile_picture: currentPegawai.akun.profile_picture || defaultAvatar
          }
        });
      } else {
        await UpdatePegawai(currentPegawai.id_pegawai, pegawaiData);
      }
      
      setShowModal(false);
      fetchPegawai();
    } catch (error) {
      console.error('Error saving pegawai data:', error);
      setError(error.response?.data?.error || 'Failed to save employee data. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await DeletePegawai(id);
        fetchPegawai();
      } catch (error) {
        console.error('Error deleting pegawai:', error);
        setError('Failed to delete employee. Please try again.');
      }
    }
  };

  const filteredPegawai = pegawaiList.filter(pegawai => {
    const matchesSearch = pegawai.nama_pegawai?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pegawai.id_pegawai?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === '' || (pegawai.akun && pegawai.akun.role === selectedRole);
    return matchesSearch && matchesRole;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPegawai.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPegawai.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="p-0 bg-white">
      {/* Navigation atas */}
      <div className="bg-white pt-4 px-3">
        <div className="max-width-container mx-auto">
          <Nav className="nav-tabs-custom border-0">
            <Nav.Item>
              <Nav.Link active className="px-5 py-2">Data Pegawai</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="px-5 py-2">Data Organisasi</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="px-5 py-2">Data Merchandise</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>

      <div className="max-width-container mx-auto pt-4 px-3">
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}
        
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="mb-0 fw-bold" style={{ color: '#03081F' }}>Data Pegawai</h2>
          </Col>
          <Col xs="auto">
            <Button 
              className="input-pegawai-btn"
              onClick={handleAddPegawai}
            >
              Input Pegawai
            </Button>
          </Col>
        </Row>

        <Row>
          {/* bagian siderbar buat role */}
          <Col md={3}>
            <Card className="border role-card">
              <Card.Header className="bg-white border-bottom p-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-list-ul me-2" style={{ color: '#03081F' }}></i>
                  <strong style={{ color: '#03081F' }}>Role</strong>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <ul className="list-group list-group-flush role-list">
                  {roles.map(role => (
                    <li 
                      key={role.id} 
                      className={`list-group-item px-3 py-3 ${selectedRole === role.id ? 'active-role' : ''}`}
                      onClick={() => handleRoleChange(role.id)}
                    >
                      {role.name}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* card content utamanya */}
          <Col md={9}>
            <div className="mb-4">
              <div className="position-relative">
                <i className="bi bi-search search-icon"></i>
                <Form.Control
                  type="search"
                  placeholder="Cari id, nama pegawai..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#028643' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Memuat data pegawai...</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-person-x" style={{ fontSize: '3rem', color: '#D9D9D9' }}></i>
                <p className="mt-3 text-muted">Tidak ada data pegawai yang sesuai dengan pencarian</p>
              </div>
            ) : (
              <>
                {currentItems.map((pegawai, index) => (
                  <Card key={index} className="mb-3 border employee-card">
                    <Card.Body className="p-3">
                      <Row className="align-items-center">
                        <Col xs={12} md={9}>
                          <div className="mb-1">
                            <span className="employee-id">#{pegawai.id_pegawai}</span>
                            {pegawai.akun && (
                              <span className="badge bg-light text-dark ms-2 role-badge">
                                {roles.find(r => r.id === pegawai.akun.role)?.name || pegawai.akun.role}
                              </span>
                            )}
                          </div>
                          <h5 className="employee-name mb-2">{pegawai.nama_pegawai}</h5>
                          <div className="mb-1">
                            <span className="text-muted">ID Akun: </span>
                            <span>{pegawai.id_akun}</span>
                          </div>
                          {pegawai.akun && pegawai.akun.email && (
                            <div className="mb-1">
                              <span className="text-muted">Email: </span>
                              <span>{pegawai.akun.email}</span>
                            </div>
                          )}
                          <div className="mb-0">
                            <span className="text-muted">Tanggal Lahir: </span>
                            <span>{new Date(pegawai.tanggal_lahir).toLocaleDateString('id-ID')}</span>
                          </div>
                        </Col>
                        <Col xs={12} md={3} className="d-flex justify-content-center justify-content-md-end mt-3 mt-md-0">
                          <div className="avatar-container">
                            <img 
                              src={(pegawai.akun && pegawai.akun.profile_picture) || defaultAvatar} 
                              alt={pegawai.nama_pegawai || 'Employee Avatar'} 
                              className="employee-avatar"
                              onError={(e) => {e.target.src = defaultAvatar}}
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="button-container mt-3 d-flex justify-content-end">
                        <Button 
                          variant="danger" 
                          className="delete-btn me-2"
                          onClick={() => handleDelete(pegawai.id_pegawai)}
                        >
                          Delete
                        </Button>
                        <Button 
                          variant="success"
                          className="edit-btn"
                          onClick={() => handleEditPegawai(pegawai.id_pegawai)}
                        >
                          Edit
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}

                {/* Logika buat Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4 pagination-container">
                    <Pagination className="custom-pagination">
                      <Pagination.Prev 
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </Pagination.Prev>
                      
                      {[...Array(totalPages).keys()].map(number => (
                        <Pagination.Item
                          key={number + 1}
                          active={number + 1 === currentPage}
                          onClick={() => paginate(number + 1)}
                        >
                          {number + 1}
                        </Pagination.Item>
                      ))}
                      
                      <Pagination.Next
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </Pagination.Next>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </div>

      {/* Add sama edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#028643', color: 'white' }}>
          <Modal.Title>{modalType === 'add' ? 'Tambah Pegawai Baru' : 'Edit Data Pegawai'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {modalType === 'add' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>ID Akun</Form.Label>
                  <Form.Control
                    type="text"
                    name="id_akun"
                    value={currentPegawai.id_akun || ''}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="akun.email"
                    value={currentPegawai.akun?.email || ''}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="akun.password"
                    value={currentPegawai.akun?.password || ''}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="akun.role"
                    value={currentPegawai.akun?.role || ''}
                    onChange={handleInputChange}
                    required
                    className="form-control-custom"
                  >
                    <option value="">Pilih Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Nama Pegawai</Form.Label>
              <Form.Control
                type="text"
                name="nama_pegawai"
                value={currentPegawai.nama_pegawai || ''}
                onChange={handleInputChange}
                required
                className="form-control-custom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Lahir</Form.Label>
              <Form.Control
                type="date"
                name="tanggal_lahir"
                value={currentPegawai.tanggal_lahir ? currentPegawai.tanggal_lahir.split('T')[0] : ''}
                onChange={handleInputChange}
                required
                className="form-control-custom"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-secondary" 
                className="me-2" 
                onClick={() => setShowModal(false)}
              >
                Batal
              </Button>
              <Button variant="success" type="submit">
                {modalType === 'add' ? 'Simpan' : 'Update'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .max-width-container {
          max-width: 1200px;
        }
        
        /* Navigation Tab Styles */
        .nav-tabs-custom {
          display: flex;
          border-bottom: 1px solid #E7E7E7;
        }
        
        .nav-tabs-custom .nav-link {
          color: #686868;
          border: none;
          margin-right: 20px;
          padding-bottom: 10px;
          font-weight: 500;
        }
        
        .nav-tabs-custom .nav-link.active {
          color: #03081F;
          font-weight: 600;
          border-bottom: 2px solid #028643;
        }
        
        /* Page Title and Button */
        .input-pegawai-btn {
          background-color: #028643;
          border-color: #028643;
          color: white;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 6px;
        }
        
        .input-pegawai-btn:hover {
          background-color: #026d36;
          border-color: #026d36;
        }
        
        /* Role Sidebar */
        .role-card {
          border-radius: 4px;
          overflow: hidden;
          border-color: #E7E7E7;
        }
        
        .role-list .list-group-item {
          border-left: none;
          border-right: none;
          cursor: pointer;
          color: #686868;
          border-color: #E7E7E7;
          transition: all 0.2s;
        }
        
        .role-list .list-group-item:first-child {
          border-top: none;
        }
        
        .role-list .list-group-item.active-role {
          background-color: #03081F;
          color: white;
          font-weight: 500;
        }
        
        .role-list .list-group-item:hover:not(.active-role) {
          background-color: #f8f9fa;
        }
        
        /* Search Input */
        .position-relative {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #686868;
          z-index: 10;
        }
        
        .search-input {
          height: 45px;
          padding-left: 45px;
          border-radius: 25px;
          border: 1px solid #E7E7E7;
        }
        
        .search-input:focus {
          box-shadow: none;
          border-color: #028643;
        }
        
        /* Employee Card */
        .employee-card {
          border-radius: 8px;
          border-color: #E7E7E7;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .employee-id {
          color: #686868;
          font-size: 0.9rem;
        }
        
        .role-badge {
          font-size: 0.75rem;
          background-color: #f0f0f0;
          color: #686868;
          font-weight: 500;
        }
        
        .employee-name {
          color: #03081F;
          font-weight: 600;
        }
        
        .employee-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        /* Button Styles */
        .delete-btn {
          background-color: #FF1700;
          border-color: #FF1700;
          font-weight: 500;
          border-radius: 4px;
        }
        
        .delete-btn:hover {
          background-color: #e61500;
          border-color: #e61500;
        }
        
        .edit-btn {
          background-color: #028643;
          border-color: #028643;
          font-weight: 500;
          border-radius: 4px;
        }
        
        .edit-btn:hover {
          background-color: #026d36;
          border-color: #026d36;
        }
        
        /* Pagination */
        .custom-pagination .page-item.active .page-link {
          background-color: #028643;
          border-color: #028643;
          color: white;
        }
        
        .custom-pagination .page-link {
          color: #028643;
          border-color: #E7E7E7;
          min-width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .custom-pagination .page-link:focus {
          box-shadow: none;
        }
        
        .custom-pagination .page-item:first-child .page-link,
        .custom-pagination .page-item:last-child .page-link {
          border-radius: 4px;
        }
        
        /* Form Controls */
        .form-control-custom:focus {
          border-color: #028643;
          box-shadow: 0 0 0 0.25rem rgba(2, 134, 67, 0.25);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .nav-tabs-custom .nav-link {
            padding: 10px;
            margin-right: 5px;
          }
          
          .employee-avatar {
            width: 60px;
            height: 60px;
            margin-top: 10px;
          }
        }
      `}</style>
    </Container>
  );
};

export default ManagePegawaiPage;