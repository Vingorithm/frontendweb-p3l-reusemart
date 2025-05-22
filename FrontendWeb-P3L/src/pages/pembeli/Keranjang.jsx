import { useEffect, useState } from "react";
import Pagination from "../../components/pagination/Pagination";
import { apiPembeli } from "../../clients/PembeliService";
import { decodeToken } from "../../utils/jwtUtils";
import { apiKeranjang } from "../../clients/KeranjangService";

const Keranjang = () => {

  const [akun, setAkun] = useState(null);
  const [pembeli, setPembeli] = useState(null);
  const [carts, setCarts] = useState([]);

  const filtered = carts;

  const fetchUserData = async () => {
    if(localStorage.getItem("authToken")){
        try {
          const token = localStorage.getItem("authToken");
          if (!token) throw new Error("Token tidak ditemukan");
          
          const decoded = decodeToken(token);
          setAkun(decoded);
          if (!decoded?.id) throw new Error("Invalid token structure");
          if(decoded.role == "Pembeli") {
            const dataPembeli = await apiPembeli.getPembeliByIdAkun(decoded.id);
            setPembeli(dataPembeli);
            console.log('data pembeli', dataPembeli);
            
          } else {
            throw new Error("Role bukan pembeli");
          }
        } catch (error) {
          setError("Gagal memuat data user!");
          toast.error("Gagal memuat data user!");
          console.error("Error:", err);
        }
      }
  }

  const fetchProduct = async () => {
    if(pembeli) {
      const response = await apiKeranjang.getKeranjangByIdPembeli(pembeli.id_pembeli);
      if(response) {
        setCarts(response);
        console.log('data produk', response);
      }
    }
  }

  const formatMoney = (nominal) => {
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(nominal));
    return formatted;
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [pembeli])

  return (
  <div className="container-fluid mt-4 px-5" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9f9f9' }}>
    <style>
      {`
        .category-active {
          background-color:rgb(0, 145, 12);
          color: white;
          font-weight: 600;
        }
        .category-item {
          cursor: pointer;
          font-size: 0.95rem;
          padding: 10px 15px;
          border-radius: 6px;
          margin-bottom: 5px;
        }
        .product-card {
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .price-text {
          font-weight: 700;
          font-size: 1.25rem;
        }
        .buy-btn {
          background-color: #199e4a;
          color: white;
          font-weight: 600;
          border-radius: 8px;
        }
        .buy-btn:hover {
          background-color: #157c3a;
        }
        .pagination .page-item.active .page-link {
          background-color: #1d2b53;
          border-color: #1d2b53;
        }
      `}
    </style>

    <div className="row">
      {/* Sidebar */}
      <div className="col-lg-3 mb-3">

        <div class="accordion accordion-flush" id="accordionFlushExample">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                Accordion Item #1
              </button>
            </h2>
            <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item’s accordion body.</div>
            </div>
          </div>
        </div>
        
        <div className="p-3" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h5 className="fw-bold mb-3">
            <i className="bi bi-list me-2"></i>Kategori
          </h5>
          {[
            "Perabotan Rumah Tangga",
            "Elektronik & Gadget",
            "Pakaian & Aksesoris",
            "Kosmetik & Perawatan Diri",
            "Buku, Alat Tulis, & Peralatan Sekolah",
            "Hobi, Mainan, & Koleksi",
            "Perlengkapan Bayi & Anak",
            "Otomotif & Aksesoris",
            "Perlengkapan Taman & Outdoor",
            "Peralatan Kantor & Industri"
          ].map((cat, index) => (
            <div
              key={index}
              className={`category-item ${index === 0 ? 'category-active' : ''}`}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="col-lg-9">
        <h4 className="fw-bold mb-4">Halaman Keranjang</h4>

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Ketik 'Kursi Estetik' ✨"
            style={{ maxWidth: '400px', borderRadius: '8px' }}
          />
          <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: '8px' }}>
            Urutkan berdasarkan harga
          </button>
        </div>
        {
          filtered.length == 0 ? 
          <><p className="text-center fw-bold mt-5">Belum ada produk di keranjang</p></> 
          : 
          filtered.map((item, i) => <div key={i} className="product-card flex-column mb-4 p-4 d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex flex-row w-100">
              <div className="flex-grow-1 me-3">
                <h6 className="fw-bold">{item?.Barang?.nama} {item?.Barang?.Penitipan?.status_penitipan == "Dalam masa penitipan" ? <></> : <span class="badge text-bg-danger">Terjual</span>}</h6> 
                <p style={{ fontSize: '0.9rem' }} className="mb-1">{item?.Barang?.Penitip?.nama_penitip} ({item?.Barang?.Penitip?.rating})</p>
                <p style={{ fontSize: '0.85rem' }} className="mb-2">
                  {item?.Barang?.deskripsi}
                </p>
                <div className="price-text">Rp {formatMoney(item?.Barang?.harga)}</div>
              </div>
              <div className="text-center">
                <img
                  src={"http://localhost:3000/uploads/foto_produk/placeholder.png"}
                  alt="product"
                  className="rounded-circle mb-2"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              </div>
            </div>
            
            <div className="d-flex flex-row w-100 justify-content-end">
              <button className={`btn btn-danger me-2`}>Hapus dari keranjang</button>
              <button className={`btn btn-success ${item?.Barang?.Penitipan?.status_penitipan == "Dalam masa penitipan" ? "" : "disabled"}`}>Beli</button>
            </div>
          </div>)
        }

        <div className="d-flex justify-content-center">
          <Pagination/>
        </div>
      </div>
    </div>
  </div>
);

}

export default Keranjang;