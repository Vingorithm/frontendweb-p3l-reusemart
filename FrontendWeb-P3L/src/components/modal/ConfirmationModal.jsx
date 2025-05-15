import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import maskotDelete from '../../assets/images/maskot21.png';
import maskotUpdate from '../../assets/images/maskot25.png';

/**
 * A customized confirmation modal component
 * 
 * @param {Object} props
 * @param {boolean} props.show - Controls visibility of modal
 * @param {function} props.onHide - Function to close the modal
 * @param {function} props.onConfirm - Function to call when action is confirmed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmButtonText - Text for confirm button (default: "Konfirmasi")
 * @param {string} props.cancelButtonText - Text for cancel button (default: "Batal")
 * @param {string} props.confirmButtonVariant - Bootstrap variant for confirm button (default: "success")
 * @param {string} props.modalType - Type of modal (default: "general", options: "delete", "update")
 */
const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmButtonText = "Konfirmasi",
  cancelButtonText = "Batal",
  confirmButtonVariant = "success",
  modalType = "general"
}) => {
  
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  // Determine which mascot to display based on modalType
  const getMascotImage = () => {
    switch(modalType) {
      case 'delete':
        return maskotDelete;
      case 'update':
        return maskotUpdate;
      default:
        return null;
    }
  };
  
  // Determine header background color based on modalType
  const getHeaderBgColor = () => {
    switch(modalType) {
      case 'delete':
        return '#dc3545'; // Red for delete
      case 'update':
        return '#028643'; // Green for update/default
      default:
        return '#028643';
    }
  };

  const mascotImage = getMascotImage();
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: getHeaderBgColor(), color: 'white' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="d-flex align-items-center">
          {mascotImage && (
            <div className="me-3">
              <img 
                src={mascotImage} 
                alt="Mascot" 
                style={{ width: '70px', height: 'auto' }} 
              />
            </div>
          )}
          <p className="mb-0">{message}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
        >
          {cancelButtonText}
        </Button>
        <Button 
          variant={confirmButtonVariant} 
          onClick={handleConfirm}
        >
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;