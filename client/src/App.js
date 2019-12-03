import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { todos: [], web3: null, title: "", accounts: null, contract: null };

  constructor() {
    super();
    this.addTodo = this.addTodo.bind(this);
    this.updateTitleInput = this.updateTitleInput.bind(this);
    this.toggleTodo = this.toggleTodo.bind(this);
    this.saveTodos = this.saveTodos.bind(this);
    this.deleteTodos = this.deleteTodos.bind(this);

    this.init();
  }

  init = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.fetchTodos);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  fetchTodos = async () => {
    const { contract } = this.state;
    const response = await contract.methods.getTodos().call();
    this.setState({ ...this.state, todos: JSON.parse(response) });
  };

  addTodo = title =>
    this.setState({
      ...this.state,
      todos: [...this.state.todos, { title, isActive: true }]
    });

  toggleTodo = i => {
    const j = [...this.state.todos];
    j[i].isActive = !j[i].isActive;
    this.setState({ ...this.state, todos: j });
  };

  saveTodos = async () => {
    const { accounts, contract, todos } = this.state;

    await contract.methods
      .setTodos(JSON.stringify(todos))
      .send({ from: accounts[0] });
  };

  deleteTodos = async () => {
    const { accounts, contract, web3 } = this.state;

    await contract.methods
      .deleteTodos()
      .send({ from: accounts[0], value: web3.utils.toWei("1.0", "ether") });
    await this.fetchTodos();
  };

  updateTitleInput = e =>
    this.setState({ ...this.state, title: e.target.value });

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div style={{ width: 500, textAlign: "left" }}>
          <ol
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderStyle: "solid",
              width: 400
            }}
          >
            {this.state.todos &&
              this.state.todos.map((todo, i) => (
                <li
                  key={`${todo.title}:${i}`}
                  onClick={() => this.toggleTodo(i)}
                  style={
                    todo.isActive
                      ? { padding: 10 }
                      : { padding: 10, textDecoration: "line-through" }
                  }
                >
                  {todo.title}
                </li>
              ))}
          </ol>
          <input
            value={this.state.title}
            onChange={e => this.updateTitleInput(e)}
          />
          <button onClick={() => this.addTodo(this.state.title)}>Add</button>
        </div>
        <div>
          <button onClick={() => this.saveTodos()}>Save to Blockchain</button>
          <button onClick={() => this.deleteTodos()}>Delete ALL</button>
        </div>
      </div>
    );
  }
}

export default App;
