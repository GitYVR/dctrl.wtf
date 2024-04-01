import { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { ethers } from "ethers";
import { Button } from "@mui/material";
import { donateEther, minter_extendFob, covalent_getNftsForAddress, fob_getExpirationForToken, minter_getSingleFobForAddress, minter_issueFob, encryptNumberWithLargePrime } from "../API/blockchain";

function Fob({ address }) {
    const [fobs, setFobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fobNumber, setFobNumber] = useState(null);
    const [msg, setMsg] = useState(null);
    const [showWorkingText, setShowWorkingText] = useState(false);
    
    useEffect(() => {
        refresh();
    }, []);

    async function tryGetFobFromCovalent() {
        let foundFob = false;
        try {
            const resp = await covalent_getNftsForAddress(address);
            let newFobs = [];
            for (let obj in resp.data.items) {
                if ((resp.data.items[obj].contract_address).toLowerCase() === process.env.REACT_APP_FOB_ADDRESS.toLowerCase()) {
                    let expiration = await fob_getExpirationForToken(resp.data.items[obj].nft_data[0].token_id.toString());
                    let data = {
                        "token_id": resp.data.items[obj].nft_data[0].token_id.toString(),
                        "expiration": expiration.toString()
                    }
                    newFobs.push(data);
                    break;
                }
            }
            if (newFobs.length > 0) {
                setFobs(newFobs);
                foundFob = true;
            }
        }
        catch (e) {
            console.log(e)
            console.log("Failed to retrieve from Covalent...")
        }

        return foundFob;
    }

    async function tryGetFobFromContract() {
        let foundFob = false;
        try {
            let tokenId = await minter_getSingleFobForAddress(address);
            if (tokenId.toString() !== "0") {
                let expiration = await fob_getExpirationForToken(tokenId);
                let data = {
                    "token_id": tokenId,
                    "expiration": expiration.toString()
                }
                setFobs([data]);
                foundFob = true;
            }
        }
        catch (e) {
            console.log(e)
            console.log("Failed to retrieve from contract...")
        }
        return foundFob;
    }

    async function refresh() {
        if (await tryGetFobFromCovalent()) {
            console.log("Found fob from Covalent");
        }
        else if (await tryGetFobFromContract()) {
            console.log("Found fob from contract");
        }
        setLoading(false);
    }

    async function issue() {
        if (fobNumber == null) {
            setMsg("Enter a fob number");
            return;
        } else {
            setMsg(null);
            setLoading(true);
            setShowWorkingText(true);
            try {
                await donateEther(ethers.utils.parseEther('0.005'));

                let days = 30;
                await minter_issueFob(address, fobNumber, days);
                let data = {
                    "token_id": encryptNumberWithLargePrime(fobNumber),
                    "expiration": (await fob_getExpirationForToken(encryptNumberWithLargePrime(fobNumber))).toString()
                }

                setFobs([data]);
            } catch (e) {
                console.log(e)
                setMsg("Couldn't issue fob. Please share console log with devs.")
            }

            setLoading(false);
            setShowWorkingText(false);
        }
    }

    async function extend() {
        setMsg(null);
        setLoading(true);
        setShowWorkingText(true);
        try {
            await donateEther(ethers.utils.parseEther('0.005'));

            let days = 30;
            await minter_extendFob(fobs[0].token_id, days);            
            await refresh();
        } catch (e) {
            console.log(e)
            setMsg("Couldn't extend fob. Please share console log with devs.")
        }

        setLoading(false);
        setShowWorkingText(false);
    }

    return (
        <>
            {!loading && fobs.length === 0 &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold',
                        color: '#90CAF9'
                    }}>No fobs found.</p>
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}>Enter your fob number and we'll register it for 30 days!</p>
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}>There is a suggested donation of $25. Please contact us for other options. <span style={{ color: '#90CAF9', fontWeight: 'bold' }}>Supported networks:</span> Ethereum, Gnosis, Polygon, Plygon zkEVM, Binance, Arbitrum, Optimism, Base</p>
                    
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}>Fob Number</p>
                    <input
                        style={{ fontSize: '3vw', padding: '10px', textAlign: 'center' }}
                        type="number"
                        onChange={(e) => setFobNumber(e.target.value)} />
                    <br/>
                    <Button style={{ borderRadius: '50px', backgroundColor: '#90CAF9', color: 'black', padding: '10px 20px', fontSize: '2vw', fontWeight: 'bold' }}
                        variant="contained" onClick={issue}>
                        Register Fob: 0.005 ETH
                    </Button>
                </div>}
            {!loading && fobs.length > 0 &&
                <>
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}><span style={{ color: '#90CAF9' }}>Fob Number:</span> {ethers.BigNumber.from(fobs[0].token_id).div(process.env.REACT_APP_LARGEPRIME).toString()}</p>
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}><span style={{ color: '#90CAF9' }}>Expiration Date:</span> {new Date(fobs[0].expiration * 1000).toLocaleString()}</p>

                    <Button style={{ borderRadius: '50px', backgroundColor: '#90CAF9', color: 'black', padding: '10px 20px', fontSize: '2vw', fontWeight: 'bold' }} variant="contained" onClick={extend}>
                        Extend for 30 days: 0.005 ETH
                    </Button>
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}>There is a suggested donation of $25. Please contact us for other options. <span style={{ color: '#90CAF9', fontWeight: 'bold' }}>Supported networks:</span> Ethereum, Gnosis, Polygon, Plygon zkEVM, Binance, Arbitrum, Optimism, Base</p>
                    
                </>
            }
            {loading && <CircularProgress />}
            {showWorkingText && <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}>Working... this may take up to 30 seconds.</p>}
            {msg && <p style={{ color: 'red', fontSize: '2vw' }}>{msg}</p>}
        </>
    )
}

export default Fob;