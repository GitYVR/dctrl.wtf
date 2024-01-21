import { CovalentClient } from "@covalenthq/client-sdk";
import { useState } from 'react';
import { Button } from '@mui/material';

// List of currently owned fobs
function ListCurrentFobs({walletAddress}) {
    const [fobs, setFobs] = useState([]);

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
        const client = new CovalentClient("cqt_rQKqPkgW7VWgbrbCqcPpXCyHF3D7");
        // covalent doesn't support eth-sepolia... We'll just getNftsForAddress instead.
        //const resp = await client.NftService.checkOwnershipInNft("eth-sepolia", walletAddress, "0x58375d0df233c70533ba307e3c5c3b4f52d58b43");
        const resp = await client.NftService.getNftsForAddress("eth-sepolia", walletAddress, {"withUncached": true, "noNftAssetMetadata": false});
        // const fobs = resp.data.itemsfilter(item => item.contract_address === "0x58375d0df233c70533ba307e3c5c3b4f52d58b43");

        let newFobs = [];
        for (let obj in resp.data.items) {
            if (resp.data.items[obj].contract_address === "0x58375d0df233c70533ba307e3c5c3b4f52d58b43") {
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