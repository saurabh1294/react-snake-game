import React from "react";
import logo from "./assets/logo.ico";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { withRouter } from "react-router-dom";

class App extends React.Component {
  state = {
    toughness: -1
  };

  startGame(path) {
    this.props.history.push(path, {
      level: { difficulty: this.state.toughness }
    });
  }

  render() {
    return (
      <div className="App">
        <h2 className="header"> Snake Game</h2>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="info-box">
          <input
            type="radio"
            name="level"
            id="easy"
            value="0"
            onChange={this.level.bind(this)}
          />
          <label htmlFor="easy">Easy</label>
          <br />
          <input
            type="radio"
            name="level"
            id="Medium"
            value="1"
            onChange={this.level.bind(this)}
          />
          <label htmlFor="Medoum">Medium</label>
          <br />
          <input
            type="radio"
            name="level"
            id="Dfficult"
            value="2"
            onChange={this.level.bind(this)}
          />
          <label htmlFor="Difficult">Difficult</label>
          <br />
        </div>
        <button
          className="btn btn-info"
          onClick={() => this.startGame("/start-game")}
        >
          Start Game
        </button>
      </div>
    );
  }

  level(event) {
    console.log(event.target.value);
    this.setState({ toughness: event.target.value });
  }
}

export default withRouter(App);
