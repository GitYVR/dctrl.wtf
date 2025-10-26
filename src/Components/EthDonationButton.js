import { useState } from 'react';
import { Button } from '@mui/material';

function EthDonationButton() {
    const [showQR, setShowQR] = useState(false);

    function showHideQR() {
        setShowQR(!showQR);
    }

    return (
        <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Button 
            style={{ borderRadius: '50px', backgroundColor: '#FFCC00', color: 'black', padding: '10px 20px', fontSize: '2vw', fontWeight: 'bold' }}
            variant="contained" onClick={showHideQR}>
                Donate Ethereum!
            </Button>
            <br/>
            {showQR && 
            <>
                <p>dctrl.eth</p>
                <p style={{ wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '90%' }}>0xD5184c0d23f7551DB7c8c4a3a3c5F1685059A09c</p>
                <p><span style={{ color: '#FFCC00', fontWeight: 'bold' }}>Supported networks:</span> Ethereum, Gnosis, Polygon, Plygon zkEVM, Binance, Arbitrum, Optimism, Base</p>
                <img src="/ethQR.jpg" alt="Eth QR code" />
            </>}
        </div>
    );
}

export default EthDonationButton;
