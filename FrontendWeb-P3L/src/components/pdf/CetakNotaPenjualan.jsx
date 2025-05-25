import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateNotaPDF = (pembelian) => {
  const doc = new jsPDF();

  // Judul
  doc.setFontSize(12);
  doc.text("ReUse Mart", 15, 10);
  doc.setFontSize(10);
  doc.text("Jl. Green Eco Park No. 456 Yogyakarta", 15, 15);

  // Info Transaksi
  const detail = [
    ["No Nota", ": 25.02.101"],
    ["Tanggal pesan", ": 15/2/2025 18:50"],
    ["Lunas pada", ": 15/2/2024 19:01"],
    ["Tanggal kirim", ": 16/2/2024"],
  ];
  detail.forEach((item, index) => {
    doc.text(`${item[0]} ${item[1]}`, 15, 25 + index * 5);
  });

  // Info Pembeli
  doc.text("Pembeli : cath123@gmail.com / Catherine", 15, 50);
  doc.text("Perumahan Griya Persada XII/20", 15, 55);
  doc.text("Caturtunggal, Depok, Sleman", 15, 60);
  doc.text("Delivery: Kurir ReUseMart (Cahyono)", 15, 65);

  // Daftar Barang
  autoTable(doc, {
    startY: 70,
    theme: "plain",
    head: [["Barang", "Harga"]],
    body: [
      ["Kompor tanam 3 tungku", "2.000.000"],
      ["Hair Dryer Ion", "500.000"],
    ],
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fontStyle: "bold",
    },
  });

  let y = doc.lastAutoTable.finalY + 5;

  // Total & potongan
  const ringkasan = [
    ["Total", "2.500.000"],
    ["Ongkos Kirim", "0"],
    ["Total", "2.500.000"],
    ["Potongan 200 poin", "-20.000"],
    ["Total", "2.480.000"],
  ];
  ringkasan.forEach((item, index) => {
    doc.text(item[0], 120, y + index * 5);
    doc.text(item[1], 170, y + index * 5, { align: "right" });
  });

  y += ringkasan.length * 5 + 5;

  // Poin
  doc.text("Poin dari pesanan ini: 297", 15, y);
  doc.text("Total poin customer: 300", 15, y + 5);

  // QC
  doc.text("QC oleh: Farida (P18)", 15, y + 15);
  doc.text("Diterima oleh:", 15, y + 25);
  doc.text("(.................................)", 15, y + 35);
  doc.text("Tanggal: ............................", 15, y + 40);

  // Simpan PDF
  doc.save("nota-penjualan.pdf");
};
