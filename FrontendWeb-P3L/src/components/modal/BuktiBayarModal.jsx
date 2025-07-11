import { ENDPOINTS } from "../../api/endpoints";

const BuktiBayarModal = ({img}) => {
    return <>
        <div
            className="modal fade"
            id="cek-bukti-bayar-modal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Cek Bukti Bayar</h1>
                        <button type="button" className="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <img 
                        src={`${ENDPOINTS.BASE_URL}/uploads/bukti_bayar/${img}`} 
                        alt="Preview" 
                        className="img-fluid border w-100"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '${ENDPOINTS.BASE_URL}/uploads/bukti_bayar/error.jpg';
                        }}
                    />
                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default BuktiBayarModal;