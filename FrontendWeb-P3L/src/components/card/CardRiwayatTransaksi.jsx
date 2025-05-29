import React from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaStar, FaReceipt, FaCalendarAlt } from 'react-icons/fa';

const CardRiwayatTransaksi = ({ transaction, handleViewDetails, handleRatingClick, generateNotaNumber, formatDate, formatCurrency, getStatusBadgeColor, canBeRated }) => {
  return (
    <Card className="mb-3 border transaction-card">
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
                  {transaction.existing_review && (
                    <Badge bg="success" className="ms-2">
                      <FaStar className="me-1" />
                      Rated {transaction.existing_review.rating}/5
                    </Badge>
                  )}
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
              {canBeRated(transaction) ? (
                <Button 
                  variant="warning"
                  className="action-btn"
                  onClick={() => handleRatingClick(transaction)}
                >
                  <FaStar className="me-1" />
                  Beri Rating
                </Button>
              ) : transaction.existing_review ? (
                <Button 
                  variant="outline-success"
                  className="action-btn"
                  disabled
                >
                  <FaStar className="me-1" />
                  Sudah Dirating
                </Button>
              ) : null}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CardRiwayatTransaksi;