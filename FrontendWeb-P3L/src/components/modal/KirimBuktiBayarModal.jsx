import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const KirimBuktiBayarModal = ({ pembelian, onSend }) => {
  const [fotoPreview, setFotoPreview] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  const resetForm = () => {
    if (pembelian?.bukti_bayar) {
      setFotoPreview(`http://localhost:3000/uploads/bukti_bayar/${pembelian.bukti_bayar}`);
    } else {
      setFotoPreview("");
    }
    setFotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!fotoFile && !pembelian?.bukti_bayar) {
      toast.error("Silakan pilih bukti pembayaran terlebih dahulu.");
      return;
    }

    if (fotoFile) {
    //   onSend(fotoFile);
      toast.success("Bukti pembayaran berhasil dikirim.");
    } else {
        
      toast.info("Bukti pembayaran lama tetap digunakan.");
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Hanya file gambar yang diperbolehkan!");
        e.target.value = "";
        return;
      }

      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById("kirim-bukti-bayar-modal");

    const onShow = () => resetForm();
    const onHide = () => resetForm();

    if (modalElement) {
      modalElement.addEventListener("shown.bs.modal", onShow);
      modalElement.addEventListener("hidden.bs.modal", onHide);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("shown.bs.modal", onShow);
        modalElement.removeEventListener("hidden.bs.modal", onHide);
      }
    };
  }, [pembelian]);

  return (
    <form onSubmit={handleSend}>
      <div
        className="modal fade"
        id="kirim-bukti-bayar-modal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Kirim Bukti Bayar</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input
                type="file"
                className="form-control mb-3"
                onChange={handleFotoChange}
                accept="image/*"
                ref={fileInputRef}
              />
              <p>Preview:</p>
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" className="img-fluid border w-100" />
              ) : (
                <div className="border p-5 text-center text-muted">
                  Tidak ada bukti bayar
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
              <button type="submit" className="btn btn-success">Kirim</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default KirimBuktiBayarModal;
