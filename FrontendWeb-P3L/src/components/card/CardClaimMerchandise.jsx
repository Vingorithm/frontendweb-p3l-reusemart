import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { BsInfoCircle } from 'react-icons/bs';

const ClaimMerchandiseCard = ({ claim, onViewDetail }) => {
  const merchandise = claim.Merchandise || {};
  const pembeli = claim.Pembeli || {};
  const akun = pembeli.Akun || {};

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu diambil':
        return <Badge bg="warning" text="dark" className="status-badge">Menunggu Diambil</Badge>;
      case 'Diproses':
        return <Badge bg="info" className="status-badge">Diproses</Badge>;
      case 'Selesai':
        return <Badge bg="success" className="status-badge">Selesai</Badge>;
      default:
        return <Badge bg="secondary" className="status-badge">{status}</Badge>;
    }
  };

  const baseUrl = 'http://localhost:3000/uploads/merchandise/';

  return (
    <>
      <Card className="claim-card h-100">
        <Card.Body>
          <div className="row mb-3">
            <div className="col-6 claim-info">
              <small className="text-muted claim-id">{claim.id_claim_merchandise}</small>
              <div className="status-badge mt-1">{getStatusBadge(claim.status_claim_merchandise)}</div>
            </div>
            <div className="col-6 text-end date-info">
              <div className="text-muted small">Tanggal Claim</div>
              <div className="fw-medium" style={{ fontSize: '0.75rem' }}>
                {formatDate(claim.tanggal_claim)}
              </div>
            </div>
          </div>

          <div className="merchandise-info-container mb-3">
            <div className="d-flex align-items-center">
              {merchandise.gambar ? (
                <div className="me-3" style={{ width: '60px', height: '60px', overflow: 'hidden' }}>
                  <img
                    src={`${baseUrl}${merchandise.gambar.split(',')[0]}`}
                    alt={merchandise.nama_merchandise}
                    className="merchandise-image rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="no-image-placeholder rounded"
                    style={{ width: '60px', height: '60px', display: 'none' }}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                </div>
              ) : (
                <div
                  className="me-3 no-image-placeholder rounded"
                  style={{ width: '60px', height: '60px' }}
                >
                  <span className="text-muted">No Image</span>
                </div>
              )}
              <div>
                <h6 className="merchandise-name mb-1">{merchandise.nama_merchandise || '-'}</h6>
                <small className="text-muted">Poin: {merchandise.harga_poin || 0}</small>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <div>
              <div className="text-muted small">Pembeli</div>
              <div className="fw-medium">{pembeli.nama || '-'}</div>
            </div>
            <div className="text-end">
              <div className="text-muted small">Tanggal Ambil</div>
              <div className="fw-medium" style={{ fontSize: '0.75rem' }}>
                {formatDateTime(claim.tanggal_ambil)}
              </div>
            </div>
          </div>

          {claim.catatan || claim.alamat_pengambilan ? (
            <div className="additional-info mb-3">
              {claim.catatan && (
                <div className="mb-2">
                  <div className="text-muted small">Catatan</div>
                  <div className="fw-medium" style={{ fontSize: '0.75rem' }}>{claim.catatan}</div>
                </div>
              )}
              {claim.alamat_pengambilan && (
                <div>
                  <div className="text-muted small">Lokasi</div>
                  <div className="fw-medium" style={{ fontSize: '0.75rem' }}>{claim.alamat_pengambilan}</div>
                </div>
              )}
            </div>
          ) : null}

          <div className="d-flex flex-column gap-2 mt-3">
            <Button
              variant="outline-primary"
              className="lihat-detail-btn"
              onClick={() => onViewDetail(claim.id_claim_merchandise)}
            >
              <BsInfoCircle size={12} className="me-1" />
              Lihat Detail
            </Button>
          </div>
        </Card.Body>
      </Card>

      <style jsx>{`
        .claim-card {
          border-radius: 8px;
          border-color: #E7E7E7;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .claim-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .claim-info {
          display: flex;
          flex-direction: column;
          padding-right: 10px;
        }

        .claim-id {
          color: #686868;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .status-badge {
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.65rem;
        }

        .status-badge .badge {
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .date-info {
          padding-left: 10px;
        }

        .merchandise-name {
          color: #03081F;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .merchandise-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          font-size: 0.7rem;
        }

        .additional-info {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
        }

        .lihat-detail-btn {
          border-color: #028643;
          color: #028643;
        }

        .lihat-detail-btn:hover {
          background-color: #028643;
          color: white;
          border-color: #028643;
        }
      `}</style>
    </>
  );
};

export default ClaimMerchandiseCard;