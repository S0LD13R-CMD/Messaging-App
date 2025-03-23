import React, { useState, useRef, useEffect } from 'react';
import { chatStyles } from '../../styles/chatStyles';
import Button from './Button';

interface SearchPopupProps {
  onClose: () => void;
  onSearch: (username: string) => void;
  isOpen: boolean;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ onClose, onSearch, isOpen }) => {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus the input when popup is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      onSearch(searchText.trim());
      setSearchText('');
    }
  };
  
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
            border: '4px solid white',
            width: '100%',
            height: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'black',
            }}>
          <div className="p-8">
            <h2 className="text-white text-2xl text-center">Find a User</h2>
          </div>
          
          <div className="p-4">
            <form onSubmit={handleSubmit} style={{...chatStyles.inputContainer, padding: '16px'}}>
              <input
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Enter username..."
                className="animated-input"
                style={{...chatStyles.input, width: '100%'}}
              />
            </form>
          </div>
          
          <div className="p-4 flex justify-center space-x-4">
            <Button 
              type="submit"
              onClick={handleSubmit}
              animation="slide"
              width="45%"
              height="45px"
            >
              Search
            </Button>
            
            <Button 
              onClick={onClose}
              animation="slide"
              width="45%"
              height="45px"
              bgColor="rgb(62, 0, 100)"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup; 