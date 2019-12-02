pragma solidity ^0.5.0;

contract SimpleStorage {
  mapping (address => string) todos;

  function setTodos(string memory _json) public {
    todos[msg.sender] = _json;
  }

  function getTodos() public view returns (string memory) {
    return todos[msg.sender];
  }
}
