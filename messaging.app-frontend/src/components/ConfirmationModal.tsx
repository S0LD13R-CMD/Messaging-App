import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#1e1e1e',
  color: '#FFFFFF',
  padding: '25px',
  borderRadius: '12px',
  border: '2px solid #FF6666',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  maxWidth: '400px',
  width: '90%',
  textAlign: 'center',
  fontFamily: 'inherit',
};

const modalTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: '15px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#BB86FC',
};

const modalMessageStyle: React.CSSProperties = {
  marginBottom: '25px',
  fontSize: '1rem',
  lineHeight: '1.5',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#BB86FC',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: '#666666',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  minWidth: '100px',
};

const confirmButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  borderColor: '#FF6666',
  color: '#FF6666',
};

const cancelButtonStyle: React.CSSProperties = {
  ...buttonStyle,
};


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {

  const [confirmHover, setConfirmHover] = React.useState(false);
  const [cancelHover, setCancelHover] = React.useState(false);

  if (!isOpen) return null;

  const confirmButtonHoverStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 102, 102, 0.1)',
    borderColor: '#FF8888',
    color: '#FFFFFF',
  };

  const cancelButtonHoverStyle: React.CSSProperties = {
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    borderColor: '#FFFFFF',
    color: '#FFFFFF',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>{title}</h2>
        <p style={modalMessageStyle}>{message}</p>
        <div style={buttonContainerStyle}>
          <button
            style={{
              ...cancelButtonStyle,
              ...(cancelHover ? cancelButtonHoverStyle : {})
            }}
            onClick={onClose}
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
          >
            Cancel
          </button>
          <button
            style={{
              ...confirmButtonStyle,
              ...(confirmHover ? confirmButtonHoverStyle : {})
            }}
            onClick={onConfirm}
            onMouseEnter={() => setConfirmHover(true)}
            onMouseLeave={() => setConfirmHover(false)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 