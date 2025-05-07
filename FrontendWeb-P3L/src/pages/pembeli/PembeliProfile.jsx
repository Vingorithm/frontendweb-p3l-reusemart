import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

const PembeliProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        // Ganti ID ini dengan dinamis sesuai login user atau dari localStorage
        const idPembeli = localStorage.getItem(token.id); 
        const response = await axios.get(`/api/pembeli/${idPembeli}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Gagal mengambil data profil pembeli:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Memuat profil...</p>;

  const { nama, total_poin, tanggal_registrasi, akun } = profile;

  const formatTanggal = (tanggal) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) + `, pukul ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Halaman Profil</h4>
      <Card className="d-flex flex-row align-items-center p-3 shadow-sm">
        <img
          src={akun?.profile_picture || "/default-profile.jpg"}
          alt="Profile"
          className="rounded-circle"
          width="100"
          height="100"
        />
        <div className="ms-4 flex-grow-1">
          <h5 className="mb-1">{nama}</h5>
          <p className="mb-1 text-warning">{akun?.email}</p>
          <p className="mb-1">Total_poin: {total_poin} Poin</p>
          <small className="text-muted">
            Terdaftar sejak {formatTanggal(tanggal_registrasi)}
          </small>
        </div>
        <Button variant="warning" className="ms-auto px-4 py-2 text-white">
          Edit Profil
        </Button>
      </Card>
    </div>
  );
};

export default PembeliProfile;