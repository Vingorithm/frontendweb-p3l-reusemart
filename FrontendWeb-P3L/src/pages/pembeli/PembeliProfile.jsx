import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiPembeli } from "../../clients/PembeliService";
import { apiSubPembelian } from "../../clients/SubPembelianService";
import { decodeToken } from '../../utils/jwtUtils';
import { FaEdit, FaSearch, FaChevronDown, FaChevronUp, FaHistory, FaArrowRight } from 'react-icons/fa';
import { apiAlamatPembeli } from "../../clients/AlamatPembeliServices";
import { GetPenitipById } from "../../clients/PenitipService";
import dayjs from "dayjs";
import KirimBuktiBayarModal from "../../components/modal/KirimBuktiBayarModal";
import { generateNotaPenjualan } from "../../components/pdf/CetakNotaPenjualan";
import { apiPembelian } from "../../clients/PembelianService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoints";

// Shared color palette
export const colors = {
  primary: '#028643',    // Ijo Tua
  secondary: '#FC8A06',  // Orange
  white: '#FFFFFF',      // Putih
  dark: '#03081F',       // Item
  gray: '#D9D9D9'        // Abu-abu
};

// Shared styles
export const sharedStyles = {
  container: {
    backgroundColor: colors.white,
    minHeight: '100vh',
    paddingTop: '2%',
    paddingLeft: '8%',
    paddingRight: '8%',
  },
  card: {
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    padding: '20px',
    border: `1px solid ${colors.gray}`,
  },
  headingStyle: {
    color: colors.dark,
    fontWeight: '700',
    marginBottom: '25px',
  },
  buttonPrimary: {
    padding: '10px 20px',
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  buttonSecondary: {
    padding: '10px 20px',
    backgroundColor: colors.secondary,
    color: colors.white,
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  }
};

// Additional styles for HistoryTransaksi
const historyStyles = {
  ...sharedStyles,
  historyHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  seeAllButton: {
    padding: '12px 24px',
    backgroundColor: colors.secondary,
    color: colors.white,
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(252, 138, 6, 0.3)',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: '#e67a05',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(252, 138, 6, 0.4)',
    }
  },
  cardImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '15px',
  },
  searchContainerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: "2% 0% 2% 0%",
    position: 'relative',
  },
  searchIconStyle: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.gray,
  },
  searchInputStyle: {
    padding: '12px 15px 12px 40px',
    borderRadius: '25px',
    border: `1px solid ${colors.gray}`,
    width: '100%',
    marginRight: '2%',
    backgroundColor: '#F8F9FA',
    fontSize: '14px',
  },
  totalText: {
    fontWeight: '600',
    fontSize: '1.1rem',
    marginTop: '10px',
    color: colors.dark,
  },
  statusPendingColor: colors.secondary,
  statusSuccessColor: colors.primary,
  statusFailedColor: '#dc3545',  // Red color for failed status
  productItem: {
    borderTop: `1px solid ${colors.gray}`,
    paddingTop: '15px',
    marginTop: '15px',
  },
  transactionCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: '30px',
    borderRadius: '15px',
    width: '80%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  deliveryStatus: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '25px',
    marginBottom: '20px',
    padding: '15px 0',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
  },
  deliveryStep: {
    textAlign: 'center',
  },
  deliveryDate: {
    fontSize: '0.85rem',
    color: colors.dark,
    marginTop: '5px',
  },
  noTransactions: {
    textAlign: 'center',
    padding: '50px 0',
    color: colors.dark,
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    marginTop: '20px',
  }
};

const HistoryTransaksi = ({ pembeliId }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedPembelian, setSelectedPembelian] = useState(null);
  const [countdowns, setCountdowns] = useState({});
  const [expiredIds, setExpiredIds] = useState(new Set());
  const [anyExpired, setAnyExpired] = useState(false);

  const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
  };

  const extractIdNumber = (id) => {
      const match = id.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
  };

  const generateNotaNumber = (transaction) => {
    const date = new Date(transaction.pembelian?.tanggal_pembelian);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const idPembelian = extractIdNumber(transaction.pembelian?.id_pembelian);

    return `${year}.${month}.${idPembelian}`;
  };

  const calculateRemainingTime = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "00:00:00";

    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prevCountdowns) => {
        if (anyExpired) {
          fetchTransactions();
        }

        const updatedCountdowns = {};
        setAnyExpired(false);

        transactions.forEach((transaction) => {
          const id = transaction.pembelian?.id_pembelian;
          const pembelianDate = new Date(transaction.pembelian?.tanggal_pembelian);
          const deadline = isNaN(pembelianDate)
            ? null
            : new Date(pembelianDate.getTime() + 15 * 60 * 1000);
          
          if (deadline) {
            const now = new Date();

            if (deadline > now) {
              updatedCountdowns[id] = calculateRemainingTime(deadline);
            } else {
              if (!expiredIds.has(id)) {
                setExpiredIds((prev) => new Set(prev).add(id));
                setAnyExpired(true);
              }
            }
          }
        });

        return updatedCountdowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [transactions, expiredIds]);

  // Fetch pembeli name
  const getPembeliName = async (idPembeli) => {
    try {
      const response = await apiPembeli.getPembeliById(idPembeli);
      console.log('pembeli name', response);
      // The response is already the parsed data, not a fetch Response object
      return response.pembeli?.nama || 'Unknown Pembeli';
    } catch (error) {
      console.error(`Error fetching pembeli name for ${idPembeli}:`, error);
      return 'Unknown Pembeli';
    }
  };

  // Fetch alamat details
  const getAlamatDetails = async (idAlamat) => {
    try {
      const response = await apiAlamatPembeli.getAlamatPembeliById(idAlamat);
      // The response is already the parsed data
      return response.alamat?.alamat_lengkap || 'Unknown Alamat';
    } catch (error) {
      console.error(`Error fetching alamat for ${idAlamat}:`, error);
      return 'Unknown Alamat';
    }
  };

  // Fetch penitip name
  const getPenitipName = async (idPenitip) => {
    try {
      const response = await GetPenitipById(idPenitip);
      // The response is already the parsed data
      return response.nama_penitip || 'Unknown Penitip';
    } catch (error) {
      console.error(`Error fetching penitip name for ${idPenitip}:`, error);
      return 'Unknown Penitip';
    }
  };

  const handleNavigateToFullHistory = () => {
    navigate('/pembeli/history');
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      if (!pembeliId) {
        throw new Error('Pembeli ID not found');
      }

      const subPembelianData = await apiSubPembelian.getSubPembelianByPembeliId(pembeliId);
      console.log('SubPembelian Data for user:', subPembelianData);

      if (!Array.isArray(subPembelianData)) {
        throw new Error('Invalid response data');
      }

      const transformedData = await Promise.all(
        subPembelianData.map(async (transaction) => {
          console.log('transaction ini', transaction);
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
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      setError('Failed to load your transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pembeliId) {
      fetchTransactions();
    }
  }, [pembeliId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusColor = (status) => {
    if (!status) return historyStyles.statusFailedColor;

    const lowerStatus = status.toLowerCase();

    if (
      lowerStatus === 'tidak mengirimkan bukti bayar' ||
      lowerStatus === 'pembayaran tidak valid'
    ) {
      return historyStyles.statusFailedColor;
    } else if (
      lowerStatus === 'pembayaran valid' ||
      lowerStatus === 'selesai'
    ) {
      return historyStyles.statusSuccessColor;
    } else if (
      lowerStatus === 'menunggu verifikasi pembayaran' ||
      lowerStatus === 'menunggu pembayaran'
    ) {
      return historyStyles.statusPendingColor;
    } else {
      return historyStyles.statusFailedColor;
    }
  };

  const filteredTransactions = transactions
  .map((transaction) => ({
    ...transaction,
    barang: Array.isArray(transaction.barang) ? transaction.barang : [],
  }))
  .filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      // Filter berdasarkan id_pembelian dan status_pembelian di dalam objek pembelian
      (transaction.pembelian?.id_pembelian &&
        transaction.pembelian.id_pembelian.toLowerCase().includes(query)) ||
      (transaction.pembelian?.status_pembelian &&
        transaction.pembelian.status_pembelian.toLowerCase().includes(query)) ||
      // Filter berdasarkan barang
      (transaction.barang &&
        transaction.barang.some(
          (item) =>
            (item.nama && item.nama.toLowerCase().includes(query)) ||
            (item.deskripsi && item.deskripsi.toLowerCase().includes(query))
        ))
    );
  });

  const handlePayment = async (id, data) => {
    try {
      const response = await apiPembelian.updatePembelian(id, data); 
      if(response) {
        toast.success("Berhasil mengirim bukti bayar!");
        await fetchTransactions();
      }
    } catch (error) {
      toast.error("Gagal mengirim bukti bayar!");
      console.error("Gagal mengirim bukti bayar: ", error);
    }
  }

  return (
    <div>
      <div style={historyStyles.historyHeaderContainer}>
        <h2 style={historyStyles.headingStyle}>Riwayat Transaksi</h2>
        <button
          style={historyStyles.seeAllButton}
          onClick={handleNavigateToFullHistory}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e67a05';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(252, 138, 6, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.secondary;
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(252, 138, 6, 0.3)';
          }}
        >
          <FaHistory />
          Lihat Semua Riwayat
          <FaArrowRight />
        </button>
      </div>
      
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" style={{ color: colors.primary }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div className="col mb-4">
            <div style={historyStyles.searchContainerStyle}>
              <FaSearch style={historyStyles.searchIconStyle} />
              <input
                type="text"
                placeholder="Cari Transaksi (ID, Status, Nama Barang)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={historyStyles.searchInputStyle}
              />
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div style={historyStyles.noTransactions}>
              <h5>Belum ada transaksi</h5>
              <p>Transaksi yang Anda lakukan akan muncul di sini</p>
            </div>
          ) : (
            <div className="row">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.pembelian.id_pembelian} className="card" style={historyStyles.card}>
                  <div style={historyStyles.transactionCardHeader}>
                    <div>
                      <h5 style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {transaction.pembelian.id_pembelian || 'N/A'}
                      </h5>
                      <p style={{ fontSize: '0.85rem', color: colors.dark, margin: 0 }}>No Nota: {generateNotaNumber(transaction)}</p>
                      <p style={{ fontSize: '0.85rem', color: colors.dark, margin: 0 }}>Waktu & Tanggal: {transaction.pembelian.tanggal_pembelian ? `${formatDate(transaction.pembelian.tanggal_pembelian)} ${formatTime(transaction.pembelian.tanggal_pembelian)}` : 'N/A'}</p>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: '500',
                        color: getStatusColor(transaction.pembelian.status_pembelian),
                        padding: '5px 12px',
                        borderRadius: '15px',
                        backgroundColor: `${getStatusColor(transaction.pembelian.status_pembelian)}15`, 
                      }}
                    >
                      {transaction.pembelian.status_pembelian || 'N/A'}
                    </p>
                  </div>

                  {expanded[transaction.pembelian.id_pembelian] && transaction.barang && (
                    <div className="mt-3">
                      {transaction.barang.map((item, index) => (
                        <div key={index} style={historyStyles.productItem}>
                          <div className="d-flex flex-row align-items-center mt-2">
                            <a href={`${ENDPOINTS.BASE_URL}/barang/${item.id_barang}`} className="me-2">
                              <img
                                src={`${ENDPOINTS.BASE_URL}/uploads/barang/${item.gambar?.split(',')[0] || 'default.jpg'}`}
                                alt={item.nama || 'No Name'}
                                style={historyStyles.cardImage}
                                onError={(e) => { e.target.src = 'default.jpg'; }}
                              />
                            </a>
                            <div className="d-flex justify-content-between align-items-start w-100">
                              <div>
                                <a href={`${ENDPOINTS.BASE_URL}/barang/${item.id_barang}`} style={{ textDecoration: "none", color: 'black'}}>
                                  <h6 style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                    {item.nama || 'No Name'}
                                  </h6>
                                </a>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: colors.dark }}>{item.deskripsi || 'No Description'}</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: colors.dark }}>
                                  <span style={{ fontWeight: '500' }}>Penjual:</span> {item.penitipName || 'N/A'}
                                </p>
                              </div>
                              <p style={{ 
                                margin: 0, 
                                fontSize: '1rem', 
                                fontWeight: '600', 
                                color: colors.primary,
                                marginLeft: '10px',
                                marginRight: '25px'
                              }}>
                                Rp {item.harga ? parseFloat(item.harga).toLocaleString('id-ID') : '0'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <p style={historyStyles.totalText}>
                      Total {transaction.barang?.length || 0} Produk: 
                      <span style={{ color: colors.primary, marginLeft: '8px' }}>
                        Rp {transaction.pembelian.total_bayar ? parseFloat(transaction.pembelian.total_bayar).toLocaleString('id-ID') : '0'}
                      </span>
                    </p>
                    <div>
                      <button
                        style={historyStyles.buttonPrimary}
                        onClick={() => toggleExpand(transaction.pembelian.id_pembelian)}
                      >
                        {expanded[transaction.pembelian.id_pembelian] ? (
                          <>
                            Tutup <FaChevronUp />
                          </>
                        ) : (
                          <>
                            Lihat <FaChevronDown />
                          </>
                        )}
                      </button>
                      {transaction.status_pembelian === 'Pembayaran valid' && (
                        <button
                          style={{...historyStyles.buttonSecondary, marginLeft: '10px'}}
                          onClick={() => alert('Fitur ulas belum diimplementasikan')}
                        >
                          Ulas
                        </button>
                      )}
                      {
                        countdowns[transaction.pembelian.id_pembelian] != null && (transaction.pembelian.status_pembelian === 'Menunggu pembayaran' || transaction.pembelian.status_pembelian === 'Menunggu verifikasi pembayaran') ? 
                        <button
                          style={{ ...historyStyles.buttonPrimary, marginLeft: '10px' }}
                          type="button"
                          data-bs-toggle="modal" data-bs-target="#kirim-bukti-bayar-modal"
                          onClick={() => setSelectedPembelian(transaction.pembelian)}
                        >
                          Bayar (
                          {(transaction.pembelian.status_pembelian === 'Menunggu pembayaran' || transaction.pembelian.status_pembelian === 'Menunggu verifikasi pembayaran') && (countdowns[transaction.pembelian.id_pembelian] || 'Memuat...')}
                          )
                        </button>
                        :
                        <></>
                      }
                      <button
                        style={{ ...historyStyles.buttonPrimary, marginLeft: '10px' }}
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowModal(true);
                        }}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showModal && selectedTransaction && (
            <div style={historyStyles.modalBackdrop}>
              <div style={historyStyles.modalContent}>
                <h3 style={{ color: colors.primary, marginBottom: '20px', fontWeight: '700' }}>Detail Pengiriman</h3>
                
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <h5 style={{ color: colors.dark, fontWeight: '600', marginBottom: '15px' }}>Informasi Pemesanan</h5>
                    <p><strong>ID Pembelian:</strong> {selectedTransaction.pembelian.id_pembelian || 'N/A'}</p>
                    <p><strong>Total {selectedTransaction.barang?.length || 0} Produk:</strong> 
                      <span style={{ color: colors.primary, fontWeight: '500', marginLeft: '5px' }}>
                        Rp {selectedTransaction.pembelian.total_bayar ? parseFloat(selectedTransaction.pembelian.total_bayar).toLocaleString('id-ID') : '0'}
                      </span>
                    </p>
                    <p>
                      <strong>Status Pembelian:</strong>{' '}
                      <span
                        style={{
                          color: getStatusColor(selectedTransaction.pembelian.status_pembelian),
                          fontWeight: '500',
                        }}
                      >
                        {selectedTransaction.pembelian.status_pembelian || 'N/A'}
                      </span>
                    </p>
                    <p><strong>Pembeli:</strong> {selectedTransaction.nama_pembeli || 'N/A'}</p>
                    <p><strong>Alamat:</strong> {selectedTransaction.alamat_pembeli || 'N/A'}</p>
                    <p><strong>Tanggal Pembelian:</strong> {selectedTransaction.pembelian.tanggal_pembelian ? formatDate(selectedTransaction.pembelian.tanggal_pembelian) : 'N/A'}</p>
                    <p><strong>Tanggal Pelunasan:</strong> {selectedTransaction.pembelian.tanggal_pelunasan ? formatDate(selectedTransaction.pembelian.tanggal_pelunasan) : 'N/A'}</p>
                    <p><strong>Point Diperoleh:</strong> {selectedTransaction.pembelian.poin_diperoleh || '0'} poin</p>
                  </div>
                  
                  <div style={{ flex: '1 1 400px' }}>
                    <h5 style={{ color: colors.dark, fontWeight: '600', marginBottom: '15px' }}>Detail Pengiriman</h5>
                    <p><strong>Jenis Pengiriman:</strong> {selectedTransaction.pengiriman?.jenis_pengiriman || 'N/A'}</p>
                    <p>
                      <strong>Status Pengiriman:</strong>{' '}
                      <span
                        style={{
                          color: getStatusColor(selectedTransaction.pengiriman?.status_pengiriman),
                          fontWeight: '500',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          backgroundColor: `${getStatusColor(selectedTransaction.pengiriman?.status_pengiriman)}15`,
                          fontSize: '0.9rem'
                        }}
                      >
                        {selectedTransaction.pengiriman?.status_pengiriman || 'N/A'}
                      </span>
                    </p>
                    
                    <div style={historyStyles.deliveryStatus}>
                      <div style={historyStyles.deliveryStep}>
                        <div style={{ fontWeight: '600', color: colors.primary }}>Dikemas</div>
                        <div style={historyStyles.deliveryDate}>
                          {selectedTransaction.pembelian?.tanggal_pelunasan ? formatDate(selectedTransaction.pembelian.tanggal_pelunasan) : 'N/A'}
                        </div>
                      </div>
                      <div style={historyStyles.deliveryStep}>
                        <div style={{ fontWeight: '600', color: colors.primary }}>Pengiriman</div>
                        <div style={historyStyles.deliveryDate}>
                          {selectedTransaction.pengiriman?.tanggal_mulai ? formatDate(selectedTransaction.pengiriman.tanggal_mulai) : 'N/A'}
                        </div>
                      </div>
                      <div style={historyStyles.deliveryStep}>
                        <div style={{ fontWeight: '600', color: colors.primary }}>Sampai</div>
                        <div style={historyStyles.deliveryDate}>
                          {selectedTransaction.pengiriman?.tanggal_berakhir ? formatDate(selectedTransaction.pengiriman.tanggal_berakhir) : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <h5 style={{ color: colors.dark, fontWeight: '600', marginTop: '20px', marginBottom: '15px' }}>Produk</h5>
                    {selectedTransaction.barang.map((item, index) => (
                      <div key={index} style={{ 
                        marginTop: '10px', 
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'transparent'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={`${ENDPOINTS.BASE_URL}/uploads/barang/${item.gambar?.split(',')[0] || 'default.jpg'}`}
                            alt={item.nama || 'No Name'}
                            style={historyStyles.cardImage}
                            onError={(e) => { e.target.src = 'default.jpg'; }}
                          />
                          <div>
                            <p style={{ lineHeight: '1.3', margin: '2px 0', fontWeight: '600' }}>{item.nama || 'N/A'}</p>
                            <p style={{ lineHeight: '1.3', margin: '2px 0', color: colors.primary, fontWeight: '500' }}>
                              Rp {item.harga ? parseFloat(item.harga).toLocaleString('id-ID') : '0'}
                            </p>
                            <p style={{ lineHeight: '1.3', margin: '2px 0', fontSize: '0.9rem' }}>{item.deskripsi || 'N/A'}</p>
                            <p style={{ lineHeight: '1.3', margin: '2px 0', fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: '500' }}>Penjual:</span> {item.penitipName || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  style={{ 
                    ...historyStyles.buttonPrimary, 
                    marginTop: '25px', 
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onClick={() => setShowModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <KirimBuktiBayarModal pembelian={selectedPembelian} onSend={handlePayment}/>
    </div>
  );
};

const PembeliProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token tidak ditemukan");
        
        const decoded = decodeToken(token);
        if (!decoded?.id) throw new Error("Invalid token structure");
        
        const idAkun = decoded.id;
        const dataPembeli = await apiPembeli.getPembeliByIdAkun(idAkun);
        setProfile(dataPembeli);
      } catch (error) {
        console.error("Gagal mengambil data profil pembeli:", error);
        setError("Gagal memuat data profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return 'N/A';
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) + `, pukul ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div style={sharedStyles.container}>
      <h2 style={sharedStyles.headingStyle}>Profil Pembeli</h2>
      
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" style={{ color: colors.primary }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && profile && (
        <div style={sharedStyles.card}>
          <div className="d-flex flex-row align-items-center">
            <img
              src={
                profile.Akun?.profile_picture
                  ? `${ENDPOINTS.BASE_URL}/uploads/profile_picture/${profile.Akun.profile_picture}`
                  : "/default-profile.jpg"
              }
              alt="Profile"
              className="rounded-circle"
              width="100"
              height="100"
              style={{ objectFit: 'cover' }}
            />
            <div className="ms-4 flex-grow-1">
              <h4 style={{ fontWeight: '600', color: colors.dark, marginBottom: '10px' }}>
                {profile.nama || 'N/A'}
              </h4>
              <p style={{ margin: '5px 0', color: colors.dark }}>
                <strong>Email:</strong> {profile.Akun?.email || 'N/A'}
              </p>
              <p style={{ margin: '5px 0', color: colors.primary, fontWeight: '500' }}>
                <strong>Total poin:</strong> {profile.total_poin || 0} Poin
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.85rem', color: colors.dark }}>
                Terdaftar sejak {formatTanggal(profile.tanggal_registrasi)}
              </p>
            </div>
            <button style={sharedStyles.buttonSecondary}>
              <FaEdit /> Edit Profil
            </button>
            <a href="/pembeli/alamat">
              <button className="btn btn-success rounded-pill p-2 ms-2">
                <i class="bi bi-house-door-fill"></i> Kelola Alamat
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Render HistoryTransaksi component with the pembeli ID */}
      {profile && <HistoryTransaksi pembeliId={profile.id_pembeli} />}
    </div>
  );
};

export default PembeliProfile;