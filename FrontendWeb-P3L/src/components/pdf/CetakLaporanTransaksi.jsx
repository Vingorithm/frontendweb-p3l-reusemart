// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { toast } from "sonner";
// import { GetTransaksiByIdPenitip } from "../../clients/TransaksiService";

// export const CetakLaporanTransaksi = async (bulan, tahun, id_penitip) => {
//     try {
//         const transaksi = await GetTransaksiByIdPenitip(id_penitip);

//         if (!transaksi || transaksi.length === 0) {
//             toast.warning("Tidak ada data transaksi ditemukan.");
//             return;
//         }

//         // Fungsi bantu konversi tanggal dan nama bulan
//         const formatDate = (tgl) =>
//             new Date(tgl).toLocaleDateString("id-ID", {
//                 day: "numeric",
//                 month: "numeric",
//                 year: "numeric",
//             });

//         const getNamaBulan = (n) =>
//             new Date(2000, n - 1).toLocaleString("id-ID", { month: "long" });

//         // Filter berdasarkan bulan & tahun
//         const filtered = transaksi.filter((trx) => {
//             const tgl = new Date(trx.SubPembelian?.Pembelian?.tanggal_pelunasan);
//             const matchBulan = bulan ? tgl.getMonth() + 1 === parseInt(bulan) : true;
//             const matchTahun = tahun ? tgl.getFullYear() === parseInt(tahun) : true;
//             return matchBulan && matchTahun;
//         });

//         if (filtered.length === 0) {
//             toast.info("Tidak ada transaksi sesuai filter.");
//             return;
//         }

//         const doc = new jsPDF();
//         const first = filtered[0];

//         // Informasi umum penitip
//         const namaPenitip = first?.SubPembelian?.Barang?.id_penitip === id_penitip
//             ? "Valentino" // ganti sesuai nama jika tersedia dari API
//             : id_penitip;

//         doc.setFont("helvetica", "normal");
//         doc.text("ReUse Mart", 10, 10);
//         doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 10, 16);

//         doc.setFont("helvetica", "bold");
//         doc.text("LAPORAN TRANSAKSI PENITIP", 10, 26);

//         doc.setFont("helvetica", "normal");
//         doc.text(`ID Penitip : ${id_penitip}`, 10, 32);
//         doc.text(`Nama Penitip : ${namaPenitip}`, 10, 38);
//         if (bulan && tahun) {
//             doc.text(`Bulan : ${getNamaBulan(bulan)}`, 10, 44);
//             doc.text(`Tahun : ${tahun}`, 10, 50);
//         } else {
//             doc.text("Bulan : -", 10, 44);
//             doc.text("Tahun : -", 10, 50);
//         }
//         doc.text(`Tanggal cetak: ${formatDate(new Date())}`, 10, 56);

//         // Buat tabel transaksi
//         const tableBody = filtered.map((trx) => {
//             const barang = trx.SubPembelian?.Barang;
//             const pembelian = trx.SubPembelian?.Pembelian;
//             const hargaBersih =
//                 parseFloat(barang?.harga || 0) -
//                 parseFloat(trx.komisi_reusemart || 0) -
//                 parseFloat(trx.komisi_hunter || 0);
//             const bonus = parseFloat(trx.bonus_cepat || 0);
//             const pendapatan = parseFloat(trx.pendapatan || 0);

//             return [
//                 barang?.id_barang || "-",
//                 barang?.nama || "-",
//                 formatDate(barang?.tanggal_garansi || pembelian?.tanggal_pembelian),
//                 formatDate(pembelian?.tanggal_pelunasan),
//                 hargaBersih.toLocaleString("id-ID"),
//                 bonus.toLocaleString("id-ID"),
//                 pendapatan.toLocaleString("id-ID"),
//             ];
//         });

//         // Hitung total
//         const totalHargaBersih = tableBody.reduce(
//             (sum, row) => sum + parseInt(row[4].replace(/\./g, "")), 0
//         );
//         const totalBonus = tableBody.reduce(
//             (sum, row) => sum + parseInt(row[5].replace(/\./g, "")), 0
//         );
//         const totalPendapatan = tableBody.reduce(
//             (sum, row) => sum + parseInt(row[6].replace(/\./g, "")), 0
//         );

//         tableBody.push([
//             { content: "TOTAL", colSpan: 4, styles: { halign: "center", fontStyle: "bold" } },
//             totalHargaBersih.toLocaleString("id-ID"),
//             totalBonus.toLocaleString("id-ID"),
//             totalPendapatan.toLocaleString("id-ID"),
//         ]);

//         autoTable(doc, {
//             startY: 64,
//             head: [[
//                 "Kode Produk",
//                 "Nama Produk",
//                 "Tanggal Masuk",
//                 "Tanggal Laku",
//                 "Harga Jual Bersih (sudah dipotong Komisi)",
//                 "Bonus terjual cepat",
//                 "Pendapatan"
//             ]],
//             body: tableBody,
//         });

//         doc.save(`Laporan_Transaksi_Penitip_${id_penitip}.pdf`);
//     } catch (error) {
//         toast.error("Gagal membuat laporan PDF.");
//         console.error("Gagal membuat PDF:", error);
//     }
// };
