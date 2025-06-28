import React, { useState, useEffect } from 'react';
import { decodeToken } from "../../utils/jwtUtils";
import { TarikSaldoPenitip } from '../../clients/PenitipService';
import { GetPenitipByIdAkun } from '../../clients/PenitipService';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Form,  
  Badge, 
  Spinner 
} from 'react-bootstrap';
import RoleSidebar from '../../components/navigation/Sidebar';
import ToastNotification from '../../components/toast/ToastNotification';
import PaginationComponent from '../../components/pagination/Pagination';
import ConfirmationModalUniversal from '../../components/modal/ConfirmationModalUniversal';

const PenarikanSaldoPage = () => {
    const [penitip, setPenitip] = useState(null);
    const [loggedInPenitipId, setLoggedInPenitipId] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmType, setConfirmType] = useState('warning');
    const [confirmMessage, setConfirmMessage] = useState('');
    const [nominalTarik, setNominalTarik] = useState('');
    const [loading, setLoading] = useState(false);
    
    const showNotification = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    const handleTarikSaldo = async () => {
        if (!nominalTarik || isNaN(nominalTarik) || parseFloat(nominalTarik) <= 0) {
            showNotification("Nominal penarikan tidak valid", "danger");
            return;
        }

        if (parseFloat(nominalTarik) > penitip?.keuntungan) {
            showNotification("Nominal penarikan melebihi saldo tersedia", "danger");
            return;
        }

        if (!loggedInPenitipId) {
            showNotification("ID Penitip tidak tersedia", "danger");
            return;
        }

        setLoading(true);
        try {
            await TarikSaldoPenitip(loggedInPenitipId, { nominal: parseFloat(nominalTarik) });
            showNotification("Penarikan saldo berhasil");
            setNominalTarik('');
            const updatedPenitip = await GetPenitipByIdAkun(loggedInPenitipId);
            setPenitip(updatedPenitip);
        } catch (err) {
            console.error("Tarik saldo gagal:", err.message);
            showNotification(`Penarikan gagal: ${err.response?.data?.message || err.message}`, "danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("Token tidak ditemukan");
            
            const decoded = decodeToken(token);
            console.log('Decoded token:', decoded);
            if (!decoded?.id) throw new Error("Invalid token structure");
            
            if (decoded.role === "Penitip") {
              const response = await GetPenitipByIdAkun(decoded.id);
              console.log('GetPenitipByIdAkun response:', response);
              
              const dataPenitip = response;
              console.log('Data penitip response:', dataPenitip);
              if (!dataPenitip || !dataPenitip.id_penitip) {
                throw new Error("Data penitip tidak valid atau id_penitip tidak ditemukan");
              }
              setPenitip(dataPenitip);
              setLoggedInPenitipId(dataPenitip.id_penitip);
              console.log('Set loggedInPenitipId:', dataPenitip.id_penitip);
            }
          } catch (err) {
            console.error("Error fetching user data:", err.message);
            setError("Gagal memuat data user: " + err.message);
            showNotification("Gagal memuat data user: " + err.message, "danger");
            setLoading(false);
          }
        };
    
        fetchUserData();
    }, []);

    return (
        <Container fluid className="p-0 bg-white">
            <ToastNotification 
                show={showToast} 
                setShow={setShowToast} 
                message={toastMessage} 
                type={toastType} 
            />

            <ConfirmationModalUniversal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={confirmAction}
                title="Konfirmasi Tindakan"
                message={confirmMessage}
                confirmButtonText="Ya"
                cancelButtonText="Batal"
                type={confirmType}
            />

            <div className="max-width-container mx-auto pt-4 px-3">
                {error && (
                <div className="alert alert-danger mb-3" role="alert">
                    {error}
                </div>
                )}
                
                <Row className="justify-content-center">
                <Col md={6}>
                    <div className="border p-4 rounded shadow-sm bg-light">
                    <h4 className="fw-bold mb-3">Form Tarik Saldo</h4>
                    <Form.Group className="mb-3">
                        <Form.Label>Saldo Tersedia</Form.Label>
                        <Form.Control
                        type="text"
                        value={`Rp ${penitip?.keuntungan?.toLocaleString("id-ID") || 0}`}
                        disabled
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nominal Penarikan</Form.Label>
                        <Form.Control
                        type="number"
                        value={nominalTarik}
                        onChange={(e) => setNominalTarik(e.target.value)}
                        placeholder="Masukkan nominal"
                        />
                    </Form.Group>

                    <Button
                        variant="success"
                        onClick={() => {
                        setConfirmMessage(`Apakah Anda yakin ingin menarik saldo sebesar Rp ${parseFloat(nominalTarik).toLocaleString("id-ID")} ?`);
                        setConfirmAction(() => handleTarikSaldo);
                        setShowConfirmModal(true);
                        }}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : "Tarik Saldo"}
                    </Button>
                    </div>
                </Col>
                </Row>
            </div>
        </Container>
    );
};

export default PenarikanSaldoPage;