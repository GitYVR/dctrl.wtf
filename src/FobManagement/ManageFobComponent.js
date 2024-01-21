import { ethers } from 'ethers';
import { Button } from '@mui/material';
import FobABI from "./FobNFTABI.json";
import { useState } from 'react';
import MinterABI from './MinterABI.json';

const FobContractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
const MinterAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"

function ManageFob() {
    const [receiver, setReceiver] = useState(null);
    const [fobNumber, setFobNumber] = useState(null);
    const [months, setMonths] = useState(null);
    const [msg, setMsg] = useState("");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const fobContract= new ethers.Contract(FobContractAddress, FobABI, signer);
    const minterContract = new ethers.Contract(MinterAddress, MinterABI, signer);

    // helper function to convert fob number to keccak256 hash
    function convertNumberToHashedUint256(number) {
        // Convert fobNumber to a hex string
        const numberHex = ethers.utils.hexlify(ethers.BigNumber.from(number));
        // Compute the keccak256 hash of fobNumber
        const numberHash = ethers.utils.keccak256(numberHex);
        // Convert the hash to a uint256
        return ethers.BigNumber.from(numberHash);
    }

    async function getPaymentForMonths(months) {
        return (await minterContract.fobMonthly()).mul(months).toString();
    }
    async function issue() {
        if (fobNumber == null || months == null || receiver == null) {
            setMsg("Please enter missing fields");
            return;
        } else {
            const payment = await getPaymentForMonths(months);
            const tx = await minterContract.issueFob(receiver, convertNumberToHashedUint256(fobNumber), months, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to issue Fob ${fobNumber} with Id ${convertNumberToHashedUint256(fobNumber).toString()} for ${months} months at transaction: ${tx.hash}`);

        }
    }

    async function extend() {
        if (fobNumber == null || months == null) {
            setMsg("Please enter missing fields");
            return;
        } else {
            const payment = await getPaymentForMonths(months);
            const tx = await minterContract.extendFob(convertNumberToHashedUint256(fobNumber), months, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to extend Fob ${fobNumber} with Id ${convertNumberToHashedUint256(fobNumber).toString()} for ${months} months at transaction: ${tx.hash}`);
        }
    }

    async function reissue() {
        if (fobNumber == null || months == null) {
            setMsg("Please enter missing fields");
            return;
        } else {
            const payment = await getPaymentForMonths(months);
            const tx = await minterContract.reissue(receiver, convertNumberToHashedUint256(fobNumber), months, { value: payment });
            await tx.wait();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to reissue Fob ${fobNumber} with Id ${convertNumberToHashedUint256(fobNumber).toString()} for ${months} months at transaction: ${tx.hash}`);
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
    return (
        <div>
            <Button variant="contained" onClick={issue}>
                Issue Fob
            </Button>
            <Button variant="contained" onClick={extend}>
                Extend Fob
            </Button>
            <Button variant="contained" onClick={reissue}>
                Reissue Fob
            </Button>
            <Button variant="contained" onClick={burn}>
                Burn Fob
            </Button>
            <Button variant="contained" onClick={convert}>
                Convert Fob Number
            </Button>
            <br />
            Receiver
            <input type="text" onChange={(e) => setReceiver(e.target.value)} />
            <br />
            Fob Number
            <input type="text" onChange={(e) => setFobNumber(e.target.value)} />
            <br />
            Number of Months
            <input type="text" onChange={(e) => setMonths(e.target.value)} />
            <br />
            {msg}
        </div>
    );
}

export default ManageFob;