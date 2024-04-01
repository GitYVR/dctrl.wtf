import { ethers } from 'ethers';
import Fob from './Fob';
import { Button } from '@mui/material';
import { useState } from 'react';
import BitcoinDonationButton from './BitcoinDonationButton';
import { donateEther } from '../API/blockchain';

function Profile({ membership }) {
    const [msg, setMsg] = useState(null);

    async function donate() {
        try {
            const txResponse = await donateEther(ethers.utils.parseEther('0.01'));
            setMsg('Donation received. Thanks! Tx hash:' + txResponse.hash);
        } catch (error) {
            console.log(error)
            setMsg('An error occurred. Please share console log to devs.');
        }
    }
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '2px solid #FFCC00',
            borderRadius: '5px',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <p style={{
                fontSize: '4vw',
                fontWeight: 'bold'
            }}>Welcome back <span style={{ color: '#FFCC00' }}>{membership[0].name}</span></p>

            <div style={{
                border: '2px solid #FFCC00',
                borderRadius: '5px',
                padding: '0 20px',
                boxSizing: 'border-box'
            }}>
                <p style={{
                    fontSize: '3vw',
                    fontWeight: 'bold',
                }}>Your Membership details</p>
                <p style={{
                    fontSize: '2vw',
                    fontWeight: 'bold'
                }}><span style={{ color: '#FFCC00' }}>Date joined:</span> {membership[0].creation_date}</p>
                <p style={{
                    fontSize: '2vw',
                    fontWeight: 'bold'
                }}><span style={{ color: '#FFCC00' }}>DCTRL wallet:</span> {membership[0].addr6551}</p>
            </div>
            <br />
            <div style={{
                border: '2px solid #90CAF9',
                borderRadius: '5px',
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <p style={{
                    fontSize: '3vw',
                    fontWeight: 'bold',
                }}>Your Fob details</p>
                <Fob address={membership[0].addr6551}></Fob>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: '2vw',
                width: '75%'            
            }}>
                <p style={{
                    fontSize: '3vw',
                    fontWeight: 'bold',
                }}>Consider making a donation</p>
                <p>Donations are sent to the multisig address and help support the DCTRL community and are greatly appreciated!</p>
                <p>DCTRL multisig address: <span style={{ color: '#FFCC00', fontWeight: 'bold' }}>0xdcFec2D0A98160ed5E4D10b6e1e21469d0B5e609</span></p>
                <p><span style={{ color: '#FFCC00', fontWeight: 'bold' }}>Supported networks:</span> Ethereum, Gnosis, Polygon, Plygon zkEVM, Binance, Arbitrum, Optimism, Base</p>
                <Button 
                style={{ borderRadius: '50px', backgroundColor: '#FFCC00', color: 'black', padding: '10px 20px', fontSize: '2vw', fontWeight: 'bold' }}
                variant="contained" onClick={donate}>
                    Donate 0.01 ETH today!
                </Button>
                <br/>
                <BitcoinDonationButton />
                {msg && <p style={{color: 'red'}}>{msg}</p>}
            </div>
        </div>
    )
}

export default Profile;