import React from 'react';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Explicitly import autoTable

const CetakLaporanBulanan = ({ reportData, selectedMonth, selectedYear, months, formatCurrency, formatNumber, setShowModal }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(2, 134, 67);
    doc.text('LAPORAN PENJUALAN BULANAN REUSEMART', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(3, 8, 31);
    doc.text(`${months[selectedMonth - 1]} ${selectedYear}`, pageWidth / 2, 30, { align: 'center' });
    
    // Summary Box
    doc.setDrawColor(217, 217, 217);
    doc.setFillColor(249, 249, 249);
    doc.roundedRect(15, 40, pageWidth - 30, 60, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(3, 8, 31);
    
    doc.text('RINGKASAN KEUANGAN', 20, 50);
    doc.text(`Total Pendapatan: ${formatCurrency(reportData.totalPendapatan)}`, 20, 60);
    doc.text(`Komisi Reusemart: ${formatCurrency(reportData.totalKomisiReusemart)}`, 20, 70);
    doc.text(`Komisi Hunter: ${formatCurrency(reportData.totalKomisiHunter)}`, 20, 80);
    doc.text(`Bonus Cepat: ${formatCurrency(reportData.totalBonusCepat)}`, 20, 90);
    
    doc.setTextColor(2, 134, 67);
    doc.setFontSize(12);
    doc.text(`Keuntungan Bersih: ${formatCurrency(reportData.keuntunganBersih)}`, pageWidth / 2 + 10, 60);
    
    doc.setTextColor(3, 8, 31);
    doc.setFontSize(12);
    doc.text(`Total Transaksi: ${formatNumber(reportData.totalTransaksi)}`, pageWidth / 2 + 10, 75);
    doc.text(`Rata-rata per Transaksi: ${formatCurrency(reportData.rataRataPendapatan)}`, pageWidth / 2 + 10, 85);
    
    // Daily performance table
    if (Array.isArray(reportData.dailyData) && reportData.dailyData.length > 0) {
      doc.text('PERFORMA HARIAN', 20, 120);
      
      const tableData = reportData.dailyData.map(day => [
        day.hari.toString(),
        formatCurrency(day.pendapatan),
        formatCurrency(day.keuntungan),
        day.transaksi.toString()
      ]);
      
      autoTable(doc, {
        startY: 125,
        head: [['Tanggal', 'Pendapatan', 'Keuntungan', 'Transaksi']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [2, 134, 67],
          textColor: [255, 255, 255]
        },
        margin: { left: 20, right: 20 }
      });
    }
    
    // Weekly summary
    if (Array.isArray(reportData.weeklyData) && reportData.weeklyData.length > 0) {
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 180;
      
      doc.text('RINGKASAN MINGGUAN', 20, finalY);
      
      const weeklyTableData = reportData.weeklyData.map(week => [
        week.minggu,
        formatCurrency(week.pendapatan),
        formatCurrency(week.keuntungan),
        week.transaksi.toString()
      ]);
      
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Periode', 'Pendapatan', 'Keuntungan', 'Transaksi']],
        body: weeklyTableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [252, 138, 6],
          textColor: [255, 255, 255]
        },
        margin: { left: 20, right: 20 }
      });
    }
    
    // Footer
    const footerY = doc.internal.pageSize.height - 20;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Laporan dibuat pada: ${new Date().toLocaleDateString('id-ID')}`, 20, footerY);
    doc.text('ReuseMart - Sistem Laporan Penjualan', pageWidth - 20, footerY, { align: 'right' });
    
    doc.save(`Laporan-Penjualan-${months[selectedMonth - 1]}-${selectedYear}.pdf`);
    setShowModal(false);
  };

  return (
    <Button 
      onClick={generatePDF}
      className="view-btn"
    >
      📥 Download PDF
    </Button>
  );
};

export default CetakLaporanBulanan;