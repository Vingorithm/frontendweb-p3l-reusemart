import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { GetAllPenitip } from "../../clients/PenitipService"; // Make sure this API call is correctly implemented
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const styles = {
  container: {
    backgroundColor: '#F8F9FA',
    minHeight: '100vh',
    paddingTop: '2%',
    paddingLeft: '8%',
    paddingRight: '8%',
  },
  card: {
    width: '25rem',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    marginBottom: '30px',
  },
  cardImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  cardBody: {
    padding: '15px',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: '1rem',
    color: '#555',
  },
  buttonPrimary: {
    marginRight: '10px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },
  searchContainerStyle : {
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',
    margin: "2% 0% 2% 0%", 
  },
  searchIconStyle: {
    transform: 'translateY(-10%)',
    transform: 'translateX(200%)',
    color: '#D9D9D9',
  },
  searchInputStyle : {
    padding: '10px 15px 10px 40px',
    borderRadius: '25px',
    border: '1px solid #D9D9D9',
    width: '100%',
    marginRight: '2%',
    backgroundColor: '#F8F9FA',
  },
  buttonStyle: {
    padding: '10px 2px',
    width: '200px',
    backgroundColor: '#028643', 
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
  },
};

const DataPenitip = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [penitipList, setPenitipList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPenitip = async () => {
      try {
        const response = await GetAllPenitip();
        console.log(response.data);
        const penitip = response.data;
        setPenitipList(penitip);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch penitip data");
        setLoading(false);
      }
    };

    fetchPenitip();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Data Penitip</h2>

      <div className="col">
        <div style={styles.searchContainerStyle}>
          <FaSearch style={styles.searchIconStyle} />
            <input
                type="text"
                placeholder='Cari Penitip..'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInputStyle}
            />
          <button style={styles.buttonStyle}>Tambah Penitip</button>
        </div>
      </div>      
      
      <div className="row">
        {penitipList.map((penitip, index) => (
          <div className="col-md-4" key={penitip.id_penitip}>
            <div className="card" style={styles.card}>
              <img
                src={penitip.Akun.profile_picture}
                className="card-img-top"
                alt="Foto Profile"
                style={styles.cardImage}
              />
              <div className="card-body" style={styles.cardBody}>
                <h5 className="card-title" style={styles.cardTitle}>{penitip.Akun.email}</h5>
                <h5 className="card-title" style={styles.cardTitle}>{penitip.nama_penitip}</h5>
                <p className="card-text" style={styles.cardText}>Rating: {penitip.rating} stars</p>
                <p className="card-text" style={styles.cardText}>Total Points: {penitip.total_poin}</p>
                <p className="card-text" style={styles.cardText}>Keuntungan: {penitip.keuntungan}</p>
                <p className="card-text" style={styles.cardText}>Tanggal Registrasi: {formatDate(penitip.tanggal_registrasi)}</p>
                <button className="btn btn-primary" style={styles.buttonPrimary} onClick={() => navigate(`/edit/${penitip.id_penitip}`)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(penitip.id_penitip)}>Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.pagination}>
        <ul className="pagination">
          <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li>
          <li className="page-item"><a className="page-link" href="#">4</a></li>
          <li className="page-item"><a className="page-link" href="#">5</a></li>
        </ul>
      </div>
    </div>
  );
};

const handleDelete = (id) => {
  console.log("Deleting penitip with id:", id);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  const formattedDate = date.toLocaleDateString('id-ID'); 
  const formattedTime = date.toLocaleTimeString('id-ID', { hour12: false });  

  return `${formattedDate} | ${formattedTime}`;
};


export default DataPenitip;
