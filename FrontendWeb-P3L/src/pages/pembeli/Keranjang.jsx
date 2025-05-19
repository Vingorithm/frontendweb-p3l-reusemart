import Pagination from "../../components/pagination/Pagination";

const Keranjang = () => {

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

        {[...Array(4)].map((_, i) => (
          <div className="product-card mb-4 p-3 d-flex justify-content-between align-items-center flex-wrap" key={i}>
            <div className="flex-grow-1 me-3">
              <h6 className="fw-bold">Set Meja Kursi</h6>
              <p style={{ fontSize: '0.9rem' }} className="mb-1">WarongaJogja® (4.8 Stars)</p>
              <p style={{ fontSize: '0.85rem' }} className="mb-2">
                1 McChicken™ | 1 Big Mac™ | 1 Royal Cheeseburger, 3 medium sized French Fries, 3 cold drinks
              </p>
              <div className="price-text">Rp 1.000.000,-</div>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/100"
                alt="product"
                className="rounded-circle mb-2"
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
              <button className="btn buy-btn w-100">Beli</button>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-center">
          <Pagination/>
        </div>
      </div>
    </div>
  </div>
);

}

export default Keranjang;