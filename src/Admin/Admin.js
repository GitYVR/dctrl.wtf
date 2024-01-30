import { useState } from 'react';
import ConnectWallet from './Components/ConnectWalletComponent.js';
import ManageFob from './Components/ManageFobComponent.js';
import ListCurrentFobs from './Components/ListFobComponent.js';
import ManageMembership from './Components/ManageMembershipComponent.js';
import ListCurrentMembership from './Components/ListCurrentMembership.js';

function Admin() {
    const [password, setPassword] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    return (
        <div>
            {password == "dctrl" ?
                <div>
                    <ConnectWallet onConnect={setIsConnected} setWalletAddress={setWalletAddress} />
                    {isConnected &&
                        <>
                            <p>Connected: {walletAddress}</p>
                            <br></br>
                            <h1>Fobs</h1>
                            <ManageFob />
                            <ListCurrentFobs walletAddress={walletAddress} />
                            <br></br>
                            <h1>Membership</h1>
                            <ManageMembership />
                            <ListCurrentMembership walletAddress={walletAddress} />
                        </>
                    }
                </div>
                :
                <input type="password" onChange={(e) => setPassword(e.target.value)} />
            }
        </div>
    );
}

export default Admin;



