import { ethers } from 'ethers';
import { Button } from '@mui/material';
import { useState } from 'react';
import { minter_issueFob, fob_getFobDaily, encryptNumberWithLargePrime, minter_extendFob, minter_burnAndMintFob, fob_burn, fob_getExpirationForToken  } from '../../Membership/API/blockchain';


function ManageFob() {
    const [receiver, setReceiver] = useState(null);
    const [fobNumber, setFobNumber] = useState(null);
    const [days, setDays] = useState(null);
    const [msg, setMsg] = useState("");
    const [encryptedNum, setEncryptedNum] = useState(null);

    function decryptNumber(encrypted) {
        return ethers.BigNumber.from(encrypted.trim()).div(process.env.REACT_APP_LARGEPRIME);
    }

    async function issue() {
        if (fobNumber == null || days == null || receiver == null) {
            setMsg("Please enter missing fields: fobNumber, days, receiver");
            return;
        } else {
            await minter_issueFob(receiver, fobNumber, days);
            const payment = (await fob_getFobDaily()).mul(days).toString();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to issue Fob ${fobNumber} with Id ${encryptNumberWithLargePrime(fobNumber).toString()} for ${days} days`);
        }
    }

    async function extend() {
        if (fobNumber == null || days == null) {
            setMsg("Please enter missing fields: fobNumber, days");
            return;
        } else {
            await minter_extendFob(encryptNumberWithLargePrime(fobNumber), days);
            const payment = (await fob_getFobDaily()).mul(days).toString();
            setMsg(`Paid ${ethers.utils.formatEther(payment)} ether to extend Fob ${fobNumber} with Id ${encryptNumberWithLargePrime(fobNumber).toString()} for ${days} days`);
        }
    }

    async function burn() {
        if (fobNumber == null) {
            setMsg("Please enter a fob number");
            return;
        } else {
            await fob_burn(fobNumber);
            setMsg(`Fob ${fobNumber} with Id ${encryptNumberWithLargePrime(fobNumber).toString()} burned`);
        }
    }

    async function queryExpiration() {
        if (fobNumber == null) {
            setMsg("Please enter a fob number");
            return;
        } else {
            const expiration = await fob_getExpirationForToken(encryptNumberWithLargePrime(fobNumber));
            let date = new Date(expiration * 1000);
            let dateString = date.toLocaleString();
            setMsg(`Fob ${fobNumber} with Id ${encryptNumberWithLargePrime(fobNumber).toString()} has expiration: ${dateString}`);
        }
    }

    function convertToEncrypted() {
        if (fobNumber == null) {
            setMsg("Please enter a fob number");
            return;
        } else {
            setMsg(encryptNumberWithLargePrime(fobNumber).toString());
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
            Fob Number
            <input type="text" onChange={(e) => setFobNumber(e.target.value)} />
            <br />
            Receiver
            <input type="text" onChange={(e) => setReceiver(e.target.value)} />
            <br />
            Number of days
            <input type="text" onChange={(e) => setDays(e.target.value)} />
            <br />
            <Button variant="contained" onClick={issue}>
                Issue Fob
            </Button>
            <Button variant="contained" onClick={extend}>
                Extend Fob
            </Button>
            <Button variant="contained" onClick={burn}>
                Burn Fob
            </Button>
            <br />
            <Button variant="contained" onClick={queryExpiration}>
                Query Expiration
            </Button>
            <Button variant="contained" onClick={convertToEncrypted}>
                Encrypt Fob Number
            </Button>
            <br />
            <br />
            Encrypted Fob Number
            <input type="text" onChange={(e) => setEncryptedNum(e.target.value)} />
            <br />
            <Button variant="contained" onClick={convertToDecrypted}>
                Decrypt Fob Number
            </Button>
            <br/>
            {msg}
        </div>
    );
}

export default ManageFob;