import { CovalentClient } from "@covalenthq/client-sdk";
import { useState } from 'react';
import { Button } from '@mui/material';
import MembershipABI from "./MembershipNftABI.json";
import MinterABI from "./MinterABI.json";
import { ethers } from 'ethers';

const MinterAddress = "0xB2895d2a0205F05c70C0342259492C97423FaCC4"
const MembershipNftAddress = "0x807ec011bd4c5b122178d73fbd0b49d46fb4a0b9"

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const minterContract = new ethers.Contract(MinterAddress, MinterABI, signer);
const membershipContract = new ethers.Contract(MembershipNftAddress, MembershipABI, signer);

function ListCurrentMembership({walletAddress}) {
    const [memberships, setMemberships] = useState([]);

    // helper JSX for each item
    function MembershipListItem({membership, index}) {
        return (
            <li key={index}>
                Token ID: {membership.token_id}
                <br/>
                Name: {membership.name}
                <br/>
                Creation Date: {membership.creation_date}
                <br/>
                6551 Address: {membership.addr6551}
            </li>
        );
    }

    async function refresh() {
        const client = new CovalentClient("cqt_rQKqPkgW7VWgbrbCqcPpXCyHF3D7");
        const resp = await client.NftService.getNftsForAddress("eth-sepolia",walletAddress, {"withUncached": true});
        console.log(resp);

        // extract all NFTs in MembershipNFT from response
        let nftData = [];
        for (let obj in resp.data.items) {
            if (resp.data.items[obj].contract_address === MembershipNftAddress) {
                nftData = resp.data.items[obj].nft_data;
                break;
            }
        }

        // Go through each token and format the data to be printed
        let membership = [];
        for (let token in nftData) {
            let [creationDate, name] = await membershipContract.idToMetadata(nftData[token].token_id.toString())
            let date = new Date(creationDate * 1000);
            let dateString = date.toLocaleString();
            let addr6551 = await minterContract.getMembershipAddressById(nftData[token].token_id.toString());
            let data = {
                "token_id": nftData[token].token_id.toString(),
                "creation_date": dateString,
                "name": name,
                "addr6551": addr6551
            }
            membership.push(data);
        }
        setMemberships(membership);
    }

    return (
        <div>
            <Button variant="contained" onClick={refresh}>
                Refresh List
            </Button>
            <br/>
            Currently owned memberships:
            <ul>
                {memberships.map((membership, index) => (
                    <MembershipListItem membership={membership} index={index}/>
                ))}
            </ul>
        </div>
    );
}

export default ListCurrentMembership