import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const KirimBuktiBayarModal = ({pembelian, onSend}) => {
    const [fotoPreview, setFotoPreview] = useState("");
    const [fotoFile, setFotoFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleSend = (e) => {
        e.preventDefault();
        toast.success("Terkirim");
    }

    useEffect(() => {
        if (pembelian) {
            if(pembelian.bukti_bayar) {
                setFotoPreview(`http://localhost:3000/uploads/bukti_bayar/${pembelian?.bukti_bayar}`);
            } else {
                setFotoPreview("");
            }
        }
    }, [pembelian]);

    const resetForm = () => {
        if(pembelian) {
            if(pembelian.bukti_bayar) {
                setFotoPreview(`http://localhost:3000/uploads/bukti_bayar/${pembelian?.bukti_bayar}`);
            } else {
                setFotoPreview("");
            }
            setFotoFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        }
    }

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

    return <>
        <form onSubmit={(e) => handleSend(e)}>
            <div class="modal fade" id="kirim-bukti-bayar-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Kirim Bukti Bayar</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
                    </div>
                    <div class="modal-body">
                        <input type="file" className="border border-2 w-100 p-2 mb-2" onChange={handleFotoChange} accept="image/*" ref={fileInputRef} />
                        <p>Preview:</p>
                        <img src={fotoPreview} alt="" className="border w-100 " />
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>Close</button>
                        <button type="submit" class="btn btn-success">Kirim</button>
                    </div>
                    </div>
                </div>
            </div>
        </form>
    </>
}

export default KirimBuktiBayarModal;