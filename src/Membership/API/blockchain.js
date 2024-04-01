
import { ethers } from 'ethers';
import FobABI from "./ABI/FobNFTABI.json";
import MinterABI from "./ABI/MinterABI.json";
import MembershipABI from "./ABI/MembershipNftABI.json";
import { CovalentClient } from "@covalenthq/client-sdk";

let sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_RPC);
let wallet = new ethers.Wallet(process.env.REACT_APP_PRIV_KEY, sepoliaProvider);
let minterContract = new ethers.Contract(process.env.REACT_APP_MINTER_ADDRESS, MinterABI, wallet);
let membershipContract = new ethers.Contract(process.env.REACT_APP_MEMBERSHIP_ADDRESS, MembershipABI, wallet);
let fobContract = new ethers.Contract(process.env.REACT_APP_FOB_ADDRESS, FobABI, wallet);

export function setConnectedWalletAsSigner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    minterContract = new ethers.Contract(process.env.REACT_APP_MINTER_ADDRESS, MinterABI, signer);
    membershipContract = new ethers.Contract(process.env.REACT_APP_MEMBERSHIP_ADDRESS, MembershipABI, signer);
    fobContract = new ethers.Contract(process.env.REACT_APP_FOB_ADDRESS, FobABI, signer);
}
export function resetSigner() { 
    minterContract = new ethers.Contract(process.env.REACT_APP_MINTER_ADDRESS, MinterABI, wallet);
    membershipContract = new ethers.Contract(process.env.REACT_APP_MEMBERSHIP_ADDRESS, MembershipABI, wallet);
    fobContract = new ethers.Contract(process.env.REACT_APP_FOB_ADDRESS, FobABI, wallet);

}

export async function getMembershipIdFromName(name) {
    const nameHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string"], [name]));
    return await membershipContract.nameToId(nameHash);
}

export async function minter_issueMembership(address, membershipName) {
    if (membershipName == null) {
        throw new Error("Please enter name");
    }

    if ((await getMembershipIdFromName(membershipName)).toString() !== "0") {
        throw new Error("Name already exists");
    }

    const tx = await minterContract.issueMembership(address, membershipName);
    await tx.wait();

    return await getMembershipIdFromName(membershipName);
}

export async function donateEther(amountEther) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tx = {
        to: '0xdcFec2D0A98160ed5E4D10b6e1e21469d0B5e609',
        value: amountEther
    };
    return await signer.sendTransaction(tx);
}

export async function fob_getFobDaily() {
    return await minterContract.fobDaily();
}

export function encryptNumberWithLargePrime(number) {
    return ethers.BigNumber.from(number).mul(process.env.REACT_APP_LARGEPRIME);
}

export async function covalent_getNftsForAddress(address) {
    const client = new CovalentClient(process.env.REACT_APP_COVALENT_CLIENTID);
    console.log(client)
    const resp = await client.NftService.getNftsForAddress("eth-sepolia", address, { "withUncached": true });
    console.log("hmm")
    console.log(resp);
    return (resp);
}

export async function fob_getExpirationForToken(id) {
    return await fobContract.idToExpiration(id);
}

export async function minter_getSingleFobForAddress(address) {
    return await minterContract.fobMap(address);
}

export async function minter_issueFob(address, fobNumber, days) {
    const payment = (await fob_getFobDaily()).mul(days).toString();
    const tx = await minterContract.issueFob(address, encryptNumberWithLargePrime(fobNumber), days, { value: payment });
    await tx.wait()
}

export async function minter_extendFob(encryptFobNumber, days) {
    const payment = (await fob_getFobDaily()).mul(days).toString();
    const tx = await minterContract.extendFob(encryptFobNumber, days, { value: payment });
    await tx.wait();
}

// deprecated, do not use
export async function minter_burnAndMintFob(receiver, fobNumber, days) {
    const payment = (await fob_getFobDaily()).mul(days).toString();
    const tx = await minterContract.burnAndMintFob(receiver, encryptNumberWithLargePrime(fobNumber), days, { value: payment });
    await tx.wait();
}

export async function fob_burn(fobNumber) {
    const tx = await fobContract.burn(encryptNumberWithLargePrime(fobNumber));
    await tx.wait();
}

export async function membership_idToMetadata(id) {
    return await membershipContract.idToMetadata(id);
}

export async function minter_getMembershipAddressById(id) {
    return await minterContract.getMembershipAddressById(id);
}

export async function minter_getMembershipIdForAddress(address) {
    return await minterContract.membershipMap(address);
}