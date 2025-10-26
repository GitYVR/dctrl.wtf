import { useEffect } from 'react';

const Redirect = ({ to, url }) => {
  useEffect(() => {
    // Redirect to the external URL
    window.location.href = url;
  }, [url]);

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
      <p>Redirecting to {to}...</p>
    </div>
  );
};

export default Redirect;