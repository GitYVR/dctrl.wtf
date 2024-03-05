import Fob from './Fob';
import { ethers } from 'ethers';
import { Button } from '@mui/material';
import { useState } from 'react';
import BitcoinDonationButton from './BitcoinDonationButton';

function Profile({membership}) {
    const [msg, setMsg] = useState(null);

    async function donate() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tx = {
            to: '0xdcFec2D0A98160ed5E4D10b6e1e21469d0B5e609',
            value: ethers.utils.parseEther('0.01')
        };
    
        try {
            const txResponse = await signer.sendTransaction(tx);
            setMsg('Donation received. Thanks! Tx hash:' + txResponse.hash);
        } catch (error) {
            console.log(error)
            setMsg('An error occurred. Please share console log to devs.');
        }
    }
    return (
        <>
            <h1>Welcome back <span style={{ color: 'green' }}>{membership[0].name}</span></h1>

            <h2>Your Membership details</h2>
            <ul>
                <li> Date joined: {membership[0].creation_date}</li>
                <li> DCTRL address: {membership[0].addr6551}</li>
            </ul>
            <p>{process.env.REACT_APP_STRING}</p>
            <h2>Your Fob details</h2>
            <Fob address={membership[0].addr6551}></Fob>
            <h2>Consider making a donation</h2>
            <p>Donations are sent to the multisig address and help support the DCTRL community and are greatly appreciated!</p>
            <p>DCTRL multisig address: 0xdcFec2D0A98160ed5E4D10b6e1e21469d0B5e609</p>
            <p style={{ color: 'yellow' }}>Supported networks: Ethereum, Gnosis, Polygon, Plygon zkEVM, Binance, Arbitrum, Optimism, Base</p>
            <Button variant="contained" onClick={donate}>
                Donate 0.01 ETH today!
            </Button>
            <br/>
            <br/>
            <BitcoinDonationButton />
            {msg && <p>{msg}</p>}
        </>
    )
}

export default Profile;