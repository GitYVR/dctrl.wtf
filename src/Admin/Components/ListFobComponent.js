import { useState } from 'react';
import { Button } from '@mui/material';
import { covalent_getNftsForAddress, minter_getSingleFobForAddress, fob_getExpirationForToken } from '../../Membership/API/blockchain';
// List of currently owned fobs
function ListCurrentFobs({walletAddress}) {
    const [fobs, setFobs] = useState([]);
    const [addr, setAddr] = useState(walletAddress);

    // helper JSX for each item in the FobList
    function FobListItem({fob, index}) {
        let date = new Date(fob.token_url * 1000);
        let dateString = date.toLocaleString();
        return (
            <li key={index}>
                Token ID: {fob.token_id.toString()}
                <br/>
                Expiration Date: {dateString}
            </li>
        );
    }

    async function queryCovalent() {
        const resp = await covalent_getNftsForAddress(addr);
        if (resp.data) { 
            let newFobs = [];
            for (let obj in resp.data.items) {
                if (resp.data.items[obj].contract_address === process.env.REACT_APP_FOB_ADDRESS) {
                    newFobs = resp.data.items[obj].nft_data;
                    break;
                }
            }
            setFobs(newFobs);
        }
    }

    async function queryContract() {
        const tokenId = await minter_getSingleFobForAddress(addr);
        const expiration = await fob_getExpirationForToken(tokenId);
        setFobs([{
            token_id: tokenId.toString(),
            token_url: expiration
        }]);
    }

    return (
        <div>
            Address to query
            <input type="text" onChange={(e) => setAddr(e.target.value)} />
            <br/>
            <Button variant="contained" onClick={queryCovalent}>
                Query Covalent
            </Button>
            <Button variant="contained" onClick={queryContract}>
                Query Contract
            </Button>
            <br/>
            Currently owned fobs:
            <ul>
                {fobs.map((fob, index) => (
                    <FobListItem fob={fob} index={index}/>
                ))}
            </ul>
        </div>
    );
}

export default ListCurrentFobs;