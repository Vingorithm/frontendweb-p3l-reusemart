import React from 'react';
import { useState, useEffect } from 'react';
import DefaultProfilePicture from '../../assets/images/profile_picture/default.jpg';
import { GetAkunById } from "../../clients/AkunService";
import { GetPenitipByIdAkun } from '../../clients/PenitipService';
import { apiSubPembelian } from '../../clients/SubPembelianService';
import { decodeToken } from '../../utils/jwtUtils';
import DetailTransaksiPenitipModal from '../../components/modal/DetailTransaksiPenitipModal';

const PenitipProfile = () => {

    const [penitip, setPenitip] = useState(null);
    const [akun, setAkun] = useState(null);
    const [histori, setHistori] = useState([]);
    const [selectedHistori, setSelectedHistori] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return; // Jika tidak ada token, tidak bisa ambil data

        const idAkun = decodeToken(token).id;
        if (!idAkun) {
            console.error("ID Akun tidak ditemukan di token");
            return;
        }

        try {
            const response = await GetAkunById(idAkun);
            setAkun(response); // Menyimpan data akun pengguna ke state
            // console.log('response data', response);

            const dataPenitip = await GetPenitipByIdAkun(idAkun);
            setPenitip(dataPenitip);
            console.log('data penitip', dataPenitip);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const fetchHistori = async (id_penitip) => {
      const response = await apiSubPembelian.getSubPembelianByPenitipId(id_penitip);
      setHistori(response);
      console.log(response);
      
    }

    // Memanggil fetchUserData saat komponen dimuat
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if(penitip) fetchHistori(penitip.id_penitip)
    }, [penitip]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
    };

    const formatMoney = (nominal) => {
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(parseFloat(nominal));
      return formatted;
    }
    
    return <>
    <div className="container mt-5 mb-5">
      <h4 className="fw-bold mb-4">Halaman Profil Penitip</h4>
  
      <div className="card shadow border-0 p-4 d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <div className="position-relative me-3">
            <img
              src={akun && akun.profile_picture !== '' ? `http://localhost:3000/uploads/profile_picture/${akun.profile_picture}` : 'http://localhost:3000/uploads/profile_picture/default.jpg'}
              alt="Foto Profil"
              className="rounded-circle"
              style={{
                maxWidth:'80px',
                minWidth: '40px',
                aspectRatio: '1/1'
              }}
            />
            {penitip && penitip.badge == 1 ? <span
              className="badge bg-warning text-dark position-absolute top-0 start-50 translate-middle p-1 px-2"
              style={{ fontSize: '0.7rem', borderRadius: '1rem' }}
            >
               <i className="bi bi-fire"></i> Top Seller
            </span> : <></>}
            
          </div>
          <div>
            <h5 className="mb-1 fw-bold">{penitip && penitip.nama_penitip ? penitip.nama_penitip : ""}</h5>
            <p className="mb-1 text-muted">{akun && akun.email !== '' ? akun.email : ""}</p>
            <p className="mb-0 text-muted">
              Rating: <strong>{penitip && penitip.rating ? penitip.rating : ""}</strong>
            </p>
          </div>
        </div>
  
        <div className="text-md-end text-center">
          <p className="mb-0 text-muted">
            Terdaftar sejak <strong>{penitip && penitip.tanggal_registrasi ? formatDate(penitip.tanggal_registrasi) : ""}</strong>, pukul <strong>{penitip && penitip.tanggal_registrasi ? formatTime(penitip.tanggal_registrasi) : ""}</strong>
          </p>
        </div>
      </div>

      <h4 className="fw-bold mb-4">Keuntungan</h4>

      <div className="card shadow border-0 p-4 d-flex flex-column flex-md-row align-items-start justify-content-between mb-4">
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <div>
            <h5 className="mb-1 fw-bold">Saldo: {penitip && penitip.keuntungan ? <>Rp. {formatMoney(penitip.keuntungan)}</> : ""}</h5>
            <p className="mb-1 text-muted">Total poin: {penitip && penitip.total_poin != null ? penitip.total_poin : ""}</p>
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-4">Histori Penjualan</h4>
      <div className="row">
        <div className="col">
          {
            histori.length == 0 ? <div className='text-center fw-bold'>Belum ada transaksi penjualan.</div> : histori.map((h, i) => (
              <div className="card shadow border-0 p-4 d-flex flex-column align-items-start justify-content-center mb-4">
                {h.barang.map((b, i) => (
                  <div className='w-100 d-flex flex-column flex-md-row gap-3 justify-content-center justify-content-md-start align-items-center'>
                    <img src={`http://localhost:3000/uploads/barang/${b.gambar.split(',')[0]}`} alt="gambar-produk" className='rounded-circle' style={{
                      minWidth: '50px',
                      maxWidth: '150px',
                      aspectRatio: '1/1'
                    }}/>
                    <div className='d-flex flex-column justify-content-center justify-content-md-start align-items-center align-items-md-start'>
                      <p className='fw-bold'>{b.nama}</p>
                      <p className='text-secondary'>{formatDate(h.pembelian.tanggal_pembelian)}, {formatTime(h.pembelian.tanggal_pembelian)} WIB</p>
                      {
                        b.transaksi == null ? <p className='badge text-bg-danger'>Transaksi dibatalkan</p> : <p className='badge text-bg-success'>Pendapatan: Rp. {formatMoney(b.transaksi.pendapatan)}</p>
                      }
                    </div>
                  </div>
                ) )}
                <div className='w-100 d-flex align-items-center justify-content-md-end justify-content-center'>
                  <button type="button" class="btn btn-success" onClick={() => {setSelectedHistori(h); console.log(selectedHistori);
                  }} data-bs-toggle="modal" data-bs-target="#detail-transaksi-penitip-modal">Lihat Detail</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>

    <DetailTransaksiPenitipModal data={selectedHistori}/>
  </>
  
}

export default PenitipProfile;