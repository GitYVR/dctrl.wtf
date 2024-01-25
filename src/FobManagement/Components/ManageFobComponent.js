import { ethers } from 'ethers';
import { Button } from '@mui/material';
import FobABI from "../ABI/FobNFTABI.json";
import { useState } from 'react';
import MinterABI from '../ABI/MinterABI.json';
import FobMapperABI from '../ABI/FobMapperABI.json'

const FobContractAddress = "0x880505222ccAd5E03221005839F12d32B7F4B2EF"
const MinterAddress = "0xB2895d2a0205F05c70C0342259492C97423FaCC4"
const FobMapperAddress = "0x58375D0DF233c70533BA307e3c5C3B4f52D58B43"

function ManageFob() {
    const [receiver, setReceiver] = useState(null);
    const [fobNumber, setFobNumber] = useState(null);
    const [days, setDays] = useState(null);
    const [msg, setMsg] = useState("");
    const [hash, setHash] = useState("");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fobContract= new ethers.Contract(FobContractAddress, FobABI, signer);
    const minterContract = new ethers.Contract(MinterAddress, MinterABI, signer);


    let lineaTestnetRpc = 'https://linea-goerli.blockpi.network/v1/rpc/public';
    let lineaPrivateKey = "PRIVATE KEY HERE, FUND WITH LINEA TESTNET ETHER, USED IN ISSUE()"
    let lineaProvider = new ethers.providers.JsonRpcProvider(lineaTestnetRpc);
    let wallet = new ethers.Wallet(lineaPrivateKey, lineaProvider);
    const fobMapperContract = new ethers.Contract(FobMapperAddress, FobMapperABI, wallet);

    // helper function to convert fob number to keccak256 hash
    function convertNumberToHashedUint256(number) {
        // Convert fobNumber to a hex string
        const numberHex = ethers.utils.hexlify(ethers.BigNumber.from(number));
        // Compute the keccak256 hash of fobNumber
        const numberHash = ethers.utils.keccak256(numberHex);
        // Convert the hash to a uint256
        return ethers.BigNumber.from(numberHash);
    }

    async function getPaymentForDays(days) {
        return (await minterContract.fobDaily()).mul(days).toString();
    }

    async function issue() {
        if (fobNumber == null || days == null || receiver == null) {
            setMsg("Please enter missing fields");
            return;
        } else {
            const payment = await getPaymentForDays(days);
            const tx = await minterContract.issueFob(receiver, convertNumberToHashedUint256(fobNumber), days, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to issue Fob ${fobNumber} with Id ${convertNumberToHashedUint256(fobNumber).toString()} for ${days} days at transaction: ${tx.hash}`);

            await fobMapperContract.add(convertNumberToHashedUint256(fobNumber), fobNumber); 
        }
    }

    async function extend() {
        if (fobNumber == null || days == null) {
            setMsg("Please enter missing fields");
            return;
        } else {
            const payment = await getPaymentForDays(days);
            const tx = await minterContract.extendFob(convertNumberToHashedUint256(fobNumber), days, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to extend Fob ${fobNumber} with Id ${convertNumberToHashedUint256(fobNumber).toString()} for ${days} days at transaction: ${tx.hash}`);
        }
    }

    async function burnAndMint() {
        if (fobNumber == null || days == null) {
            setMsg("Please enter missing fields");
            return;
        } else {
            const payment = await getPaymentForDays(days);
            const tx = await minterContract.burnAndMintFob(receiver, convertNumberToHashedUint256(fobNumber), days, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to  Fob ${fobNumber} with Id ${convertNumberToHashedUint256(fobNumber).toString()} for ${days} days at transaction: ${tx.hash}`);
        }
    }

    async function burn() {
        if (fobNumber == null) {
            setMsg("Please enter a fob number");
            return;
        } else {
            const tx = await fobContract.burn(convertNumberToHashedUint256(fobNumber));
            await tx.wait();
            setMsg(`Fob ${fobNumber} with Id ${convertNumberToHashedUint256(fobNumber).toString()} burned at transaction: ${tx.hash}`);
        }
    }

    function convert() {
        if (fobNumber == null) {
            setMsg("Please enter a fob number");
            return;
        } else {
            setMsg(convertNumberToHashedUint256(fobNumber).toString());
        }
    }

    async function hashToFob() {
        if (hash == null) {
            setMsg("Please enter a hash");
            return;
        }

        let fobNumber = await fobMapperContract.hashToNumber(ethers.BigNumber.from(hash));
        setMsg("Fob Number is: " + ethers.BigNumber.from(fobNumber).toString());
    }
    return (
        <div>
            <Button variant="contained" onClick={issue}>
                Issue Fob
            </Button>
            <Button variant="contained" onClick={extend}>
                Extend Fob
            </Button>
            <Button variant="contained" onClick={burnAndMint}>
                Burn And Mint Fob
            </Button>
            <Button variant="contained" onClick={burn}>
                Burn Fob
            </Button>
            <Button variant="contained" onClick={convert}>
                Convert Fob Number
            </Button>
            <Button variant="contained" onClick={hashToFob}>
                Convert Hash to Fob Number
            </Button>
            <br />
            Receiver
            <input type="text" onChange={(e) => setReceiver(e.target.value)} />
            <br />
            Fob Number
            <input type="text" onChange={(e) => setFobNumber(e.target.value)} />
            <br />
            Number of days
            <input type="text" onChange={(e) => setDays(e.target.value)} />
            <br />
            Hash
            <input type="text" onChange={(e) => setHash(e.target.value)} />
            <br />
            {msg}
        </div>
    );
}

export default ManageFob;