import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { BsPencil, BsTrash, BsBox } from 'react-icons/bs';

const CardListBarang = ({ 
  barang, 
  getPenitipName, 
  onEdit, 
  onDelete, 
  getStatusBadge 
}) => {
  return (
    <Card className="barang-card h-100 border">
      <Card.Body className="p-3">
        <div className="mb-2 card-header-section">
          <span className="barang-id">#{barang.id_barang}</span>
          <div className="ms-auto">
            {getStatusBadge(barang.status_qc)}
          </div>
        </div>
        
        <div className="image-container mb-3">
          {barang.gambar ? (
            <img 
              src={barang.gambar.split(',')[0].trim()} 
              alt={barang.nama} 
              className="barang-image"
              onError={(e) => {e.target.src = 'https://via.placeholder.com/200?text=No+Image'}}
            />
          ) : (
            <div className="no-image-placeholder">
              <BsBox size={40} color="#d9d9d9" />
            </div>
          )}
        </div>
        
        <h5 className="barang-name mb-2">{barang.nama}</h5>
        
        <div className="mb-2">
          <Badge bg="light" text="dark" className="kategori-badge">
            {barang.kategori_barang}
          </Badge>
        </div>
        
        <div className="barang-info mb-1">
          <span className="text-muted">Penitip: </span>
          <span className="fw-medium">{getPenitipName(barang.id_penitip)}</span>
        </div>
        
        <div className="barang-info mb-1">
          <span className="text-muted">Harga: </span>
          <span className="fw-medium">Rp {parseFloat(barang.harga).toLocaleString()}</span>
        </div>
        
        <div className="barang-info mb-1">
          <span className="text-muted">Berat: </span>
          <span className="fw-medium">{barang.berat} kg</span>
        </div>
        
        <div className="barang-info mb-3">
          <span className="text-muted">Garansi: </span>
          <span className="fw-medium">{barang.garansi_berlaku ? 'Ya' : 'Tidak'}</span>
        </div>
        
        <div className="action-buttons mt-auto d-flex justify-content-end">
          <Button 
            variant="outline-success" 
            size="sm"
            className="edit-btn me-2"
            onClick={() => onEdit(barang)}
          >
            <BsPencil /> Edit
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm"
            className="delete-btn"
            onClick={() => onDelete(barang.id_barang)}
          >
            <BsTrash /> Hapus
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardListBarang;