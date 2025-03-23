import React from 'react';
import { chatStyles } from '../../styles/chatStyles';
import Button from './Button';

interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(3px)',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ width: '500px', maxWidth: '90%' }}
      >
        <div style={{
            ...chatStyles.containerStyle2, 
            borderRadius: '24px',
            border: '4px solid rgb(220, 38, 38)',
            width: '100%',
            height: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'black',
            padding: '20px',
            maxHeight: '300px'
            }}>
          <div className="p-4 text-center">
            <h3 className="text-white text-2xl mb-2">Error</h3>
            <div className="border-t border-gray-700 w-1/3 mx-auto my-4"></div>
            <p className="text-red-400 text-lg mb-6">{message}</p>
          </div>
          
          <div className="p-4 flex justify-center">
            <Button 
              onClick={onClose}
              animation="grow"
              width="60%"
              height="45px"
              bgColor="rgb(150, 0, 0)"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup; 