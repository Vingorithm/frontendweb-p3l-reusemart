import React from 'react';

const CardProduk = ({ 
  image, 
  title, 
  price, 
  onClick 
}) => {
  const cardStyle = {
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  };

  const imageContainerStyle = {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    position: 'relative',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const contentStyle = {
    padding: '12px',
  };

  const titleStyle = {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#03081F',
  };

  const priceStyle = {
    margin: '0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FC8A06',
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price).replace('IDR', 'Rp');
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div 
      style={cardStyle} 
      onClick={handleClick} 
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div style={imageContainerStyle}>
        <img src={image} alt={title} style={imageStyle} />
      </div>
      <div style={contentStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <p style={priceStyle}>{formatPrice(price)}</p>
      </div>
    </div>
  );
};

export default CardProduk;