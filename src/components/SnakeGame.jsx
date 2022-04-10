import { Component } from "react";

let BOARD = [...Array(30)]
  .map(_ => Array(30).fill('empty'));

const DIRECTION_MAP = {
  "u": "ArrowUp",
  "d": "ArrowDown",
  "r": "ArrowRight",
  "l": "ArrowLeft"
};

const OPPOSITE_DIRECTIONS = {
  "ArrowUp": "ArrowDown",
  "ArrowDown": "ArrowUp",
  "ArrowRight": "ArrowLeft",
  "ArrowLeft": "ArrowRight"
}

export default class SnakeGame extends Component {
  constructor() {
    super();
    this.state = {
      INITIAL_BOARD: JSON.parse(JSON.stringify(BOARD)),
      BOARD,
      SNAKE_BODY: [],
      FOOD: {},
      dir: ""
    };
  }

  componentDidMount() {
    let { BOARD, SNAKE_BODY } = this.state;
    BOARD[0][0] = "snake";

    SNAKE_BODY.push({ curr_i: 0, curr_j: 0 });
    document.addEventListener("keydown", (event) => {
      this.eventHandler(event.code);
    });
    this.setState({
      BOARD,
      SNAKE_BODY
    }, () => {
      this.interval = setInterval(() => {
        let { dir, BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD } = this.state;

        if (SNAKE_BODY.length === (BOARD.length * BOARD[0].length)) {
          this.setState({ BOARD: INITIAL_BOARD });
          return;
        }
        if (dir) {
          let moveSnakeResponse = this.moveSnake(DIRECTION_MAP[dir], BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD);
          let createFoodResponse = this.createFood(
            moveSnakeResponse.FOOD,
            moveSnakeResponse.BOARD,
            moveSnakeResponse.SNAKE_BODY
          );
          this.setState({
            dir: moveSnakeResponse.dir,
            BOARD: createFoodResponse.BOARD,
            SNAKE_BODY: createFoodResponse.SNAKE_BODY,
            FOOD: createFoodResponse.FOOD
          })
        }
      }, 90)
    });
  }

  grid_board = (BOARD) => {
    let g_b = [];
    BOARD.forEach((ele, i) => {
      let g_b_r = [];
      ele.forEach((val, j) => {
        g_b_r.push(
          <li className={`${val}`} key={`${i}-${j}`}></li>
        );
      });
      g_b.push(
        <ul key={`${i}`}>
          {g_b_r}
        </ul>
      )
    });

    return g_b;
  }

  getRandomIndex = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  eventHandler = (key) => {
    let { dir, BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD } = this.state;
    if (DIRECTION_MAP[dir] === key) return;
    if (OPPOSITE_DIRECTIONS[DIRECTION_MAP[dir]] === key) return;
    let moveSnakeResponse = this.moveSnake(key, BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD);
    if (moveSnakeResponse) {
      this.setState({
        dir: moveSnakeResponse.dir,
        BOARD: moveSnakeResponse.BOARD,
        SNAKE_BODY: moveSnakeResponse.SNAKE_BODY,
        FOOD: moveSnakeResponse.FOOD
      })
    }
  }

  moveSnake = (key, BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD) => {
    switch (key) {
      case "ArrowLeft":
        return this.moveLeft(BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD);

      case "ArrowUp":
        return this.moveUp(BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD);

      case "ArrowRight":
        return this.moveRight(BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD);

      case "ArrowDown":
        return this.moveDown(BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD);

      default:
        break;
    }
  }

  moveUp = (BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD) => {
    BOARD = JSON.parse(JSON.stringify(INITIAL_BOARD));
    let prev_i, prev_j;
    let prev_last;
    for (let indx in SNAKE_BODY) {

      let { curr_i, curr_j } = SNAKE_BODY[indx];

      if (Number(indx) === SNAKE_BODY.length - 1) {
        prev_last = JSON.parse(JSON.stringify(SNAKE_BODY[indx]))
      }

      if (Number(indx) === 0) {
        prev_i = curr_i;
        prev_j = curr_j;
        if (curr_i === 0) {
          curr_i = BOARD.length - 1;
        } else {
          curr_i -= 1;
        }
        BOARD[curr_i][curr_j] = "snake";
        SNAKE_BODY[indx] = { curr_i, curr_j };
      } else {
        SNAKE_BODY[indx] = { curr_i: prev_i, curr_j: prev_j };
        BOARD[prev_i][prev_j] = "snake";
        prev_i = curr_i;
        prev_j = curr_j;
      }
    }

    if (
      FOOD.curr_i && FOOD.curr_j &&
      FOOD.curr_i === SNAKE_BODY['0'].curr_i && FOOD.curr_j === SNAKE_BODY['0'].curr_j
    ) {
      SNAKE_BODY.push(prev_last);
      FOOD = {
        curr_i: null,
        curr_j: null
      }
    }

    return { BOARD, SNAKE_BODY, dir: "u", FOOD };
  }

  moveDown = (BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD) => {
    BOARD = JSON.parse(JSON.stringify(INITIAL_BOARD));
    let prev_i, prev_j;
    let prev_last;
    for (let indx in SNAKE_BODY) {

      let { curr_i, curr_j } = SNAKE_BODY[indx];

      if (Number(indx) === SNAKE_BODY.length - 1) {
        prev_last = JSON.parse(JSON.stringify(SNAKE_BODY[indx]))
      }

      if (Number(indx) === 0) {
        prev_i = curr_i;
        prev_j = curr_j;
        if (curr_i === BOARD.length - 1) {
          curr_i = 0;
        } else {
          curr_i += 1;
        }
        BOARD[curr_i][curr_j] = "snake";
        SNAKE_BODY[indx] = { curr_i, curr_j };
      } else {
        SNAKE_BODY[indx] = { curr_i: prev_i, curr_j: prev_j };
        BOARD[prev_i][prev_j] = "snake";
        prev_i = curr_i;
        prev_j = curr_j;
      }
    }

    if (
      FOOD.curr_i && FOOD.curr_j &&
      FOOD.curr_i === SNAKE_BODY['0'].curr_i && FOOD.curr_j === SNAKE_BODY['0'].curr_j
    ) {
      SNAKE_BODY.push(prev_last);
      FOOD = {
        curr_i: null,
        curr_j: null
      }
    }

    return { BOARD, SNAKE_BODY, dir: "d", FOOD };
  }

  moveLeft = (BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD) => {
    BOARD = JSON.parse(JSON.stringify(INITIAL_BOARD));
    let prev_i, prev_j;
    let prev_last;
    for (let indx in SNAKE_BODY) {

      let { curr_i, curr_j } = SNAKE_BODY[indx];

      if (Number(indx) === SNAKE_BODY.length - 1) {
        prev_last = JSON.parse(JSON.stringify(SNAKE_BODY[indx]))
      }

      if (Number(indx) === 0) {
        prev_i = curr_i;
        prev_j = curr_j;
        if (curr_j === 0) {
          curr_j = BOARD[curr_i].length - 1;
        } else {
          curr_j -= 1;
        }
        BOARD[curr_i][curr_j] = "snake";
        SNAKE_BODY[indx] = { curr_i, curr_j };
      }
      else {
        SNAKE_BODY[indx] = { curr_i: prev_i, curr_j: prev_j };
        BOARD[prev_i][prev_j] = "snake";
        prev_i = curr_i;
        prev_j = curr_j;
      }
    }

    if (
      FOOD.curr_i && FOOD.curr_j &&
      FOOD.curr_i === SNAKE_BODY['0'].curr_i && FOOD.curr_j === SNAKE_BODY['0'].curr_j
    ) {
      SNAKE_BODY.push(prev_last);
      FOOD = {
        curr_i: null,
        curr_j: null
      }
    }

    return { BOARD, SNAKE_BODY, dir: "l", FOOD };
  }

  moveRight = (BOARD, SNAKE_BODY, INITIAL_BOARD, FOOD) => {
    BOARD = JSON.parse(JSON.stringify(INITIAL_BOARD));
    let prev_i, prev_j;
    let prev_last;
    for (let indx in SNAKE_BODY) {

      let { curr_i, curr_j } = SNAKE_BODY[indx];

      if (Number(indx) === SNAKE_BODY.length - 1) {
        prev_last = JSON.parse(JSON.stringify(SNAKE_BODY[indx]))
      }

      if (Number(indx) === 0) {
        prev_i = curr_i;
        prev_j = curr_j;
        if (curr_j === BOARD[curr_i].length - 1) {
          curr_j = 0;
        } else {
          curr_j += 1;
        }
        BOARD[curr_i][curr_j] = "snake";
        SNAKE_BODY[indx] = { curr_i, curr_j };
      }
      else {
        SNAKE_BODY[indx] = { curr_i: prev_i, curr_j: prev_j };
        BOARD[prev_i][prev_j] = "snake";
        prev_i = curr_i;
        prev_j = curr_j;
      }
    }

    if (
      FOOD.curr_i && FOOD.curr_j &&
      FOOD.curr_i === SNAKE_BODY['0'].curr_i && FOOD.curr_j === SNAKE_BODY['0'].curr_j
    ) {
      SNAKE_BODY.push(prev_last);
      FOOD = {
        curr_i: null,
        curr_j: null
      }
    }

    return { BOARD, SNAKE_BODY, dir: "r", FOOD };
  }

  createFood = (FOOD, BOARD, SNAKE_BODY) => {
    if (!(FOOD.curr_i && FOOD.curr_j)) {
      let r_i = this.getRandomIndex(BOARD.length - 1, 0);
      let r_j = this.getRandomIndex(BOARD[0].length - 1, 0);
      FOOD = {
        curr_i: r_i,
        curr_j: r_j
      }
    }
    BOARD[FOOD.curr_i][FOOD.curr_j] = 'food';
    return { FOOD, BOARD, SNAKE_BODY };
    // let newFood = true;
    // if (FOOD.curr_i && FOOD.curr_j) {
    //   newFood = false;
    //   BOARD[FOOD.curr_i][FOOD.curr_j] = "food";
    // }
    // while (newFood) {
    //   let is_inside = false;
    //   let r_i = this.getRandomIndex(BOARD.length - 1, 0);
    //   let r_j = this.getRandomIndex(BOARD[0].length - 1, 1);
    //   for (let obj of SNAKE_BODY) {
    //     if (obj.curr_i === r_i && obj.curr_j === r_j) {
    //       is_inside = true;
    //       break;
    //     }
    //   }
    //   if (!is_inside) {
    //     BOARD[r_i][r_i] = 'food';
    //     FOOD = {
    //       curr_i: r_i,
    //       curr_j: r_j
    //     }
    //     break;
    //   }
    // }
  }

  render() {
    let { BOARD } = this.state;

    let lis = this.grid_board(BOARD);
    return <div className="test-board">
      {lis}
    </div>;
  }
}