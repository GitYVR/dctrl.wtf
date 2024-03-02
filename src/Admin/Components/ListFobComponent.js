import { CovalentClient } from "@covalenthq/client-sdk";
import { useState } from 'react';
import { Button } from '@mui/material';

const FobNftAddress = "0x880505222ccad5e03221005839f12d32b7f4b2ef"
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

    async function refresh() {
        const client = new CovalentClient(process.env.REACT_APP_COVALENT_CLIENTID);
        const resp = await client.NftService.getNftsForAddress("eth-sepolia", addr, {"withUncached": true, "noNftAssetMetadata": false});
        console.log(resp);
        let newFobs = [];
        for (let obj in resp.data.items) {
            if (resp.data.items[obj].contract_address === FobNftAddress) {
                newFobs = resp.data.items[obj].nft_data;
                break;
            }
        }
        setFobs(newFobs);
    }

    return (
        <div>
            <Button variant="contained" onClick={refresh}>
                Refresh List
            </Button>
            <br/>
            Address to query
            <input type="text" onChange={(e) => setAddr(e.target.value)} />
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