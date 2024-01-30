import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { CovalentClient } from "@covalenthq/client-sdk";
import { ethers } from "ethers";
import FobABI from "../../Admin/ABI/FobNFTABI.json";
import MinterABI from "../../Admin/ABI/MinterABI.json";
import { Button } from "@mui/material";

function Fob({address}) {
    const [fobs, setFobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fobNumber, setFobNumber] = useState(null);
    const [msg, setMsg] = useState(null);

    const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(process.env.REACT_APP_PRIV_KEY, sepoliaProvider);
    const fobContract = new ethers.Contract(process.env.REACT_APP_FOB_ADDRESS, FobABI, wallet);
    const minterContract = new ethers.Contract(process.env.REACT_APP_MINTER_ADDRESS, MinterABI, wallet);

    useEffect(() => {
        refresh();
    }, []);

    async function getPaymentForDays(days) {
        return (await minterContract.fobDaily()).mul(days).toString();
    }

    function encryptNumber(number) {
        return ethers.BigNumber.from(number).mul(process.env.REACT_APP_LARGEPRIME);
    }

    async function refresh() {
        try {
            const client = new CovalentClient(process.env.REACT_APP_COVALENT_CLIENTID);
            const resp = await client.NftService.getNftsForAddress("eth-sepolia", address, {"withUncached": true, "noNftAssetMetadata": false});
            console.log(resp);
            let newFobs = [];
            for (let obj in resp.data.items) {
                if (resp.data.items[obj].contract_address === process.env.REACT_APP_FOB_ADDRESS) {
                    newFobs = resp.data.items[obj].nft_data;
                    break;
                }
            }
            setFobs(newFobs);
        }
        catch (e) {
            console.log(e)
            console.log("Failed to retrieve from Covalent...")
            try {
                let tokenId = await minterContract.fobMap(address);
                if (tokenId.toString() !== "0") 
                {
                    let expiration = await fobContract.idToExpiration(tokenId)
                    let data = {
                        "token_id": tokenId,
                        "expiration": expiration.toString()
                    }
                    setFobs([data]);
                }
            }
            catch (e) {
                console.log(e)
                console.log("Failed to retrieve from contract...")
            }
        }
        setLoading(false);
    }

    async function issue() {
        if (fobNumber == null) {
            setMsg("Enter a fob number");
            return;
        } else {
            setLoading(true);
            let days = 30;
            const payment = await getPaymentForDays(days);
            const tx = await minterContract.issueFob(address, encryptNumber(fobNumber), days, { value: payment });
            await tx.wait();
            let data = {
                "token_id": encryptNumber(fobNumber),
                "expiration": (await fobContract.idToExpiration(encryptNumber(fobNumber))).toString()
            }
            setLoading(false);
            setFobs([data]);
        }
    }

    return (
        <>
            {!loading && fobs.length == 0 && 
                <>
                <p>No fobs found.</p>
                <p>Enter your fob number and we'll register it for 30 days for free!</p>
                <br />
                Fob Number
                <input type="text" onChange={(e) => setFobNumber(e.target.value)} />
                <Button variant="contained" onClick={issue}>
                Register Fob
                </Button>
                </>}
            {!loading && fobs.length > 0 && 
                <>
                    <ul>
                        <li>
                            Fob Number: {(fobs[0].token_id).div(process.env.REACT_APP_LARGEPRIME).toString()}
                        </li>
                        <li>
                            Expiration Date: {new Date(fobs[0].expiration * 1000).toLocaleString()}
                        </li>
                    </ul>
                </>
            }
            {loading && <CircularProgress />}
            {msg && <p style={{ color: 'red' }}>{msg}</p>}
        </>
    )
}

export default Fob;