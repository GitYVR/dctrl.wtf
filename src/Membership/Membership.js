import { useEffect, useState } from 'react';
import ConnectWallet from './Components/ConnectWalletComponent.js';
import SignUp from './Components/SignUpComponent.js';
import Profile from './Components/ProfileComponent.js';
import { covalent_getNftsForAddress, membership_idToMetadata, minter_getMembershipAddressById, minter_getMembershipIdForAddress } from './API/blockchain';

function Membership() {
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [memberships, setMemberships] = useState([]);

    async function tryGetMembershipFromCovalent() {
        let foundMembership = false;

        console.log("tryGetMembershipFromCovalent");
        try {
            const resp = await covalent_getNftsForAddress(walletAddress);
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
            if (membership.length > 0) {
                setMemberships(membership);
                foundMembership = true;
            }
        }
        catch (e) {
            console.log(e);
            console.log("Failed to retrieve from Covalent...")
        }

        return foundMembership;
    }

    async function tryGetMembershipFromContract() {
        let foundMembership = false;
        console.log("tryGetMembershipFromContract");

        try {
            let tokenId = await minter_getMembershipIdForAddress(walletAddress);
            if (tokenId.toString() !== "0") {
                let [creationDate, name] = await membership_idToMetadata(tokenId.toString())
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
                foundMembership = true;
            }
        }
        catch (e) {
            console.log(e)
            console.log("Failed to retrieve from contract...")
        }

        return foundMembership;
    }

    async function getMembership() {
        if (await tryGetMembershipFromCovalent()) {
            console.log("Successfully retrieved from Covalent")
        }
        else if (await tryGetMembershipFromContract()) {
            console.log("Successfully retrieved from Contract")
        }

        setIsConnected(true);
    }

    async function onIssue(tokenId) {
        try {
            console.log("onIssue");
            let [creationDate, name] = await membership_idToMetadata(tokenId);
            let date = new Date(creationDate * 1000);
            let dateString = date.toLocaleString();
            let addr6551 = await minter_getMembershipAddressById(tokenId);

            let data = {
                "token_id": tokenId,
                "creation_date": dateString,
                "name": name,
                "addr6551": addr6551
            }

            setMemberships([data]);
        }
        catch (e) {
            console.log(e)
            console.log("onIssue failed...")
        }
    }

    useEffect(() => {
        if (walletAddress) {
            getMembership();
        }

    }, [walletAddress]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            minHeight: '100vh',
        }}>
            {!isConnected &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '2px solid #FFCC00',
                    borderRadius: '5px',
                    padding: '20px',
                    boxSizing: 'border-box'
                }}>
                    <p style={{
                        fontSize: '5vw',
                        fontWeight: 'bold'
                    }}>Welcome to DCTRL membership</p>
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}>Please connect your <span style={{color:'orange'}}>Metamask wallet</span> to continue</p>
                    <ConnectWallet setWalletAddress={setWalletAddress} />
                    <br />
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: 'bold'
                    }}>Other blockchains & wallets coming soon!</p>
                </div>}
            {(isConnected && memberships.length == 0) && <SignUp address={walletAddress} onIssue={onIssue}></SignUp>}
            {(isConnected && memberships.length > 0) && <Profile membership={memberships}></Profile>}
        </div>
    )
}

export default Membership;