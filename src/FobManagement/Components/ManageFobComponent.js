import { ethers } from 'ethers';
import { Button } from '@mui/material';
import FobABI from "../ABI/FobNFTABI.json";
import { useState } from 'react';
import MinterABI from '../ABI/MinterABI.json';

const FobContractAddress = "0x880505222ccAd5E03221005839F12d32B7F4B2EF"
const MinterAddress = "0xB2895d2a0205F05c70C0342259492C97423FaCC4"

const LARGEPRIME = "69420420420420";

function ManageFob() {
    const [receiver, setReceiver] = useState(null);
    const [fobNumber, setFobNumber] = useState(null);
    const [days, setDays] = useState(null);
    const [msg, setMsg] = useState("");
    const [encryptedNum, setEncryptedNum] = useState(null);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fobContract = new ethers.Contract(FobContractAddress, FobABI, signer);
    const minterContract = new ethers.Contract(MinterAddress, MinterABI, signer);

    function encryptNumber(number) {
        return ethers.BigNumber.from(number).mul(LARGEPRIME);
    }

    function decryptNumber(encrypted) {
        return ethers.BigNumber.from(encrypted).div(LARGEPRIME);
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
            const tx = await minterContract.issueFob(receiver, encryptNumber(fobNumber), days, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to issue Fob ${fobNumber} with Id ${encryptNumber(fobNumber).toString()} for ${days} days at transaction: ${tx.hash}`);
        }
    }

    async function extend() {
        if (fobNumber == null || days == null) {
            setMsg("Please enter missing fields");
            return;
        } else {
            const payment = await getPaymentForDays(days);
            const tx = await minterContract.extendFob(encryptNumber(fobNumber), days, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to extend Fob ${fobNumber} with Id ${encryptNumber(fobNumber).toString()} for ${days} days at transaction: ${tx.hash}`);
        }
    }

    async function burnAndMint() {
        if (fobNumber == null || days == null) {
            setMsg("Please enter missing fields");
            return;
        } else {
            const payment = await getPaymentForDays(days);
            const tx = await minterContract.burnAndMintFob(receiver, encryptNumber(fobNumber), days, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to  Fob ${fobNumber} with Id ${encryptNumber(fobNumber).toString()} for ${days} days at transaction: ${tx.hash}`);
        }
    }

    async function burn() {
        if (fobNumber == null) {
            setMsg("Please enter a fob number");
            return;
        } else {
            const tx = await fobContract.burn(encryptNumber(fobNumber));
            await tx.wait();
            setMsg(`Fob ${fobNumber} with Id ${encryptNumber(fobNumber).toString()} burned at transaction: ${tx.hash}`);
        }
    }

    function convertToEncrypted() {
        if (fobNumber == null) {
            setMsg("Please enter a fob number");
            return;
        } else {
            setMsg(encryptNumber(fobNumber).toString());
        }
    }

    function convertToDecrypted() {
        if (encryptedNum == null) {
            setMsg("Please enter an encrypted number");
            return;
        } else {
            setMsg(decryptNumber(encryptedNum).toString());
        }
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
            <Button variant="contained" onClick={convertToEncrypted}>
                Encrypt Fob Number
            </Button>
            <Button variant="contained" onClick={convertToDecrypted}>
                Decrypt Fob Number
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
            Encrypted Number
            <input type="text" onChange={(e) => setEncryptedNum(e.target.value)} />
            <br />
            {msg}
        </div>
    );
}

export default ManageFob;