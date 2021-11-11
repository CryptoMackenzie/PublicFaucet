// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;



import "@openzeppelin/contracts/access/Ownable.sol";

contract FundStorage is Ownable{
    
    mapping (address => bool) public whitelist;
    mapping (address => bool) public operators;
    mapping (address => uint256) public withdrawals;
    mapping (address => uint256) public limits;
    
    event Deposit(address, uint256);
    event Withdraw(address, uint256);

    modifier onlyOperator() {
        require(operators[msg.sender] == true, "Not operator");
        _;
    } 

    constructor() {
        operators[msg.sender] = true;
        whitelist[msg.sender] = true;
        limits[msg.sender] = type(uint256).max;
    }
    
    function addOperators(address operator) external onlyOwner {
        operators[operator] = true;
    }

    function addToWhitelist(address benificiary) external onlyOperator {
        whitelist[benificiary] = true;
    }

    function banAccount(address benificiary) external onlyOperator {
        whitelist[benificiary] = false;
    }
    
    function setLimit(address benificiary, uint256 limit) external onlyOperator {
        limits[benificiary] = limit;
    }

    function deposit() payable external {
        
        emit Deposit(msg.sender,msg.value);
        
    }
    
    function withdraw(address benificiary, uint256 amount) external{
        require(whitelist[benificiary] == true, "Not whitelisted");
        require(limits[benificiary] >= amount && address(this).balance >= amount, "Exceeds allowed limits, please contact operator");

        emit Withdraw(benificiary, amount);
        payable(benificiary).transfer(amount);
        
    }
}