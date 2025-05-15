import { useEffect, useRef, useState } from "react";

let resolveCallback;

export const showConfirm = (message) => {
  const modalElement = document.getElementById("custom-confirm-modal");
  const modalInstance = new window.bootstrap.Modal(modalElement, {
    backdrop: "static",
    keyboard: false,
  });

  modalElement.querySelector(".modal-body").innerText = message;

  modalInstance.show();

  return new Promise((resolve) => {
    resolveCallback = resolve;
  });
};

const ConfirmModal = () => {
  const modalRef = useRef(null);

  const handleAnswer = (answer) => {
    const modalInstance = bootstrap.Modal.getInstance(modalRef.current);
    modalInstance.hide();
    resolveCallback(answer);
  };

  return (
    <div
      className="modal fade"
      id="custom-confirm-modal"
      tabIndex="-1"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ zIndex: 1060 }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Konfirmasi</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => handleAnswer(false)}
            ></button>
          </div>
          <div className="modal-body">Memuat pesan...</div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => handleAnswer(false)}
            >
              Batal
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleAnswer(true)}
            >
              Ya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;