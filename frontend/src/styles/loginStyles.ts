// Login page styles
export const loginStyles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: 0,
    overflow: 'auto',
    fontFamily: "'Geo', sans-serif",
  },
  formContainer: {
    maxWidth: '400px',
    width: '100%',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '3.75rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
    alignSelf: 'center',
    fontFamily: "'Geo', sans-serif",
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'white',
    marginBottom: '2rem',
    alignSelf: 'center',
  },
  form: {
    width: '100%',
    textAlign: 'left' as const,
  },
  formGroup: {
    marginBottom: '40px',
    width: '100%',
    textAlign: 'left' as const,
  },
  label: {
    display: 'block',
    color: 'white',
    marginBottom: '8px',
    textAlign: 'left' as const,
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
  link: {
    color: 'rgb(255, 255, 255)',
    textDecoration: 'none',
    marginTop: '16px',
    display: 'block',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    width: '100%',
  },
  button: {
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'black',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '16px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}; 