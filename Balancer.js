const Web3 = require("web3")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const fs = require('fs');
const axios = require("axios")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const accObj = require("./Wallets.json")
const accArray = []

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
    const account = await web3.eth.getAccounts()
    var balance = await web3.eth.getBalance(account[0])
    console.log(`${account} : ${web3.utils.fromWei(balance,"ether")}`)
}

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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
        while(res.data.error && count<11){
            await sleep(2000);
            res = await axios.post("https://api.faucet.matic.network/transferTokens",postObj)
        }
        if (count<10){
            console.log(console.log("SUCCESS"))
        }
        await sleep(5000);
    }
}
async function showFunds(){
    for (const a of accObj.obj){
        WalletProvider(a.privKey)
    }
}
//createAccount()
//reqFunds()
showFunds()
function test() {
    const postObj = {"network":"mumbai","address":"0x24ceca00902129620cda14829caa4851ee797d83","token":"maticToken"}

    const config = {
        "method": "POST",
        "headers": {
            'Content-Type': 'application/json'
        },
        "body": JSON.stringify(postObj)
    }
    
    fetch("https://api.faucet.matic.network/transferTokens",config).then((res) =>console.log(res))

    
}
//test()

