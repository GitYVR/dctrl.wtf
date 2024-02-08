import { ethers } from 'ethers';
import { useState } from 'react';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import './Shake.css';

import CircularProgress from '@mui/material/CircularProgress';
import MinterABI from "../../Admin/ABI/MinterABI.json";
import MembershipABI from "../../Admin/ABI/MembershipNftABI.json";

function SignUp({ address, onIssue }) {
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(process.env.REACT_APP_PRIV_KEY, sepoliaProvider);
    const minterContract = new ethers.Contract(process.env.REACT_APP_MINTER_ADDRESS, MinterABI, wallet);
    const membershipContract = new ethers.Contract(process.env.REACT_APP_MEMBERSHIP_ADDRESS, MembershipABI, wallet);

    const [msg, setMsg] = useState(null);
    const [membershipName, setMembershipName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [linkClicked, setLinkClicked] = useState(false);
    const [shake, setShake] = useState(false);

    function onCommunityRulesLinkClick() {
        setLinkClicked(true);
    }
    function onCheckboxClick() {
        setChecked(!checked)
    }

    // This triggers a shake animation on the <a>DCTRL's Community Rules</> if clicks on
    // the checkbox before opening the link.
    function shakeOnDisabled() {
        if (!linkClicked) {
            setShake(true);
        }
    }

    async function nameToId(name) {
        const nameHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string"], [name]));
        return await membershipContract.nameToId(nameHash);
    }

    async function issueMembership() {
        setLoading(true);
        setMsg(null);
        if (membershipName == null) {
            setMsg("Please enter name");
            setLoading(false);
            return;
        }

        if ((await nameToId(membershipName)).toString() !== "0") {
            setMsg("Name already exists");
            setLoading(false);
            return;
        }

        try {
            const tx = await minterContract.issueMembership(address, membershipName);
            await tx.wait();

            const tokenId = await nameToId(membershipName);
            onIssue(tokenId);
        }
        catch (e) {
            console.log(e);
            setMsg("Couldn't issue membership. Please share console log with devs.")
            setLoading(false);
        }
    }

    return (
        <>
            <h1>No Membership associated with this wallet:</h1>
            <h2>{address}</h2>
            <p> No worries, let's get you setup! </p>
            <p> Issuing a membership is completely free! We'll even pay for gas (during beta release only). </p>
            <p> You will receive a DCTRL Membership NFT on Sepolia Testnet. It will have its own address and be used hold all your DCTRL assets.</p>
            <br />
            <p>Ready to join? Enter your name: </p>
            <input type="text" onChange={(e) => setMembershipName(e.target.value)} />
            <br />
            <br />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div onClick={shakeOnDisabled}>
                    <Checkbox onClick={onCheckboxClick} disabled={!linkClicked}></Checkbox>
                </div>
                <p>I have read and agree to the:</p>
                <p className={shake ? 'shake' : ''} onAnimationEnd={() => setShake(false)} style={{marginLeft: '5px'}}>
                    <a href={`https://0xtangle.notion.site/GENERAL-GUIDELINES-a4de149c5be1412f9e7723d2cc8381d3`} target="_blank" onClick={onCommunityRulesLinkClick}>
                        DCTRL's Community Rules
                    </a>.
                </p>
            </div>
            <br />
            <Button variant="contained" onClick={issueMembership} disabled={!checked}>
                Issue Membership
            </Button>
            <br />
            {loading && <>
                <CircularProgress />
                <p>Issuing membership... this may take up to 30 seconds.</p>
            </>}


            {msg && <p style={{ color: 'red' }}>{msg}</p>}
        </>
    )
}


export default SignUp;
