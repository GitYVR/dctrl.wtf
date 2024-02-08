import { useEffect, useState } from 'react';
import ConnectWallet from './Components/ConnectWalletComponent.js';
import { ethers } from 'ethers';
import MinterABI from "../Admin/ABI/MinterABI.json";
import MembershipABI from "../Admin/ABI/MembershipNftABI.json";
import SignUp from './Components/SignUpComponent.js';
import Profile from './Components/ProfileComponent.js';
import { CovalentClient } from "@covalenthq/client-sdk";

function Membership() {
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [memberships, setMemberships] = useState([]);

    const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(process.env.REACT_APP_PRIV_KEY, sepoliaProvider);
    const minterContract = new ethers.Contract(process.env.REACT_APP_MINTER_ADDRESS, MinterABI, wallet);
    const membershipContract = new ethers.Contract(process.env.REACT_APP_MEMBERSHIP_ADDRESS, MembershipABI, wallet);

    async function getMembership() {
        try {
            const client = new CovalentClient(process.env.REACT_APP_COVALENT_CLIENTID);
            const resp = await client.NftService.getNftsForAddress("eth-sepolia",walletAddress, {"withUncached": true});
            console.log(resp);

            // extract all NFTs in MembershipNFT from response
            let nftData = [];
            for (let obj in resp.data.items) {
                if ((resp.data.items[obj].contract_address).toLowerCase() === process.env.REACT_APP_MEMBERSHIP_ADDRESS.toLowerCase()) {
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
            setIsConnected(true);
        }
        catch(e) {
            console.log(e);
            console.log("Failed to retrieve from Covalent...")
            try {
                let tokenId = await minterContract.membershipMap(walletAddress);
                if (tokenId.toString() !== "0")
                {
                    let [creationDate, name] = await membershipContract.idToMetadata(tokenId.toString())
                    let date = new Date(creationDate * 1000);
                    let dateString = date.toLocaleString();
                    let addr6551 = await minterContract.getMembershipAddressById(tokenId.toString());
                    let data = {
                        "token_id": tokenId.toString(),
                        "creation_date": dateString,
                        "name": name,
                        "addr6551": addr6551
                    }
                    setMemberships([data]);
                }
            }
            catch(e) {
                console.log(e)
                console.log("Failed to retrieve from contract...")
            }
        } 
        finally {
            setIsConnected(true);        
        }

    }

    async function onIssue(tokenId) {
        let [creationDate, name] = await membershipContract.idToMetadata(tokenId);
        let date = new Date(creationDate * 1000);
        let dateString = date.toLocaleString();
        let addr6551 = await minterContract.getMembershipAddressById(tokenId);

        let data = {
            "token_id": tokenId,
            "creation_date": dateString,
            "name": name,
            "addr6551": addr6551
        }

        setMemberships([data]);
    }

    useEffect(() => {
        if (walletAddress) {
            getMembership();
        }

    }, [walletAddress]);

    return (
        <>
            {!isConnected && 
            <>
                <h1>Welcome to DCTRL membership</h1>
                <p>Please connect your Ethereum wallet to continue</p>
                <ConnectWallet setWalletAddress={setWalletAddress} />
                <br />
                <p>Other blockchain wallets coming soon!</p>
            </>}
            {(isConnected && memberships.length == 0) && <SignUp address={walletAddress} onIssue={onIssue}></SignUp>}
            {(isConnected && memberships.length > 0) && <Profile membership={memberships}></Profile>}
        </>
    )
}

export default Membership;