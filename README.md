# dctrl.wtf front page
https://dctrl.wtf/

This is the main website of DCTRL.

## Hosting
The website is hosted on Vercel and the domain is handled by namecheap.

## To get started
```
yarn install
yarn start
```

### code structure
This is a React App built in Javascript using some MUI elements.

- `/src/App.js` is the home page.
- `/src/Membership` is the Membership page that handles DCTRL Memberships and Fobs
- `/src/Admin/` is a password-protected Admin page to manage DCTRL memerships and Fobs. Both `Membership` and `Admin` reuse the same smart contract logic at `src/Membership/API/blockchain.js`.

In production, this everything is running against Sepolia Testnet.
For development, you can spin up a local hardhat environment by deploying `./scripts/deploy.js` found at https://github.com/ori-wagmi/DCTRLMEMBERSHIP.

## Membership page: `.env` file
Necessary for the Membership feature. Create a `.env` file with the following values:
```
REACT_APP_LARGEPRIME = ""
REACT_APP_COVALENT_CLIENTID = ""
REACT_APP_PRIV_KEY = <custodial private key used to sign transactions for the user>
REACT_APP_SEPOLIA_RPC = "https://1rpc.io/sepolia" | "http://127.0.0.1:8545/"
REACT_APP_MINTER_ADDRESS = ""
REACT_APP_FOB_ADDRESS = ""
REACT_APP_MEMBERSHIP_ADDRESS = ""
```
