import React from 'react';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const KomisiPDFGenerator = ({ filteredData, summaryData, penitipanData, formatCurrency, formatNumber, formatDate }) => {
  const generate = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(2, 134, 67);
    doc.text('LAPORAN KOMISI BULANAN REUSEMART', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(3, 8, 31);
    doc.text(`Per-Tanggal: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 30, { align: 'center' });
    
    // Summary Box
    doc.setDrawColor(217, 217, 217);
    doc.setFillColor(249, 249, 249);
    doc.roundedRect(15, 40, pageWidth - 30, 60, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(3, 8, 31);
    
    doc.text('RINGKASAN KOMISI', 20, 50);
    doc.text(`Total Transaksi: ${formatNumber(summaryData.totalTransaksi)}`, 20, 60);
    doc.text(`Total Komisi Hunter: ${formatCurrency(summaryData.totalKomisiHunter)}`, 20, 70);
    doc.text(`Total Komisi ReUse Mart: ${formatCurrency(summaryData.totalKomisiReusemart)}`, 20, 80);
    doc.text(`Total Bonus Penitip: ${formatCurrency(summaryData.totalBonusCepat)}`, 20, 90);
    
    doc.setTextColor(2, 134, 67);
    doc.setFontSize(14);
    
    // Transaksi Details Table
    if (Array.isArray(filteredData) && filteredData.length > 0) {
      doc.text('DETAIL KOMISI PER PRODUK', 20, 110);
      
      const tableData = filteredData.map(item => [
        item.SubPembelian?.id_barang || '-',
        item.SubPembelian?.Barang?.nama || '-',
        formatCurrency(item.SubPembelian?.Pembelian?.total_harga || 0),
        formatDate(penitipanData[item.SubPembelian?.id_barang]),
        formatDate(item.SubPembelian?.Pembelian?.tanggal_pelunasan),
        formatCurrency(item.komisi_hunter || 0),
        formatCurrency(item.komisi_reusemart || 0),
        formatCurrency(item.bonus_cepat || 0)
      ]);
      
      autoTable(doc, {
        startY: 115,
        head: [
          ['Kode Produk', 'Nama Produk', 'Harga Jual', 'Tanggal Masuk', 'Tanggal Laku', 'Komisi Hunter', 'Komisi ReUse Mart', 'Bonus Penitip']
        ],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [2, 134, 67],
          textColor: [255, 255, 255],
          fontSize: 10
        },
        margin: { left: 10, right: 10 },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 }
        }
      });
    }
    
    // Footer
    const footerY = doc.internal.pageSize.height - 20;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Laporan dibuat pada: ${new Date().toLocaleDateString('id-ID')}`, 20, footerY);
    doc.text('ReuseMart - Sistem Manajemen Komisi', pageWidth - 20, footerY, { align: 'right' });
    
    doc.save(`Laporan-Komisi-Bulanan-${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.pdf`);
  };

  return (
    <Button 
      onClick={generate}
      className="view-btn"
    >
      Export PDF
    </Button>
  );
};

export default KomisiPDFGenerator;