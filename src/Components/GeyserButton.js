import { Button } from '@mui/material';

function GeyserButton() {
    function redirect() {
        window.location.href = "https://geyser.fund/project/dctrlvan/";
    }

    return (
        <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Button 
            style={{ borderRadius: '50px', backgroundColor: '#FFCC00', color: 'black', padding: '10px 20px', fontSize: '2vw', fontWeight: 'bold' }}
            variant="contained" onClick={redirect}>
                Donate on Geyser
            </Button>
        </div>
    );
}

export default GeyserButton;
