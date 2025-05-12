import { useEffect, useState } from "react";

const DetailTransaksiPenitipModal = ({data}) => {
    const [dataTransaksi, setDataTransaksi] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
    };

    const formatMoney = (nominal) => {
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(parseFloat(nominal));
      return formatted;
    }

    useEffect(() => {
        if(data) setDataTransaksi(data);
    }, [data]);

    return <>
        <div class="modal fade" id="detail-transaksi-penitip-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Detail Transaksi</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div className="card border p-4 d-flex flex-column align-items-start justify-content-center mb-4">
                        {dataTransaksi?.barang.map((b, i) => (
                            <div className='w-100 d-flex flex-column flex-md-row gap-3 justify-content-center justify-content-md-start align-items-center'>
                            <img src={`http://localhost:3000/uploads/barang/${b.gambar.split(',')[0]}`} alt="gambar-produk" className='rounded-circle align-self-center align-self-md-start' style={{
                            minWidth: '50px',
                            maxWidth: '150px',
                            aspectRatio: '1/1',
                            }}/>
                            <div>
                            <p className='text-secondary'>{formatDate(dataTransaksi.pembelian.tanggal_pembelian)}, {formatTime(dataTransaksi.pembelian.tanggal_pembelian)} WIB</p>

                            <p className='fw-bold fs-5'>{b.nama}</p>

                            <p className="fw-bold">Detail barang:</p>
                            <ul>
                                <li>Kategori: {b.kategori_barang}</li>
                                <li>Deskripsi: {b.deskripsi}</li>
                                <li>Harga: Rp. {formatMoney(b.harga)}</li>
                                <li>Berat: {b.berat} kg</li>
                            </ul>

                            <p className="fw-bold">Status:</p>
                            <ul>
                                <li>Status Pembayaran: {dataTransaksi.pembelian.status_pembelian}</li>
                                <li>Status Pengiriman: {dataTransaksi.pengiriman.status_pengiriman}</li>
                                <li>Jenis Pengiriman: {dataTransaksi.pengiriman.jenis_pengiriman}</li>
                            </ul>

                            <p className="fw-bold">Detail transaksi:</p>
                            {
                                b.transaksi == null ? 
                                <ul>
                                    <li>Transaksi dibatalkan</li>
                                </ul> 
                                : 
                                <>
                                    <ul>
                                        <li>Pendapatan: Rp. {formatMoney(b.transaksi.pendapatan)}</li>
                                        <li>Komisi toko: Rp. {formatMoney(b.transaksi.komisi_reusemart)}</li>
                                        <li>Komisi hunter: Rp. {formatMoney(b.transaksi.komisi_hunter)}</li>
                                        <li>Bonus cepat: Rp. {formatMoney(b.transaksi.bonus_cepat)}</li>
                                    </ul>
                                </>
                            }
                            </div>
                        </div>
                        ) )}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    </>
}

export default DetailTransaksiPenitipModal;