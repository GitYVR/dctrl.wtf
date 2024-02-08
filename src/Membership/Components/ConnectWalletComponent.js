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
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } else {
      setMsg('Please install MetaMask!');
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={connect}>
        Connect Wallet
      </Button>
      <br />
      {loading && <CircularProgress />}
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default ConnectWallet;