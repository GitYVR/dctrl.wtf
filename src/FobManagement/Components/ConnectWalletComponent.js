import { ethers } from 'ethers';
import { Button } from '@mui/material';

// Connect wallet button
function ConnectWallet({ onConnect, setWalletAddress }) {
    async function connect() {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        onConnect(true);
      } else {
        alert('Please install MetaMask!');
      }
    }
  
    return (
      <div>
        <Button variant="contained" onClick={connect}>
          Connect Wallet
        </Button>
      </div>
    );
}

export default ConnectWallet;