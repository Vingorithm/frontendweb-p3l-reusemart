// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { toast } from "sonner";
// import { GetAllRequestDonasi } from "../../clients/RequestDonasiService";

// export const CetakLaporanRequest = async () => {
//     try {
//         const request = await GetAllRequestDonasi();

//         if (request && Array.isArray(request)) {
//             const filtered = request.filter(
//                 (r) =>
//                     r.status_request === "Diterima" &&
//                     (!r.DonasiBarang)
//             );

//             const doc = new jsPDF();

//             const toIndoDate = (dateInput) => {
//                 const date = new Date(dateInput);
//                 return date.toLocaleDateString("id-ID", {
//                     timeZone: "Asia/Jakarta",
//                     day: "numeric",
//                     month: "numeric",
//                     year: "numeric",
//                 });
//             };

//             doc.setFont("helvetica", "normal");
//             doc.text("ReUse Mart", 10, 10);
//             doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 10, 16);

//             doc.setFont("helvetica", "bold");
//             doc.text("LAPORAN Request Donasi Belum Terpenuhi", 10, 26);

//             doc.setFont("helvetica", "normal");
//             doc.text(`Tanggal cetak: ${toIndoDate(new Date())}`, 10, 32);

//             const tableData = filtered.map((item) => [
//                 item?.OrganisasiAmal?.id_organisasi,
//                 item?.OrganisasiAmal?.nama_organisasi || "-",
//                 item?.OrganisasiAmal?.alamat,
//                 item?.deskripsi_request,
//             ]);

//             autoTable(doc, {
//                 startY: 40,
//                 head: [["ID Organisasi", "Nama", "Alamat", "Request"]],
//                 body: tableData,
//             });

//             doc.save("LaporanRequestBelumTerpenuhi.pdf");
//         } else {
//             toast.warning("Tidak ada data request yang ditemukan.");
//         }
//     } catch (error) {
//         toast.error("Gagal membuat laporan PDF.");
//         console.error("Gagal membuat PDF:", error);
//     }
// };
