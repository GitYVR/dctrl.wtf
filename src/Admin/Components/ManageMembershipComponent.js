import { useState } from 'react';
import { Button } from '@mui/material';
import { getMembershipIdFromName, minter_getMembershipAddressById, minter_issueMembership } from '../../Membership/API/blockchain';
function ManageMembershipComponent(address) {
    const [membershipName, setMembershipName] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [msg, setMsg] = useState("");

    async function showNameToId() {
        if (membershipName == null) {
            setMsg("Please enter name");
            return;
        }

        const tokenId = await getMembershipIdFromName(membershipName);
        setMsg(`Membership ${membershipName} has tokenId: ${tokenId}`);
    }

    async function showNameToAddress() {
        if (membershipName == null) {
            setMsg("Please enter name");
            return;
        }

        const tokenId = await getMembershipIdFromName(membershipName);
        const tokenAddress = await minter_getMembershipAddressById(tokenId);

        setMsg(`Membership ${membershipName} has address: ${tokenAddress}`);
    }

    async function issueMembership() {
        if (membershipName == null) {
            setMsg("Please enter name");
            return;
        }

        if (receiver == null) {
            setMsg("Please enter receiver");
            return;
        }

        await minter_issueMembership(receiver, membershipName);

        const tokenId = await getMembershipIdFromName(membershipName);
        const tokenAddress = await minter_getMembershipAddressById(tokenId);

        setMsg(`Membership ${membershipName} issued with tokenId: ${tokenId} and address: ${tokenAddress}`);
    }

    return (
        <div>
            <Button variant="contained" onClick={issueMembership}>
                Issue Membership
            </Button>
            <Button variant="contained" onClick={showNameToId}>
                Name to tokenId
            </Button>
            <Button variant="contained" onClick={showNameToAddress}>
                Name to address
            </Button>
            <br />
                Name
            <input type="text" onChange={(e) => setMembershipName(e.target.value)} />
            <br />
            Receiver
            <input type="text" onChange={(e) => setReceiver(e.target.value)} />
            <br />
            {msg}
        </div>
    )
}

export default ManageMembershipComponent;