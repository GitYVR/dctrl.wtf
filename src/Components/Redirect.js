import { useEffect } from 'react';

const Redirect = ({ to }) => {
  useEffect(() => {
    // Redirect to the external URL
    window.location.href = to;
  }, [to]);

  // Show a loading message while redirecting
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'monospace',
      color: '#fff',
      backgroundColor: '#000'
    }}>
      <p>Redirecting to Giveth</p>
    </div>
  );
};

export default Redirect;