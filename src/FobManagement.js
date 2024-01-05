import { ethers } from 'ethers';
import { Button } from '@mui/material';
import { useState } from 'react';
import { CovalentClient } from "@covalenthq/client-sdk";
import FobABI from "./FobNFTABI.json";

// Connect wallet button
function ConnectWallet({ onConnect, setWalletAddress }) {
    async function connect() {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        onConnect(true);
      } else {
        alert('Please install MetaMask!');
      }
    }
  
    return (
      <div>
        <Button variant="contained" onClick={connect}>
          Connect Wallet
        </Button>
      </div>
    );
}

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

// List of currently owned fobs
function ListCurrentFobs({walletAddress}) {
    const [fobs, setFobs] = useState([]);

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

// Mint fob section
function MintFob() {
    const [fobNumber, setFobNumber] = useState(null);
    const [months, setMonths] = useState(null);
    const [tx, setTx] = useState(null);

    async function mint() {
        if (fobNumber == null || months == null) {
            alert("Please enter a fob number and number of months");
            return;
        } else {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract("0x58375D0DF233c70533BA307e3c5C3B4f52D58B43", FobABI, signer);
            const tx = await contract.issue(await signer.getAddress(), convertNumberToHashedUint256(fobNumber), months);
            await tx.wait();
            setTx(tx.hash);
        }
    }

    return (
        <div>
            <Button variant="contained" onClick={mint}>
                Mint Fob
            </Button>
            <br />
            Fob Number
            <input type="text" onChange={(e) => setFobNumber(e.target.value)} />
            <br />
            Number of Months
            <input type="text" onChange={(e) => setMonths(e.target.value)} />
            <br />
            {tx && <p>Fob {fobNumber} with Id {convertNumberToHashedUint256(fobNumber).toString()} minted for {months} months at transaction: {tx}</p>}
        </div>
    );
}

// helper function to convert fob number to keccak256 hash
function convertNumberToHashedUint256(number) {
    // Convert fobNumber to a hex string
    const numberHex = ethers.utils.hexlify(ethers.BigNumber.from(number));
    // Compute the keccak256 hash of fobNumber
    const numberHash = ethers.utils.keccak256(numberHex);
    // Convert the hash to a uint256
    return ethers.BigNumber.from(numberHash);
}

function FobManagement() {
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    return (
        <div>
            <ConnectWallet onConnect={setIsConnected} setWalletAddress={setWalletAddress}/>
            {isConnected && <p>Connected: {walletAddress}</p>}
            {isConnected && <MintFob />}
            {isConnected && <ListCurrentFobs walletAddress={walletAddress}/>}

        </div>
    );
}

export default FobManagement;



