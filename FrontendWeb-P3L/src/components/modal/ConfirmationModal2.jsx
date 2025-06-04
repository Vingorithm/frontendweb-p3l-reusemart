import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, handleClose, transaksi, handleConfirm }) => {
  const handleConfirmClick = () => {
    handleConfirm(transaksi);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasi Pengambilan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Apakah Anda yakin barang ini telah diambil?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleConfirmClick}>
          Konfirmasi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;