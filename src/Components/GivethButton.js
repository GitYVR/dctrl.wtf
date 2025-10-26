import { Button } from '@mui/material';

function GivethButton() {
    function redirect() {
        window.location.href = "https://giveth.io/project/dctrl-clubhouse-events-space";
    }

    return (
        <div style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Button 
            style={{ borderRadius: '50px', backgroundColor: '#FFCC00', color: 'black', padding: '10px 20px', fontSize: '2vw', fontWeight: 'bold' }}
            variant="contained" onClick={redirect}>
                Donate on Giveth!
            </Button>
        </div>
    );
}

export default GivethButton;
