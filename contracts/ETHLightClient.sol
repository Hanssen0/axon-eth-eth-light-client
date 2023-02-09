// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract ETHLightClient {
  event ValidateResult(bool isValid);

  function isValid(uint256 timestamp, bytes32 blockHash) public {
    (bool success, bytes memory data) = address(0x87).call(abi.encode(timestamp, blockHash));

    emit ValidateResult(data[0] == 0);
  }
}