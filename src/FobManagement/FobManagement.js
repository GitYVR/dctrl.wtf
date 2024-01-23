import { useState } from 'react';
import ConnectWallet from './ConnectWalletComponent.js';
import ManageFob from './ManageFobComponent';
import ListCurrentFobs from './ListFobComponent';
import ManageMembership from './ManageMembershipComponent';
import ListCurrentMembership from './ListCurrentMembership.js';

function FobManagement() {
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    return (
        <div>
            <ConnectWallet onConnect={setIsConnected} setWalletAddress={setWalletAddress}/>
            {isConnected && 
            <>
                <p>Connected: {walletAddress}</p>
                <br></br>
                <h1>Fobs</h1>
                <ManageFob />
                <ListCurrentFobs walletAddress={walletAddress}/>
                <br></br>
                <h1>Membership</h1>
                <ManageMembership />
                <ListCurrentMembership walletAddress={walletAddress} />
            </>
            }
        </div>
    );
}

export default FobManagement;



