export const chatStyles = {
  containerStyle1: {
    border: '2px solid rgb(255, 255, 255)',
    borderRadius: '24px',
    height: 'calc(100vh - 200px)',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgb(30, 30, 30)'
  },

  containerStyle2: {
    border: '2px solid rgb(255, 255, 255)',
    borderRadius: '24px',
    height: 'calc(100vh - 85px)',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    paddingTop: '10px',
  },
  
  inputContainer: {
    display: 'flex',
    padding: '16px',
    backgroundColor: 'transparent',
  },
  
  input: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '2px solid rgb(255, 255, 255)',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
  },
  
  sendButton: {
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'black',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginLeft: '8px',
  },

  button: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    color: 'white',
    border: '2px solid rgb(255, 255, 255)',
    padding: '10px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    marginLeft: '8px',
  },

  modularButtonStyle: {
    backgroundColor: 'black',
    color: 'white',
    border: '2px solid white',
    borderRadius: '12px',
    margin: '8px',
    padding: '10px 4px',
    width: '90%',
    textAlign: 'center' as const,
  },
  
  messageContainer: {
    padding: '8px',
    margin: '8px 0',
    maxWidth: '55%',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    border: '2px solid rgb(255, 255, 255)',
    position: 'relative' as const,
    paddingTop: '26px',
    minWidth: '120px',
  },
  
  sentMessage: {
    marginLeft: 'auto',
    borderColor: 'rgb(100, 100, 100)',
  },
  
  receivedMessage: {
    marginRight: 'auto',
    borderColor: 'rgb(255, 255, 255)',
  },
  
  messagesArea: {
    height: 'calc(100% - 80px)',
    overflowY: 'auto' as const,
    padding: '16px',
  },
  
  messageTime: {
    fontSize: '0.75rem',
    opacity: 0.7,
    position: 'absolute' as const,
    top: '6px',
    right: '12px',
  },
  
  messageSender: {
    fontWeight: 'bold',
    position: 'absolute' as const,
    top: '6px',
    left: '12px',
  },
  
  messageContent: {
    marginTop: '8px',
  }
};

// Page layout styles shared between Global and Private chat pages
export const pageStyles = {
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  },
  
  header: {
    backgroundColor: 'white',
    padding: '16px 0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
  },
  
  pageTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
  },
  
  contentArea: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '24px 16px',
  }
};

// User list styles for private chat
export const userListStyles = {
  sidebar: {
    width: '16rem',
    backgroundColor: 'white',
    boxShadow: '1px 0 3px rgba(0, 0, 0, 0.1)',
    height: '100vh',
  },
  
  sidebarHeader: {
    padding: '16px',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    borderBottom: '1px solid #E5E7EB',
  },
  
  userList: {
    overflowY: 'auto' as const,
    height: 'calc(100vh - 64px)',
  },
  
  userItem: {
    padding: '16px',
    borderBottom: '1px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  userItemSelected: {
    backgroundColor: '#EBF5FF',
  },
  
  userItemHover: {
    backgroundColor: '#F3F4F6',
  },
  
  userName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#111827',
    marginLeft: '12px',
  },

  sidebarStyle: {
    backgroundColor: 'black',
    color: 'white',
    paddingTop: '10px',
    paddingLeft: '10px',
    paddingRight: '10px',
  }
}; 