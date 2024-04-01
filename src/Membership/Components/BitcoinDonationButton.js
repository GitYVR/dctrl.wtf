import { useState } from 'react';
import { Button } from '@mui/material';

function BitcoinDonationButton() {
    const [showBitcoinQR, setShowBitcoinQR] = useState(false);

    function showHideBitcoinQR() {
        setShowBitcoinQR(!showBitcoinQR);
    }

    return (
        <>
            <Button 
            style={{ borderRadius: '50px', backgroundColor: '#FFCC00', color: 'black', padding: '10px 20px', fontSize: '2vw', fontWeight: 'bold' }}
            variant="contained" onClick={showHideBitcoinQR}>
                Donate bitcoin on Lightning!
            </Button>
            <br/>
            {showBitcoinQR && <img src="/bitcoinQR.png" alt="Bitcoin QR code" />}
        </>
    );
}

export default BitcoinDonationButton;