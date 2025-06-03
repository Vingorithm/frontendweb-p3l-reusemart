import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';

const TopNavigation = ({ userRole }) => {
  const location = useLocation();

  const getRoleBasedMenu = (role) => {
    switch (role) {
      case 'Admin':
        return [
          { name: 'Data Pegawai', path: '/admin/pegawai' },
          { name: 'Data Organisasi', path: '/admin/organisasi' },
          { name: 'Data Merchandise', path: '/admin/merchandise' },
        ];
      case 'Pegawai Gudang':
        return [
          { name: 'Daftar Barang', path: '/pegawai-gudang/barang' },
          { name: 'Daftar Transaksi', path: '/pegawai-gudang/transaksi' },
          { name: 'Pengambilan', path: '/pegawai-gudang/pengambilan' },
          { name: 'Pengiriman', path: '/pegawai-gudang/pengiriman' },
        ];
      case 'Owner':
        return [
          { name: 'Produk Disumbangkan', path: '/owner/produk' },
          { name: 'Laporan Bulanan', path: '/owner/bulanan' },
          { name: 'Laporan Komisi', path: '/owner/komisi' },
          { name: 'Laporan Stok Gudang', path: '/owner/stok' },
          { name: 'Laporan Kategori', path: '/owner/kategori' },
          { name: 'Penitipan Habis', path: '/owner/penitipan' },
          { name: 'Laporan Donasi', path: '/owner/donasi' },
          { name: 'Rekap Request', path: '/owner/rekap' },
        ];
      case 'Customer Service':
        return [
          { name: 'Data Penitip', path: '/cs/penitip' },
          { name: 'Bukti Transfer', path: '/cs/bukti' },
          { name: 'Diskusi Produk', path: '/cs/diskusi' },
          { name: 'Merchandise', path: '/cs/merch' },
          { name: 'History Merchandise', path: '/cs/history' },
        ];
      case 'Penitip':
        return [
          { name: 'Daftar Barang Titipan', path: '/penitip/barang' },
          { name: 'History Penjualan', path: '/penitip/history' },
          { name: 'Laporan Transaksi', path: '/penitip/laporan' },
        ];
      case 'Organisasi Amal':
        return [
          { name: 'Produk Disumbangkan', path: '/organisasi/produk' },
          { name: 'Kelola Request', path: '/organisasi/request' },
          { name: 'History Donasi', path: '/organisasi/history' },
        ];
      default:
        return [];
    }
  };

  const roleMenu = getRoleBasedMenu(userRole);

  const isActiveLink = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path) &&
          location.pathname !== item.path &&
          !item.exact;
  };

  return (
    <div className="bg-white pt-4 px-3 navigation-container">
      <div className="max-width-container mx-auto">
        <Nav className="nav-tabs-custom border-0">
          {roleMenu.map((item, index) => (
          <Nav.Item key={item.name} className="nav-item-animated" style={{ animationDelay: `${index * 0.1}s` }}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `${isActiveLink(item) || isActive ? 'active' : ''} nav-link nav-link-enhanced`
              }
              style={{ textDecoration: 'none' }}
            >
              <span className="nav-text">{item.name}</span>
              <div className="nav-indicator"></div>
            </NavLink>
          </Nav.Item>
          ))}
        </Nav>
      </div>

      <style jsx>{`
        .navigation-container {
          background: #FFFFF;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid rgba(231, 231, 231, 0.5);
        }
        
        .max-width-container {
          max-width: 1200px;
        }
        
        .nav-tabs-custom {
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: none;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0 20px;
          position: relative;
        }
        
        .nav-tabs-custom::-webkit-scrollbar {
          display: none;
        }
        
        .nav-item-animated {
          opacity: 0;
          transform: translateY(-10px);
          animation: slideInDown 0.6s ease-out forwards;
        }
        
        @keyframes slideInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .nav-link-enhanced {
          color: #686868 !important;
          border: none;
          margin: 0 15px;
          padding: 12px 20px;
          font-weight: 500;
          white-space: nowrap;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 25px;
          overflow: hidden;
          background: transparent;
        }
        
        .nav-text {
          position: relative;
          z-index: 2;
          transition: color 0.3s ease;
        }
        
        .nav-indicator {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #028643 0%, #34d399 100%);
          border-radius: 2px;
          transform: translateX(-50%);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-link-enhanced:hover {
          color: #03081F !important;
          transform: translateY(-2px);
          background: rgba(2, 134, 67, 0.05);
          box-shadow: 0 4px 15px rgba(2, 134, 67, 0.1);
        }
        
        .nav-link-enhanced:hover .nav-indicator {
          width: 60%;
        }
        
        .nav-link-enhanced.active {
          color: #03081F !important;
          font-weight: 600;
          background: linear-gradient(135deg, rgba(2, 134, 67, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(2, 134, 67, 0.15);
        }
        
        .nav-link-enhanced.active .nav-indicator {
          width: 80%;
          height: 3px;
          background: linear-gradient(90deg, #028643 0%, #34d399 100%);
          box-shadow: 0 2px 8px rgba(2, 134, 67, 0.3);
        }
        
        .nav-link-enhanced.active .nav-text {
          color: #028643;
        }
        
        /* Pulse animation for active link */
        .nav-link-enhanced.active::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(2, 134, 67, 0.1) 0%, transparent 70%);
          border-radius: 25px;
          transform: translate(-50%, -50%) scale(0);
          animation: pulse 2s infinite;
          z-index: 1;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .nav-tabs-custom {
            justify-content: flex-start;
            padding: 0 10px;
          }
          
          .nav-link-enhanced {
            padding: 10px 16px;
            margin: 0 8px;
            font-size: 14px;
          }
          
          .nav-indicator {
            height: 2px;
          }
          
          .nav-link-enhanced.active .nav-indicator {
            height: 2px;
          }
        }
        
        @media (max-width: 480px) {
          .nav-link-enhanced {
            padding: 8px 12px;
            margin: 0 4px;
            font-size: 13px;
          }
        }
        
        /* Smooth scrolling for overflow */
        .nav-tabs-custom {
          scroll-behavior: smooth;
        }
        
        /* Add a subtle gradient overlay for the container */
        .navigation-container::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #028643 50%, transparent 100%);
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

export default TopNavigation;