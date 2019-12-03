pragma solidity ^0.5.0;

// 0. class == contract みたいなもの
contract SimpleStorage {
  // 1. ここに記述するものはブロックチェーン上に保存される
  mapping (address => string) todos;
  uint costToRemoveTodos = 1.0 ether;

  // 2. public な関数だと、web から呼び出すことができる！
  function setTodos(string memory _json) public {
    uint lengthBefore = bytes(getTodos()).length;
    uint lengthAfter = bytes(_json).length;
    require(lengthBefore <= lengthAfter, "Deleting todos is not supported in this method.");

    // 3. ブロックチェーンに保存するコードはこれだけでOK
    // msg.sender は関数を呼び出しユーザーのID(アドレス)
    todos[msg.sender] = _json;
  }

  // 4. view をつけると読み込みのみになり、タダで呼び出せる
  function getTodos() public view returns (string memory) {
    return todos[msg.sender];
  }

  // 5. payable をつけると関数実行時に課金できる！
  function deleteTodos() public payable {
    require(msg.value == costToRemoveTodos, "Deleting Todos needs ethereum.");

    todos[msg.sender] = "[]";
  }
}
