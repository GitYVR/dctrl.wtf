import { ethers } from 'ethers';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

// Connect wallet button
function ConnectWallet({ setWalletAddress }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    return () => {
      setLoading(false);
      setMsg(null);
    }
  }, []);

  async function connect() {
    setMsg(null);
    setLoading(true);
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        setMsg(error.message);
        setLoading(false);
      }
    } else {
      setMsg('Please install MetaMask!');
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
  }}>
      <Button style={{ borderRadius: '50px', backgroundColor: '#FFCC00', color: 'black', padding: '10px 20px', fontSize: '2vw'}} variant="contained" onClick={connect}>
        Connect Wallet
      </Button>
      <br />
      {loading && <CircularProgress />}
      {msg && <p style={{
                    fontSize: '2vw',
                    fontWeight: 'bold',
                    color: 'red'
                }}>{msg}</p>}
    </div>
  );
}

export default ConnectWallet;