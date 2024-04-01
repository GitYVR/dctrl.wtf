import { useState } from 'react';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import './Shake.css';

import CircularProgress from '@mui/material/CircularProgress';
import { getMembershipIdFromName, minter_issueMembership } from '../API/blockchain';

function SignUp({ address, onIssue }) {

    const [msg, setMsg] = useState(null);
    const [membershipName, setMembershipName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [linkClicked, setLinkClicked] = useState(false);
    const [shake, setShake] = useState(false);
    const [linkColor, setLinkColor] = useState('blue');

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
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            setLinkColor(`rgb(${r},${g},${b}`);
            setShake(true);
        }
    }

    async function issueMembership() {
        setLoading(true);
        setMsg(null);
        if (membershipName == null) {
            setMsg("Please enter name");
            setLoading(false);
            return;
        }

        try {
            let membershipId = await getMembershipIdFromName(membershipName);
            if (membershipId.toString() !== "0") {
                setMsg("Name already exists");
                setLoading(false);
                return;
            }

            membershipId = await minter_issueMembership(address, membershipName);
            onIssue(membershipId);
        }
        catch (e) {
            console.log(e);
            setMsg("Couldn't issue membership. Please share console log with devs.")
            setLoading(false);
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            border: '2px solid #FFCC00',
            borderRadius: '5px',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <p style={{
                fontSize: '4vw',
                fontWeight: 'bold'
            }}>No Membership associated with this wallet: <span style={{ color: '#FFCC00' }}>{address}</span></p>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '2px solid green',
                borderRadius: '5px',
                padding: '20px',
                boxSizing: 'border-box',
                margin: '50px'
            }}>
                <p style={{ fontSize: '3vw', margin: '10px 0' }}> No worries, let's get you setup! </p>
                <p style={{ fontSize: '2vw', margin: '10px 0' }}> Issuing a membership is <span style={{ color: 'green' }}>completely free!</span> We'll even pay for gas (during beta release only). </p>
                <p style={{ fontSize: '1.5vw', margin: '10px 0' }}> You will receive a DCTRL Membership NFT on Sepolia Testnet. It will have its own address and be used hold all your DCTRL assets.</p>
            </div>

            <p style={{
                fontSize: '4vw',
                fontWeight: 'bold'
            }}> Ready to join? Enter your name:</p>
            <input
                style={{ fontSize: '3vw', padding: '10px', textAlign: 'center' }}
                type="text"
                onChange={(e) => setMembershipName(e.target.value)} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div onClick={shakeOnDisabled}>
                    <Checkbox style={{ color: '#FFCC00' }} onClick={onCheckboxClick} disabled={!linkClicked}></Checkbox>
                </div>
                <p style={{
                    fontSize: '2vw',
                }}> have read and agree to the:</p>
                <p style={{ marginLeft: '5px', fontSize: '2vw', }}
                    className={shake ? 'shake' : ''}
                    onAnimationEnd={() => setShake(false)}>
                    <a href={`https://0xtangle.notion.site/GENERAL-GUIDELINES-a4de149c5be1412f9e7723d2cc8381d3`} target="_blank" onClick={onCommunityRulesLinkClick} style={{ color: linkColor }}>
                        DCTRL's Community Rules
                    </a>.
                </p>
            </div>
            <Button style={{ borderRadius: '50px', backgroundColor: checked ? '#FFCC00' : '#4A4A4A', color: 'black', padding: '10px 20px', fontSize: '2vw', fontWeight: 'bold'}}
            variant="contained" onClick={issueMembership} disabled={!checked}>
                Issue Membership
            </Button>
            <br />
            {loading && <>
                <CircularProgress />
                <p style={{
                    fontSize: '2vw',
                }}>Issuing membership... this may take up to 30 seconds.</p>
            </>}

            {msg && <p style={{ color: 'red', fontSize: '3vw' }}>{msg}</p>}
        </div>
    )
}


export default SignUp;
