import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import SnakeComponent from "./components/SnakeComponent";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" render={props => <App {...props} />} />
      <Route
        path="/start-game"
        render={props => <SnakeComponent {...props} />}
      />
    </div>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
