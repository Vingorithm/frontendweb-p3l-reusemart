import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal, Badge } from 'react-bootstrap';
import { Link } from "react-router-dom";
import TopNavigation from "../../components/navigation/TopNavigation";
import ToastNotification from "../../components/toast/ToastNotification";
import PaginationComponent from "../../components/pagination/Pagination";
import { decodeToken } from '../../utils/jwtUtils';
import { apiPembeli } from "../../clients/PembeliService";
import { apiSubPembelian } from "../../clients/SubPembelianService";
import { apiAlamatPembeli } from "../../clients/AlamatPembeliServices";
import { GetPenitipById } from "../../clients/PenitipService";
import { apiPembelian } from "../../clients/PembelianService";
import { FaStar, FaRegStar, FaShippingFast, FaCalendarAlt, FaReceipt } from 'react-icons/fa';
import { toast } from "sonner";

const HistoryTransaksiPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [pembeli, setPembeli] = useState(null);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (pembeli) {
      fetchTransactionData();
    }
  }, [pembeli]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token tidak ditemukan");
      
      const decoded = decodeToken(token);
      if (!decoded?.id) throw new Error("Invalid token structure");
      
      const dataPembeli = await apiPembeli.getPembeliByIdAkun(decoded.id);
      setPembeli(dataPembeli);
    } catch (err) {
      setError("Gagal memuat data user!");
      showNotification("Gagal memuat data user!", 'danger');
      console.error("Error:", err);
    }
  };

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  // Fetch helper functions
  const getPembeliName = async (idPembeli) => {
    try {
      const response = await apiPembeli.getPembeliById(idPembeli);
      return response.pembeli?.nama || 'Unknown Pembeli';
    } catch (error) {
      console.error(`Error fetching pembeli name for ${idPembeli}:`, error);
      return 'Unknown Pembeli';
    }
  };

  const getAlamatDetails = async (idAlamat) => {
    try {
      const response = await apiAlamatPembeli.getAlamatPembeliById(idAlamat);
      return response.alamat?.alamat_lengkap || 'Unknown Alamat';
    } catch (error) {
      console.error(`Error fetching alamat for ${idAlamat}:`, error);
      return 'Unknown Alamat';
    }
  };

  const getPenitipName = async (idPenitip) => {
    try {
      const response = await GetPenitipById(idPenitip);
      return response.nama_penitip || 'Unknown Penitip';
    } catch (error) {
      console.error(`Error fetching penitip name for ${idPenitip}:`, error);
      return 'Unknown Penitip';
    }
  };

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      console.log('Fetching transaction data for pembeli:', pembeli.id_pembeli);
      
      const subPembelianData = await apiSubPembelian.getSubPembelianByPembeliId(pembeli.id_pembeli);
      console.log('SubPembelian Data:', subPembelianData);

      if (!Array.isArray(subPembelianData)) {
        throw new Error('Invalid response data');
      }

      const transformedData = await Promise.all(
        subPembelianData.map(async (transaction) => {
          const pembeliName = await getPembeliName(transaction.pembelian.id_pembeli);
          const alamatDetails = await getAlamatDetails(transaction.pembelian.id_alamat);
          const barangWithPenitip = await Promise.all(
            (transaction.barang || []).map(async (item) => ({
              ...item,
              penitipName: await getPenitipName(item.id_penitip),
            }))
          );
          return {
            ...transaction,
            nama_pembeli: pembeliName,
            alamat_pembeli: alamatDetails,
            barang: barangWithPenitip,
          };
        })
      );
      
      console.log('Transformed Data:', transformedData);
      setTransactions(transformedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      setError('Failed to load transaction data. Please try again.');
      showNotification('Failed to load transaction data. Please try again.', 'danger');
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(item => {
        const query = searchTerm.toLowerCase();
        return (
          (item.pembelian?.id_pembelian && item.pembelian.id_pembelian.toLowerCase().includes(query)) ||
          (item.barang && item.barang.some(barang => 
            barang.nama && barang.nama.toLowerCase().includes(query)
          ))
        );
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(item => 
        item.pembelian?.status_pembelian === statusFilter
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleViewDetails = (transaction) => {
    setCurrentTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleRatingClick = (transaction) => {
    setCurrentTransaction(transaction);
    setRating(0);
    setReview('');
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    try {
      // Here you would call your rating API
      // For now, just show success message
      showNotification(`Rating ${rating} bintang berhasil diberikan!`, 'success');
      setShowRatingModal(false);
      // You might want to refresh data or update the transaction status
    } catch (error) {
      console.error('Error submitting rating:', error);
      showNotification('Gagal memberikan rating. Silakan coba lagi.', 'danger');
    }
  };

  const generateNotaNumber = (transaction) => {
    const date = new Date(transaction.pembelian?.tanggal_pembelian);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const idPembelian = transaction.pembelian?.id_pembelian?.match(/\d+/)?.[0] || '0';
    return `${year}.${month}.${idPembelian}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    if (!status) return '#dc3545';
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('selesai') || lowerStatus.includes('valid')) {
      return '#028643';
    } else if (lowerStatus.includes('menunggu') || lowerStatus.includes('proses')) {
      return '#FC8A06';
    } else {
      return '#dc3545';
    }
  };

  const getStatusBadgeColor = (status) => {
    if (!status) return 'danger';
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('selesai') || lowerStatus.includes('valid')) {
      return 'success';
    } else if (lowerStatus.includes('menunggu') || lowerStatus.includes('proses')) {
      return 'warning';
    } else {
      return 'danger';
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const uniqueStatuses = [...new Set(transactions.map(t => t.pembelian?.status_pembelian).filter(Boolean))];

  return (
    <Container fluid className="p-0 bg-white">
      <TopNavigation />
      
      {/* Toast Notification */}
      <ToastNotification 
        show={showToast} 
        setShow={setShowToast} 
        message={toastMessage} 
        type={toastType} 
      />

      <div className="max-width-container mx-auto pt-4 px-3">
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}
        
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="mb-0 fw-bold" style={{ color: '#03081F' }}>Riwayat Transaksi</h2>
            <p className="text-muted mt-1">Daftar semua transaksi pembelian Anda</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div className="position-relative search-container">
                  <i className="bi bi-search search-icon"></i>
                  <Form.Control
                    type="search"
                    placeholder="Cari ID transaksi, nama barang..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>
                
                <Form.Select 
                  value={statusFilter} 
                  onChange={handleStatusFilterChange}
                  className="status-filter"
                >
                  <option value="">Semua Status</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Form.Select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#028643' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Memuat data transaksi...</p>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-receipt" style={{ fontSize: '3rem', color: '#D9D9D9' }}></i>
                <p className="mt-3 text-muted">Belum ada transaksi yang ditemukan</p>
              </div>
            ) : (
              <>
                {currentItems.map((transaction) => (
                  <Card key={transaction.pembelian.id_pembelian} className="mb-3 border transaction-card">
                    <Card.Body className="p-3">
                      <Row className="align-items-center">
                        <Col xs={12} md={8}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <div className="mb-1">
                                <span className="transaction-id">#{transaction.pembelian.id_pembelian}</span>
                                <Badge 
                                  bg={getStatusBadgeColor(transaction.pembelian.status_pembelian)}
                                  className="ms-2"
                                >
                                  {transaction.pembelian.status_pembelian || 'Unknown'}
                                </Badge>
                              </div>
                              
                              <div className="mb-1">
                                <span className="text-muted">No. Nota: </span>
                                <span>{generateNotaNumber(transaction)}</span>
                              </div>
                              
                              <div className="mb-1">
                                <span className="text-muted">
                                  <FaCalendarAlt className="me-1" />
                                  Tanggal: 
                                </span>
                                <span className="ms-1">{formatDate(transaction.pembelian.tanggal_pembelian)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <span className="text-muted">Produk ({transaction.barang?.length || 0}): </span>
                            <span className="fw-bold">
                              {transaction.barang?.slice(0, 2).map(item => item.nama).join(', ')}
                              {transaction.barang?.length > 2 && ` +${transaction.barang.length - 2} lainnya`}
                            </span>
                          </div>
                          
                          <div className="transaction-total">
                            <span className="text-muted">Total: </span>
                            <span className="fw-bold text-primary">
                              {formatCurrency(transaction.pembelian?.total_bayar || 0)}
                            </span>
                          </div>
                        </Col>
                        
                        <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
                          <div className="d-flex flex-column gap-2">
                            <Button 
                              variant="primary"
                              className="action-btn"
                              onClick={() => handleViewDetails(transaction)}
                            >
                              <FaReceipt className="me-1" />
                              Lihat Detail
                            </Button>
                            
                            {(transaction.pembelian?.status_pembelian?.toLowerCase().includes('selesai') || 
                              transaction.pengiriman?.status_pengiriman?.toLowerCase().includes('selesai')) && (
                              <Button 
                                variant="warning"
                                className="action-btn"
                                onClick={() => handleRatingClick(transaction)}
                              >
                                <FaStar className="me-1" />
                                Beri Rating
                              </Button>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <PaginationComponent 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                  />
                )}
              </>
            )}
          </Col>
        </Row>
      </div>

      {/* Detail Transaction Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Transaksi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTransaction && (
            <div>
              <h5 className="mb-3">Informasi Pemesanan</h5>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>ID Pembelian:</strong> {currentTransaction.pembelian.id_pembelian}</p>
                  <p><strong>No. Nota:</strong> {generateNotaNumber(currentTransaction)}</p>
                  <p><strong>Tanggal:</strong> {formatDate(currentTransaction.pembelian.tanggal_pembelian)}</p>
                  <p><strong>Status:</strong> 
                    <Badge 
                      bg={getStatusBadgeColor(currentTransaction.pembelian.status_pembelian)}
                      className="ms-2"
                    >
                      {currentTransaction.pembelian.status_pembelian}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <p><strong>Pembeli:</strong> {currentTransaction.nama_pembeli}</p>
                  <p><strong>Alamat:</strong> {currentTransaction.alamat_pembeli}</p>
                  <p><strong>Total:</strong> {formatCurrency(currentTransaction.pembelian.total_bayar)}</p>
                  <p><strong>Poin Diperoleh:</strong> {currentTransaction.pembelian.poin_diperoleh || 0} poin</p>
                </Col>
              </Row>

              {currentTransaction.pengiriman && (
                <div className="mb-3">
                  <h5>Informasi Pengiriman</h5>
                  <p><strong>Jenis Pengiriman:</strong> {currentTransaction.pengiriman.jenis_pengiriman}</p>
                  <p><strong>Status Pengiriman:</strong> 
                    <Badge 
                      bg={getStatusBadgeColor(currentTransaction.pengiriman.status_pengiriman)}
                      className="ms-2"
                    >
                      {currentTransaction.pengiriman.status_pengiriman}
                    </Badge>
                  </p>
                  <p><strong>Tanggal Mulai:</strong> {formatDate(currentTransaction.pengiriman.tanggal_mulai)}</p>
                  <p><strong>Tanggal Berakhir:</strong> {formatDate(currentTransaction.pengiriman.tanggal_berakhir)}</p>
                </div>
              )}

              <h5 className="mb-3">Detail Produk</h5>
              {currentTransaction.barang?.map((item, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      <Col xs={3} md={2}>
                        <img
                          src={`http://localhost:3000/uploads/barang/${item.gambar?.split(',')[0] || 'default.jpg'}`}
                          alt={item.nama}
                          className="img-fluid rounded"
                          style={{ maxHeight: '80px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'default.jpg'; }}
                        />
                      </Col>
                      <Col xs={9} md={10}>
                        <h6 className="mb-1">{item.nama}</h6>
                        <p className="mb-1 text-muted small">{item.deskripsi}</p>
                        <p className="mb-1"><strong>Penjual:</strong> {item.penitipName}</p>
                        <p className="mb-0 text-primary fw-bold">{formatCurrency(item.harga)}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Berikan Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTransaction && (
            <div>
              <h6 className="mb-3">Transaksi: {currentTransaction.pembelian.id_pembelian}</h6>
              
              <div className="mb-3">
                <label className="form-label">Rating (1-5 bintang):</label>
                <div className="d-flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => setRating(star)}
                      style={{ fontSize: '1.5rem', color: star <= rating ? '#FFD700' : '#D9D9D9' }}
                    >
                      {star <= rating ? <FaStar /> : <FaRegStar />}
                    </button>
                  ))}
                </div>
                <small className="text-muted">Rating yang dipilih: {rating} bintang</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Review (opsional):</label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tulis review Anda tentang produk dan layanan..."
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
            Batal
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmitRating}
            disabled={rating === 0}
          >
            Kirim Rating
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .max-width-container {
          max-width: 1200px;
        }
        
        .transaction-card {
          border-radius: 8px;
          border-color: #E7E7E7;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        
        .transaction-card:hover {
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .transaction-id {
          color: #686868;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .transaction-total {
          color: #4A4A4A;
          font-size: 1.1rem;
        }
        
        .action-btn {
          border-radius: 4px;
          font-weight: 500;
        }
        
        .search-container {
          position: relative;
          min-width: 300px;
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
        
        .status-filter {
          width: 200px;
          height: 45px;
          border-radius: 25px;
          border: 1px solid #E7E7E7;
        }
        
        .status-filter:focus {
          box-shadow: none;
          border-color: #028643;
        }
        
        @media (max-width: 768px) {
          .search-container {
            width: 100%;
          }
          
          .status-filter {
            width: 100%;
          }
        }
      `}</style>
    </Container>
  );
};

export default HistoryTransaksiPage;