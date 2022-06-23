// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0 || ^0.6.0 || ^0.7.0 || ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AsadToken is ERC20, Ownable {
    constructor() ERC20("AsadToken", "ASD") {}


    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}