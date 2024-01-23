import { ethers } from 'ethers';
import { useState } from 'react';
import { Button } from '@mui/material';
import MinterABI from './MinterABI.json';
import MembershipABI from './MembershipNftABI.json';

const MinterAddress = "0xB2895d2a0205F05c70C0342259492C97423FaCC4"
const MembershipNftAddress = "0x807ec011bd4c5b122178d73fbd0b49d46fb4a0b9"

function ManageMembershipComponent() {
    const [membershipName, setMembershipName] = useState(null);
    const [msg, setMsg] = useState("");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const minterContract = new ethers.Contract(MinterAddress, MinterABI, signer);
    const membershipContract = new ethers.Contract(MembershipNftAddress, MembershipABI, signer);


    async function nameToId(name) {
        const nameHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string"], [name]));
        return await membershipContract.nameToId(nameHash);
    }

    async function showNameToId() {
        if (membershipName == null) {
            setMsg("Please enter name");
            return;
        }

        const tokenId = await nameToId(membershipName);
        setMsg(`Membership ${membershipName} has tokenId: ${tokenId}`);
    }

    async function showNameToAddress() {
        if (membershipName == null) {
            setMsg("Please enter name");
            return;
        }

        const tokenId = await nameToId(membershipName);
        const tokenAddress = await minterContract.getMembershipAddressById(tokenId);

        setMsg(`Membership ${membershipName} has address: ${tokenAddress}`);
    }

    async function issueMembership() {
        if (membershipName == null) {
            setMsg("Please enter name");
            return;
        }

        const tx = await minterContract.issueMembership(await signer.getAddress(), membershipName);
        await tx.wait();

        const tokenId = await nameToId(membershipName);
        const tokenAddress = await minterContract.getMembershipAddressById(tokenId);

        setMsg(`Membership ${membershipName} issued at transaction: ${tx.hash} with tokenId: ${tokenId} and address: ${tokenAddress}`);
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
            {msg}
        </div>
    )
}

export default ManageMembershipComponent;