const Web3 = require("web3")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const fs = require('fs');
const axios = require("axios")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const accObj = require("./Wallets.json")
const abiObj = require("./StorageABI")


async function createAccount() {
    const web3 = nullWeb3Provider()
    for(i=0;i<=200;i++){
        var wallet = await web3.eth.accounts.create(["NeQ7MufPgwJxMqqbswKtpyo3tlodofTA"])
        var obj = {address: wallet.address, privKey: wallet.privateKey}
        accArray.push(obj)
    }
    storeWallets(accArray)
    
}

function storeWallets(obj) {
    const jsonObj = {obj}
    const lok = JSON.stringify(jsonObj)

     
    fs.writeFile("Wallets.json", lok, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    
        console.log("JSON file has been saved.");
    });

}

function nullWeb3Provider() {
    const web3 = new Web3(new Web3.providers.HttpProvider("wss://speedy-nodes-nyc.moralis.io/7e9361d53693a6e439879bb5/polygon/mumbai/ws"))
    return web3
}

async function WalletProvider(privKey) {
    const provider = new HDWalletProvider(privKey, "wss://speedy-nodes-nyc.moralis.io/7e9361d53693a6e439879bb5/polygon/mumbai/ws")
    const web3 = new Web3(provider)
    return web3
}

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function contractProvider(privKey){
    const provider = new HDWalletProvider(privKey, "wss://speedy-nodes-nyc.moralis.io/7e9361d53693a6e439879bb5/polygon/mumbai/ws")
    const web3 = new Web3(provider)
    const Store = await new web3.eth.Contract(abiObj, "0xc520504Ed63218AeCA00fe465ACd95c1B81b8920")
    return {web3,Store}
}

async function reqFunds(){
    for (const a of accObj.obj){
        let count = 0
        let postObj = {
            address: a.address,
            network: "mumbai",
            token:"maticToken"
        }
        console.log(`Trying ${a.address}`)
        var res = await axios.post("https://api.faucet.matic.network/transferTokens",postObj)
        while(res.data.error){
            res = await axios.post("https://api.faucet.matic.network/transferTokens",postObj)

        }
        var {web3,Store} = await contractProvider(a.privKey)
        var balance = await web3.eth.getBalance(a.address)
        if (Number(balance) > 0){

            balance = (Number(balance) - Number(web3.utils.toWei("0.0003", "ether"))).toString()
            Store.methods.deposit().send({from: a.address, value: balance}).then((hash) => {
                if(hash.status){
                    console.log("Transfer Success")
                }
            }).catch((e) => {
                console.log(e)
            })
        }
        console.log("SUCCESS")
        await sleep(2000);
    }
}
async function showFunds(){
    for (const a of accObj.obj){
        WalletProvider(a.privKey)
    }
}
//createAccount()
reqFunds()
//showFunds()
function test() {
    const postObj = {"network":"mumbai","address":"0x81d41e24796A0Ff8D3D43cf55dc5fd9eF793949e","token":"maticToken"}

    const config = {
        "method": "POST",
        "headers": {
            'Content-Type': 'application/json'
        },
        "body": JSON.stringify(postObj)
    }
    
    fetch("https://api.faucet.matic.network/transferTokens",config).then((res) =>console.log(res))

    
}

async function repeater(){
    const postObj = {"network":"mumbai","address":"0x81d41e24796A0Ff8D3D43cf55dc5fd9eF793949e","token":"maticToken"}

    const i = true
    while(i){
        console.log("starting")
        var res = await axios.post("https://api.faucet.matic.network/transferTokens",postObj)
        while(res.data.error){
            res = await axios.post("https://api.faucet.matic.network/transferTokens",postObj)
            console.log(res.data.error)
        }
        console.log("SUCCESS")
        console.log("WAITING")
        await sleep(60000)
    }
}

async function depositer(){
    for (const a of accObj.obj){
        let web3 = await WalletProvider(a.privKey)
        var balance = await web3.eth.getBalance(a.address)
        
    }
}


//test()
//repeater()
