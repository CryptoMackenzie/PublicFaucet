// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;



import "@openzeppelin/contracts/access/Ownable.sol";

contract FundStorage is Ownable{
    
    address public Wallet;
    
    event Deposit(address, uint256);
    event Withdraw(address, uint256);
    
    constructor() {
        Wallet = msg.sender;
    }
    
    
    function deposit() payable external {
        
        emit Deposit(msg.sender,msg.value);
        
    }
    
    function withdraw(address benificiary) external{
        
        emit Withdraw(benificiary, address(this).balance);
        payable(benificiary).transfer(address(this).balance);
        
    }
}