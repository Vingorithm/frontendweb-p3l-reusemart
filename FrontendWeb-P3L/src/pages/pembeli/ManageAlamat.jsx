import React, { useState, useEffect } from 'react';
import { decodeToken } from "../../utils/jwtUtils";
import { apiAlamatPembeli } from '../../api/apiAlamatPembeli';
import { apiPembeli } from '../../api/apiPembeli';
import DeleteAlamatModal from '../../components/modal/DeleteAlamatModal';
import AddAlamatModal from '../../components/modal/AddAlamatModal';

const ManageAlamat = () => {
    const [dataAkun, setDataAkun] = useState(null);
    const [dataPembeli, setDataPembeli] = useState(null);
    const [dataAlamat, setDataAlamat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAlamat, setSelectedAlamat] = useState(null);

    const deleteAlamat = async (id_alamat) => {
      const response = await apiAlamatPembeli.deleteAlamatPembeli(id_alamat);
      const alamat = await apiAlamatPembeli.getAlamatPembeliByIdPembeli(dataPembeli.id_pembeli);
      setDataAlamat(alamat);
      return response;
    }

    const handleShowModal = (alamat) => {
        setSelectedAlamat(alamat);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Decode token
                const token = localStorage.getItem("authToken");
                if (!token) throw new Error("Token tidak ditemukan");
                
                const decoded = decodeToken(token);
                setDataAkun(decoded);
                if (!decoded?.id) throw new Error("Invalid token structure");

                // 2. Get pembeli data
                const pembeli = await apiPembeli.getPembeliByIdAkun(decoded.id);
                setDataPembeli(pembeli);
                
                if (!pembeli?.id_pembeli) throw new Error("Data pembeli tidak valid");

                // 3. Get alamat data
                const alamat = await apiAlamatPembeli.getAlamatPembeliByIdPembeli(pembeli.id_pembeli);
                // Pastikan response adalah array, jika tidak convert ke array
                setDataAlamat(Array.isArray(alamat) ? alamat : [alamat]);
                
            } catch (err) {
                setError(err.message);
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="w-75 mx-auto mb-4 mt-8 px-4">
            <h1 className="fs-2 fw-bold mb-6">Halaman Kelola Alamat</h1>

            {/* Search and Filter */}
            <div className="flex justify-between items-center mb-6">
                <form action="">
                    <input
                        type="text"
                        placeholder="Cari alamat..."
                        className="w-full max-w-md px-4 py-2 border rounded-full shadow-sm"
                    />
                </form>
                <button className="ml-4 text-gray-600 text-sm flex items-center">
                    Urutkan berdasarkan waktu
                    <span className="ml-1">&#9432;</span>
                </button>
            </div>

            {/* Tambah Alamat */}
            <div className="flex justify-end mb-6">
                <button className="bg-green-600 text-white px-6 py-2 rounded shadow" type="button" data-bs-toggle="modal" data-bs-target="#add-alamat-modal">
                    Tambah Alamat
                </button>
            </div>

            {/* Alamat Cards */}
            <div className="space-y-4 mb-4">
                {dataAlamat.length == 0 ? (<div className='mx-auto my-5 text-center fw-bold'>Belum memiliki alamat</div>) : dataAlamat.map((alamat, index) => (
                    <div key={alamat.id || index} className="bg-white p-4 rounded shadow flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-lg">{alamat.nama_alamat}</h2>
                            <p className="text-gray-600 text-sm">{alamat.alamat_lengkap}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                Edit
                            </button>
                            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" data-bs-toggle="modal" data-bs-target="#delete-alamat-modal" onClick={() => handleShowModal(alamat)}>
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-2 text-sm">
                <button className="text-gray-500">&lt;</button>
                <button className="text-orange-500 font-semibold">1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
                <button>5</button>
                <button className="text-gray-500">&gt;</button>
            </div>
            
            <AddAlamatModal />
            <DeleteAlamatModal alamat={selectedAlamat} onDelete={deleteAlamat}/>
        </main>
    );
};

export default ManageAlamat;