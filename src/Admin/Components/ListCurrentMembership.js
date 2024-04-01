import { useState } from 'react';
import { Button } from '@mui/material';
import { covalent_getNftsForAddress, membership_idToMetadata, minter_getMembershipAddressById, minter_getMembershipIdForAddress } from '../../Membership/API/blockchain';

function ListCurrentMembership({ walletAddress }) {
    const [address, setAddress] = useState(walletAddress);
    const [memberships, setMemberships] = useState([]);

    // helper JSX for each item
    function MembershipListItem({ membership, index }) {
        return (
            <li key={index}>
                Token ID: {membership.token_id}
                <br />
                Name: {membership.name}
                <br />
                Creation Date: {membership.creation_date}
                <br />
                6551 Address: {membership.addr6551}
            </li>
        );
    }

    async function queryCovalent() {
        const resp = await covalent_getNftsForAddress(address);

        // extract all NFTs in MembershipNFT from response
        let nftData = [];
        for (let obj in resp.data.items) {
            if (resp.data.items[obj].contract_address === process.env.REACT_APP_MEMBERSHIP_ADDRESS) {
                nftData = resp.data.items[obj].nft_data;
                break;
            }
        }

        // Go through each token and format the data to be printed
        let membership = [];
        for (let token in nftData) {
            let [creationDate, name] = await membership_idToMetadata(nftData[token].token_id.toString())
            let date = new Date(creationDate * 1000);
            let dateString = date.toLocaleString();
            let addr6551 = await minter_getMembershipAddressById(nftData[token].token_id.toString());
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

    async function queryContract() {
        try {
            const tokenId = await minter_getMembershipIdForAddress(address);
            const [creationDate, name] = await membership_idToMetadata(tokenId.toString())
            let date = new Date(creationDate * 1000);
            let dateString = date.toLocaleString();
            let addr6551 = await minter_getMembershipAddressById(tokenId.toString());
            let data = {
                "token_id": tokenId.toString(),
                "creation_date": dateString,
                "name": name,
                "addr6551": addr6551
            }
            setMemberships([data]);
        } catch (e) {
            console.log(e);
            setMemberships([]);
        }
    }

    return (
        <div>
            Address to query
            <input type="text" onChange={(e) => setAddress(e.target.value)} />
            <br />
            <Button variant="contained" onClick={queryCovalent}>
                Query Covalent
            </Button>
            <Button variant="contained" onClick={queryContract}>
                Query Contract
            </Button>
            <br />
            Currently owned memberships:
            <ul>
                {memberships.map((membership, index) => (
                    <MembershipListItem membership={membership} index={index} />
                ))}
            </ul>
        </div>
    );
}

export default ListCurrentMembership