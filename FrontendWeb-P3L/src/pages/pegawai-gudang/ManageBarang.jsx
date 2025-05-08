import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faFileUpload, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import RoleSidebar from '../../components/navigation/Sidebar';
import { GetAllBarang, CreateBarang, UpdateBarang, DeleteBarang } from '../../clients/BarangService';
import { GetAllPenitip } from '../../clients/PenitipService';
import { GetAllPegawai } from '../../clients/PegawaiService';
import { CreatePenitipan } from '../../clients/PenitipanService';
import { decodeToken } from '../../utils/jwtUtils';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ManageBarang = () => {
  const [barangList, setBarangList] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [penitipList, setPenitipList] = useState([]);
  const [pegawaiList, setPegawaiList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPenitipanModal, setShowPenitipanModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [selectedView, setSelectedView] = useState('all');
  const [currentBarang, setCurrentBarang] = useState(null);
  
  const [formData, setFormData] = useState({
    id_penitip: '',
    id_hunter: '',
    id_pegawai_gudang: '',
    nama: '',
    deskripsi: '',
    harga: '',
    garansi_berlaku: false,
    tanggal_garansi: null,
    berat: '',
    status_qc: 'Belum QC',
    kategori_barang: ''
  });

  const [penitipanForm, setPenitipanForm] = useState({
    id_barang: '',
    tanggal_awal_penitipan: new Date(),
    tanggal_akhir_penitipan: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default 1 month
    tanggal_batas_pengambilan: new Date(new Date().setMonth(new Date().getMonth() + 1 + 1)), // Default 1 month + 1 month
    perpanjangan: false,
    status_penitipan: 'Aktif'
  });
  const kategoriOptions = ['Elektronik', 'Furniture', 'Pakaian', 'Aksesoris', 'Mainan', 'Buku', 'Lainnya'];
  const statusQCOptions = ['Belum QC', 'Lulus QC', 'Tidak Lulus QC'];
  const barangViews = [
    { id: 'all', name: 'Semua Barang' },
    { id: 'lulus-qc', name: 'Lulus QC' },
    { id: 'belum-qc', name: 'Belum QC' },
    { id: 'tidak-lulus-qc', name: 'Tidak Lulus QC' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBarangData();
  }, [selectedView, barangList, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [barangResponse, penitipResponse, pegawaiResponse] = await Promise.all([
        GetAllBarang(),
        GetAllPenitip(),
        GetAllPegawai()
      ]);
      
      setBarangList(barangResponse.data);
      setPenitipList(penitipResponse.data);
      setPegawaiList(pegawaiResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data. Silakan coba lagi nanti.'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBarangData = () => {
    let filtered = [...barangList];
    
    // Filter by view selection
    if (selectedView === 'lulus-qc') {
      filtered = filtered.filter(barang => barang.status_qc === 'Lulus QC');
    } else if (selectedView === 'belum-qc') {
      filtered = filtered.filter(barang => barang.status_qc === 'Belum QC');
    } else if (selectedView === 'tidak-lulus-qc') {
      filtered = filtered.filter(barang => barang.status_qc === 'Tidak Lulus QC');
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(barang => 
        barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barang.id_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barang.kategori_barang.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBarang(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePenitipanInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPenitipanForm({
      ...penitipanForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };

  const handlePenitipanDateChange = (date, field) => {
    setPenitipanForm({
      ...penitipanForm,
      [field]: date
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 2) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Maksimal 2 gambar yang dapat diunggah.'
      });
      return;
    }

    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const resetForm = () => {
    setFormData({
      id_penitip: '',
      id_hunter: '',
      id_pegawai_gudang: '',
      nama: '',
      deskripsi: '',
      harga: '',
      garansi_berlaku: false,
      tanggal_garansi: null,
      berat: '',
      status_qc: 'Belum QC',
      kategori_barang: ''
    });
    setSelectedImages([]);
    setImagePreview([]);
    setCurrentBarang(null);
  };

  const openModal = (barang = null) => {
    if (barang) {
      // Edit mode - set form with existing data
      setFormData({
        id_penitip: barang.id_penitip,
        id_hunter: barang.id_hunter || '',
        id_pegawai_gudang: barang.id_pegawai_gudang,
        nama: barang.nama,
        deskripsi: barang.deskripsi,
        harga: barang.harga,
        garansi_berlaku: barang.garansi_berlaku,
        tanggal_garansi: barang.tanggal_garansi ? new Date(barang.tanggal_garansi) : null,
        berat: barang.berat,
        status_qc: barang.status_qc,
        kategori_barang: barang.kategori_barang
      });
      setCurrentBarang(barang);
      
      // Handle images from existing data
      if (barang.gambar) {
        const imageUrls = barang.gambar.split(',').map(img => img.trim());
        setImagePreview(imageUrls);
      } else {
        setImagePreview([]);
      }
    } else {
      // Add mode - reset form
      resetForm();
    }
    setShowModal(true);
  };

  const openPenitipanModal = (barang) => {
    setPenitipanForm({
      ...penitipanForm,
      id_barang: barang.id_barang
    });
    setCurrentBarang(barang);
    setShowPenitipanModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.id_penitip || !formData.id_pegawai_gudang || !formData.nama || 
        !formData.deskripsi || !formData.harga || !formData.berat || !formData.kategori_barang) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Harap isi semua field yang diperlukan!'
      });
      return;
    }

    // Additional validation for garansi
    if (formData.garansi_berlaku && !formData.tanggal_garansi) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Tanggal garansi harus diisi jika garansi berlaku!'
      });
      return;
    }

    try {
      const formDataObj = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'tanggal_garansi' && formData[key]) {
          formDataObj.append(key, formData[key].toISOString());
        } else {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Append images if any new ones are selected
      if (selectedImages.length > 0) {
        selectedImages.forEach(image => {
          formDataObj.append('gambar', image);
        });
      }

      let response;
      if (currentBarang) {
        // Update existing barang
        response = await UpdateBarang(currentBarang.id_barang, formDataObj);
      } else {
        // Create new barang
        response = await CreateBarang(formDataObj);
      }

      // Success handling
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: currentBarang ? 'Data barang berhasil diperbarui!' : 'Data barang berhasil ditambahkan!'
      });
      
      setShowModal(false);
      resetForm();
      fetchData(); // Refresh data
      
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi nanti.'
      });
    }
  };

  const handlePenitipanSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Generate unique ID for penitipan
      const idBarang = penitipanForm.id_barang;
      const timestamp = new Date().getTime().toString().slice(-6); // Last 6 digits of timestamp
      const idPenitipan = `P${idBarang}${timestamp}`;
      
      const penitipanData = {
        ...penitipanForm,
        id_penitipan: idPenitipan,
        tanggal_awal_penitipan: penitipanForm.tanggal_awal_penitipan.toISOString(),
        tanggal_akhir_penitipan: penitipanForm.tanggal_akhir_penitipan.toISOString(),
        tanggal_batas_pengambilan: penitipanForm.tanggal_batas_pengambilan.toISOString()
      };
      
      await CreatePenitipan(penitipanData);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data penitipan barang berhasil dibuat!'
      });
      
      setShowPenitipanModal(false);
      
    } catch (error) {
      console.error('Error submitting penitipan form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat menyimpan data penitipan. Silakan coba lagi nanti.'
      });
    }
  };

  const handleDeleteBarang = async (id) => {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: "Apakah Anda yakin ingin menghapus barang ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await DeleteBarang(id);
          Swal.fire(
            'Terhapus!',
            'Barang berhasil dihapus.',
            'success'
          );
          fetchData(); // Refresh data
        } catch (error) {
          console.error('Error deleting barang:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal menghapus barang. Barang mungkin digunakan di data lain.'
          });
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Lulus QC':
        return <Badge bg="success">Lulus QC</Badge>;
      case 'Belum QC':
        return <Badge bg="warning" text="dark">Belum QC</Badge>;
      case 'Tidak Lulus QC':
        return <Badge bg="danger">Tidak Lulus QC</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Get penitip name by ID
  const getPenitipName = (id) => {
    const penitip = penitipList.find(p => p.id_penitip === id);
    return penitip ? penitip.nama : '-';
  };

  // Get pegawai name by ID
  const getPegawaiName = (id) => {
    const pegawai = pegawaiList.find(p => p.id_pegawai === id);
    return pegawai ? pegawai.nama : '-';
  };

  const renderImagePreview = () => {
    if (imagePreview.length === 0) {
      return <p className="text-muted">Tidak ada gambar yang dipilih</p>;
    }
    
    return (
      <div className="d-flex flex-wrap gap-2 mt-2">
        {imagePreview.map((src, index) => (
          <div key={index} className="position-relative" style={{ width: '150px', height: '150px' }}>
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              className="img-thumbnail"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={3} md={4} className="mb-4">
          <RoleSidebar
            namaSidebar="Kategori Barang"
            roles={barangViews}
            selectedRole={selectedView}
            handleRoleChange={setSelectedView}
          />
        </Col>
        <Col lg={9} md={8}>
          <Card className="border shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Manajemen Barang</h5>
                <Button variant="primary" size="sm" onClick={() => openModal()}>
                  <FontAwesomeIcon icon={faPlus} className="me-1" /> Tambah Barang
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Cari barang..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="mt-2">Memuat data...</p>
                </div>
              ) : filteredBarang.length === 0 ? (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-muted" style={{ fontSize: '3rem' }} />
                  <p className="mt-3 text-muted">Tidak ada data barang yang ditemukan</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover borderless>
                    <thead className="bg-light">
                      <tr>
                        <th>ID</th>
                        <th>Nama Barang</th>
                        <th>Penitip</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Status QC</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBarang.map((barang) => (
                        <tr key={barang.id_barang}>
                          <td>{barang.id_barang}</td>
                          <td>{barang.nama}</td>
                          <td>{getPenitipName(barang.id_penitip)}</td>
                          <td>{barang.kategori_barang}</td>
                          <td>Rp {parseFloat(barang.harga).toLocaleString()}</td>
                          <td>{getStatusBadge(barang.status_qc)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-warning" 
                                size="sm"
                                onClick={() => openModal(barang)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteBarang(barang.id_barang)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                              {barang.status_qc === 'Lulus QC' && (
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => openPenitipanModal(barang)}
                                >
                                  Penitipan
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Form Barang */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentBarang ? 'Edit Barang' : 'Tambah Barang Baru'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Penitip</Form.Label>
                  <Form.Select 
                    name="id_penitip"
                    value={formData.id_penitip}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Penitip</option>
                    {penitipList.map(penitip => (
                      <option key={penitip.id_penitip} value={penitip.id_penitip}>
                        {penitip.nama}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kategori Barang</Form.Label>
                  <Form.Select
                    name="kategori_barang"
                    value={formData.kategori_barang}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoriOptions.map((kategori, index) => (
                      <option key={index} value={kategori}>{kategori}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pegawai Gudang</Form.Label>
                  <Form.Select 
                    name="id_pegawai_gudang"
                    value={formData.id_pegawai_gudang}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Pegawai Gudang</option>
                    {pegawaiList
                      .filter(pegawai => pegawai.posisi === "Pegawai Gudang")
                      .map(pegawai => (
                        <option key={pegawai.id_pegawai} value={pegawai.id_pegawai}>
                          {pegawai.nama}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hunter (Opsional)</Form.Label>
                  <Form.Select 
                    name="id_hunter"
                    value={formData.id_hunter}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih Hunter</option>
                    {pegawaiList
                      .filter(pegawai => pegawai.posisi === "Hunter")
                      .map(pegawai => (
                        <option key={pegawai.id_pegawai} value={pegawai.id_pegawai}>
                          {pegawai.nama}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Nama Barang</Form.Label>
              <Form.Control
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                placeholder="Masukkan nama barang"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi barang"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Harga (Rp)</Form.Label>
                  <Form.Control
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleInputChange}
                    placeholder="Masukkan harga barang"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Berat (Kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="berat"
                    value={formData.berat}
                    onChange={handleInputChange}
                    placeholder="Masukkan berat barang"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status QC</Form.Label>
                  <Form.Select
                    name="status_qc"
                    value={formData.status_qc}
                    onChange={handleInputChange}
                    required
                  >
                    {statusQCOptions.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="garansi_berlaku"
                    label="Garansi Berlaku"
                    name="garansi_berlaku"
                    checked={formData.garansi_berlaku}
                    onChange={handleInputChange}
                    className="mt-4"
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.garansi_berlaku && (
              <Form.Group className="mb-3">
                <Form.Label>Tanggal Garansi</Form.Label>
                <DatePicker
                  selected={formData.tanggal_garansi}
                  onChange={(date) => handleDateChange(date, 'tanggal_garansi')}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal garansi"
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Gambar Barang (Maksimal 2 gambar)</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="form-control"
                />
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faFileUpload} />
                </span>
              </div>
              <Form.Text className="text-muted">
                Format yang didukung: JPEG, PNG, JPG. Ukuran maksimal: 5MB per file.
              </Form.Text>
              {renderImagePreview()}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              {currentBarang ? 'Perbarui' : 'Simpan'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Form Penitipan */}
      <Modal show={showPenitipanModal} onHide={() => setShowPenitipanModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Buat Penitipan Barang</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePenitipanSubmit}>
          <Modal.Body>
            {currentBarang && (
              <div className="mb-3">
                <h6>Detail Barang:</h6>
                <p>
                  <strong>ID:</strong> {currentBarang.id_barang} <br />
                  <strong>Nama:</strong> {currentBarang.nama} <br />
                  <strong>Penitip:</strong> {getPenitipName(currentBarang.id_penitip)}
                </p>
              </div>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Tanggal Awal Penitipan</Form.Label>
                              <DatePicker
                selected={penitipanForm.tanggal_akhir_penitipan}
                onChange={(date) => handlePenitipanDateChange(date, 'tanggal_akhir_penitipan')}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal akhir"
                minDate={penitipanForm.tanggal_awal_penitipan}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tanggal Batas Pengambilan</Form.Label>
              <DatePicker
                selected={penitipanForm.tanggal_batas_pengambilan}
                onChange={(date) => handlePenitipanDateChange(date, 'tanggal_batas_pengambilan')}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal batas pengambilan"
                minDate={penitipanForm.tanggal_akhir_penitipan}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="perpanjangan"
                label="Perpanjangan"
                name="perpanjangan"
                checked={penitipanForm.perpanjangan}
                onChange={handlePenitipanInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status Penitipan</Form.Label>
              <Form.Select
                name="status_penitipan"
                value={penitipanForm.status_penitipan}
                onChange={handlePenitipanInputChange}
                required
              >
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPenitipanModal(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageBarang;