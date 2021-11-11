const Web3 = require("web3")
const HDWalletProvider = require("@truffle/hdwallet-provider")
const accObj = require("./Wallets.json")
const abiObj = require("./StorageABI")



async function contractProvider(privKey){
    const provider = new HDWalletProvider(privKey, "https://speedy-nodes-nyc.moralis.io/7e9361d53693a6e439879bb5/polygon/mumbai")
    const web3 = new Web3(provider)
    const Store = await new web3.eth.Contract(abiObj, "0xf708b6cF26f47198eC6C6bA69971ED38DEA89441")
    return {web3,Store}
}

async function depositFunds(){
    var sum = 0
    for(const a of accObj.obj) {
        var {web3,Store} = await contractProvider(a.privKey)
        var balance = await web3.eth.getBalance(a.address)
        if (Number(balance) > 0){

            balance = (Number(balance) - Number(web3.utils.toWei("0.0001", "ether"))).toString()
            Store.methods.deposit().send({from: a.address, value: balance}).then((hash) => {
                if(hash.status){
                    console.log("Success")
                }
            }).catch((e) => {
                console.log("Error")
            })
        }
    }
}

async function testDeposit(){
    var {web3,Store} = await contractProvider("0x753365ca6454259e15cb2b755e2071d18b032f2171e4d94ca77a88e30f455f76")
    var balance = await web3.eth.getBalance("0x052C2C6b818ff22e971F04162b3Cf074f32DF0C8")
    balance = Number(balance) - Number(web3.utils.toWei("0.001", "ether"))
    console.log(balance)
    try{
        Store.methods.deposit().send({from: "0x052C2C6b818ff22e971F04162b3Cf074f32DF0C8", value: "1400000000000000000"})
    } catch (e){
        console.log(e)
    }
    
}

depositFunds()
//testDeposit()