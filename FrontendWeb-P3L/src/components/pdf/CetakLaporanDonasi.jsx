// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { toast } from "sonner";
// import { GetAllDonasiBarang } from "../../clients/DonasiBarangService";

// export const CetakLaporanDonasi = async (tahun) => {

//     const formatDate = (dateInput) => {
//         const date = new Date(dateInput);
//         return date.toLocaleDateString("id-ID", {
//             timeZone: "Asia/Jakarta",
//             day: "numeric",
//             month: "numeric",
//             year: "numeric",
//         });
//     };

//     try {
//         const donasi = await GetAllDonasiBarang();

//         if (donasi) {
//             // Filter berdasarkan tahun jika disediakan
//             const donasiFiltered = tahun
//                 ? donasi.filter((item) => {
//                     const indoYear = new Date(item.tanggal_donasi).toLocaleDateString(
//                         "id-ID",
//                         {
//                             timeZone: "Asia/Jakarta",
//                             year: "numeric",
//                         }
//                     );
//                     return parseInt(indoYear) === parseInt(tahun);
//                 })
//                 : donasi;

//             const doc = new jsPDF();
//             doc.setFont("helvetica", "bold");
//             doc.text("ReUse Mart", 10, 10);
//             doc.setFont("helvetica", "normal");
//             doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 10, 16);

//             doc.setFont("helvetica", "bold");
//             doc.text("LAPORAN Donasi Barang", 10, 26);

//             doc.setFont("helvetica", "normal");
//             doc.text(`Tahun : ${tahun || "Semua"}`, 10, 32);
//             doc.text(`Tanggal cetak: ${formatDate(new Date())}`, 10, 38);

//             const tableData = donasiFiltered.map((item) => {
//                 const barang = item.Barang;
//                 const penitip = barang?.Penitip;

//                 return [
//                     barang?.id_barang || "-",
//                     barang?.nama || "-",
//                     penitip?.id_penitip || "-",
//                     penitip?.nama_penitip || "-",
//                     formatDate(item.tanggal_donasi),
//                     item?.RequestDonasi?.nama_organisasi || "-",
//                     item?.RequestDonasi?.nama_penerima || "-",
//                 ];
//             });

//             autoTable(doc, {
//                 startY: 45,
//                 head: [
//                     [
//                         "Kode Produk",
//                         "Nama Produk",
//                         "Id Penitip",
//                         "Nama Penitip",
//                         "Tanggal Donasi",
//                         "Organisasi",
//                         "Nama Penerima",
//                     ],
//                 ],
//                 body: tableData,
//             });

//             doc.save(`LaporanDonasiBarang_${tahun || "Semua"}.pdf`);
//         }
//     } catch (error) {
//         toast.error("Gagal membuat pdf!");
//         console.error("Gagal membuat pdf: ", error);
//     }
// };
