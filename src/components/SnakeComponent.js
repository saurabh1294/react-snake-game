import React, { Component } from "react";
import "../Game.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class SnakeComponent extends Component {
  state = {
    tickTime: 500,
    rows: 25,
    cols: 25,
    grid: [],
    food: {},
    snake: {
      head: {},
      tail: []
    },
    currentDirection: "right",
    die: false,
    score: 0,
    scoreFactor: 10
  };

  difficulty = 0;

  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  getRandomGrid() {
    return {
      row: Math.floor(Math.random() * this.state.rows),
      col: Math.floor(Math.random() * this.state.cols)
    };
  }

  // TODO: snake and food begins at the center
  getCenterOfGrid() {
    return {
      row: Math.floor((this.state.rows - 1) / 2),
      col: Math.floor((this.state.cols - 1) / 2)
    };
  }

  resetGrid(state = {}, sendBack = false) {
    if (!Object.keys(state).length) {
      state = this.state;
    }

    const grid = [];
    const { rows, cols, food, snake } = state;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isFood = food.row === row && food.col === col;
        const isHead = snake.head.row === row && snake.head.col === col;
        let isTail = false;
        snake.tail.forEach(t => {
          if (t.row === row && t.col === col) {
            isTail = true;
          }
        });

        grid.push({
          row,
          col,
          isFood,
          isHead,
          isTail
        });
      }
    }

    if (sendBack) {
      return grid;
    } else {
      this.setState({
        grid
      });
    }
  }

  gameTick() {
    this.setState(state => {
      let { currentDirection, snake, food } = state;
      let { tail } = snake;

      const { row, col } = state.snake.head;
      let head = {
        row,
        col
      };

      // When game ove is shown, stop the tick
      if (state.die) {
        clearInterval(window.fnInterval);
      }

      // Snake eats
      tail.unshift({
        row: head.row,
        col: head.col
      });

      // Snake does potty, only when not eating
      if (head.row === state.food.row && head.col === state.food.col) {
        food = this.getRandomGrid();
      } else {
        tail.pop();
      }

      // Snake moves head
      switch (currentDirection) {
        case "left":
          head.col--;
          break;

        case "up":
          head.row--;
          break;

        case "down":
          head.row++;
          break;

        case "right":
        default:
          head.col++;
          break;
      }

      const newState = {
        ...state,
        food,
        snake: {
          head,
          tail
        }
      };

      // In new state, check if die conditions are met
      let die = false;
      if (
        newState.snake.head.row < 0 ||
        newState.snake.head.row >= this.state.rows ||
        newState.snake.head.col < 0 ||
        newState.snake.head.col >= this.state.rows
      ) {
        die = true;
      }

      const grid = this.resetGrid(newState, true);
      const score = newState.snake.tail.length * newState.scoreFactor;

      return {
        ...newState,
        die,
        grid,
        score
      };
    });
  }

  handleKeyPress(e) {
    let { currentDirection } = this.state;

    switch (e.keyCode) {
      case 37:
        currentDirection = "left";
        break;

      case 38:
        currentDirection = "up";
        break;

      case 39:
      default:
        currentDirection = "right";
        break;

      case 40:
        currentDirection = "down";
        break;
    }

    const newState = {
      ...this.state,
      currentDirection
    };
    const grid = this.resetGrid(newState, true);

    this.setState(state => {
      return {
        ...newState,
        grid
      };
    });
  }

  componentWillMount(props) {
    const { difficulty } = this.props;
    this.difficulty = difficulty;

    switch (this.props.location.state.level.difficulty) {
      case "0":
        console.log("setting level easy");
        this.setState(
          {
            tickTime: 400,
            scoreFactor: 10
          },
          () => this.startGame()
        );
        break;

      case "1":
        console.log("setting level medium");
        this.setState(
          {
            tickTime: 300,
            scoreFactor: 15
          },
          () => this.startGame()
        );
        break;

      case "2":
        console.log("setting level difficult");
        this.setState(
          {
            tickTime: 200,
            scoreFactor: 20
          },
          () => this.startGame()
        );
        break;

      default:
        console.log("Level not selected");
        break;
    }

    document.body.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.handleKeyPress);
    clearInterval(window.fnInterval);
  }

  startGame() {
    document.body.addEventListener("keydown", this.handleKeyPress);

    this.setState(state => {
      const newState = {
        ...state,
        food: this.getRandomGrid(),
        snake: {
          head: this.getCenterOfGrid(),
          tail: state.snake.tail
        }
      };
      const grid = this.resetGrid(newState, true);
      return {
        ...newState,
        grid
      };
    });

    this.resetGrid();

    // Set tick
    window.fnInterval = setInterval(() => {
      this.gameTick();
    }, this.state.tickTime);
  }

  restartGame() {
    document.body.removeEventListener("keydown", this.handleKeyPress);
    clearInterval(window.fnInterval);
    this.props.history.push("/");
  }

  render() {
    if (this.difficulty !== -1) {
      let gridContent = this.state.grid.map(grid => {
        return (
          <div
            key={grid.row.toString() + "-" + grid.col.toString()}
            className={
              grid.isHead
                ? "snake-grid-item is-head"
                : grid.isTail
                  ? "snake-grid-item is-tail"
                  : grid.isFood
                    ? "snake-grid-item is-food"
                    : "snake-grid-item"
            }
          />
        );
      });

      if (this.state.die) {
        gridContent = (
          <div className="grid-message">
            <h1>Game Over</h1>
            <button
              type="button"
              className="btn btn-info"
              onClick={this.restartGame.bind(this)}
            >
              Start Again
            </button>
          </div>
        );
      }
      return (
        <div className="snake-container wrapper">
          <div className="grid-header">
            <h1>Your score: {this.state.score}</h1>
          </div>
          <div className="snake-grid">{gridContent}</div>
          <button className="btn btn-info" onClick={() => this.restartGame()}>
            Back
          </button>
        </div>
      );
    }
  }
}
