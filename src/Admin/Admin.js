import { useState, useEffect } from 'react';
import ConnectWallet from '../Membership/Components/ConnectWalletComponent.js';
import ManageFob from './Components/ManageFobComponent.js';
import ListCurrentFobs from './Components/ListFobComponent.js';
import ManageMembership from './Components/ManageMembershipComponent.js';
import ListCurrentMembership from './Components/ListCurrentMembership.js';
import { setConnectedWalletAsSigner, resetSigner } from '../Membership/API/blockchain.js';
import { Button } from '@mui/material';

function Admin() {
    const [password, setPassword] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        return () => {
            resetSigner();
        }
    }, []);

    useEffect(() => {
        if (walletAddress != null) {
            setIsConnected(true);
        }
    }, [walletAddress]);

    return (
        <div>
            {password === "dctrl" ?
                <div>
                    {!isConnected && <ConnectWallet setWalletAddress={setWalletAddress} />}
                    {isConnected &&
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            margin: '20px',
                            gap: '20px'
                        }}>
                            <div style={{
                                display: 'inline-block',
                                border: '2px solid #FFCC00',
                                borderRadius: '5px',
                                padding: '20px',
                                boxSizing: 'border-box'
                            }}>
                                <p>Connected: {walletAddress}</p>
                                <Button variant="contained" onClick={setConnectedWalletAsSigner}>
                                    Set Connected Wallet as Signer
                                </Button>
                                <Button variant="contained" onClick={resetSigner}>
                                    Reset Signer
                                </Button>
                            </div>
                            <div style={{
                                display: 'inline-block',
                                border: '2px solid #FFCC00',
                                borderRadius: '5px',
                                padding: '20px',
                                boxSizing: 'border-box'
                            }}>
                                <h1>Fobs</h1>
                                <ManageFob />
                                <br />
                                <ListCurrentFobs walletAddress={walletAddress} />
                            </div>
                            <div style={{
                                display: 'inline-block',
                                border: '2px solid #FFCC00',
                                borderRadius: '5px',
                                padding: '20px',
                                boxSizing: 'border-box'
                            }}>
                                <h1>Membership</h1>
                                <ManageMembership />
                                <br/>
                                <ListCurrentMembership walletAddress={walletAddress} />
                            </div>
                        </div>
                    }
                </div>
                :
                <input type="password" onChange={(e) => setPassword(e.target.value)} />
            }
        </div>
    );
}

export default Admin;



