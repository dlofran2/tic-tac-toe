import React, { Component } from 'react';
import styles from './App.module.scss';

class App extends Component {
  state = {
    board: [
      '', '', '',
      '', '', '',
      '', '', '',
    ],
    turn: 'x',
    turns: 0,
    enabled: true,
    winOverlay: false,
    xWins: 0,
    oWins: 0,
  };

  update = (location) => {
    if (this.state.board[location] === '' && this.state.enabled) {
      this.setState(
        ({ board, turn }) => ({
          board: [...board.slice(0, location), turn, ...board.slice(location + 1)]
        })
      );
    }
    if (this.checkWin(location)) {
      this.setState(
        ({ turn, xWins, oWins }) => ({
          enabled: false,
          winOverlay: true,
          xWins: turn === 'x' ? xWins + 1 : xWins,
          oWins: turn === 'o' ? oWins + 1 : oWins,
        })
      );
    } else {
      this.setState(
        ({ turn, turns }) => ({
          turn: turns === 8 ? 'c' : turn === 'x' ? 'o' : 'x',
          turns: turns + 1,
          winOverlay: turns === 8 ? true : false,
        })
      );
    }
  };

  checkWin = (location) => {
    const { board, turn } = this.state;

    // location = 3column + row
    const column = location % 3;
    const row = (location - column) / 3;
    let count = 0;

    // check row
    for (let i = 0; i < 3; i++) {
      let current = (row * 3) + i;
      if (board[current] === turn || current === location) {
        count++;
        if (count === 3) return true;
      }
      else {
        count = 0;
        break;
      }
    }

    // check column
    for (let i = 0; i < 3; i++) {
      let current = (3 * i) + column;
      if (board[current] === turn || current === location) {
        count++;
        if (count === 3) return true;
      }
      else {
        count = 0;
        break;
      }
    }

    // check diagonals
    if (location % 2 === 0) {
      for (let i = 0; i < 3; i++) {
        let current = (3 * i) + i; // diagonal
        if (board[current] === turn || current === location) {
          count++;
          if (count === 3) return true;
        }
        else {
          count = 0;
          break;
        }
      }

      for (let i = 0; i < 3; i++) {
        let current = (3 * i) + (3 - 1 - i); // reverse diagonal
        if (board[current] === turn || current === location) {
          count++;
          if (count === 3) return true;
        }
        else {
          count = 0;
          break;
        }
      }
    }

    this.setState(count => ({ count: count + 1 }));
    return false;
  }

  clear = () => {
    this.setState(
      () => ({
        board: [
          '', '', '',
          '', '', '',
          '', '', '',
        ],
        turn: 'x',
        turns: 0,
        enabled: true,
        winOverlay: false,
      }),
    );
  };

  render() {
    const { turn, board, winOverlay, xWins, oWins } = this.state;
    const scoreRender = `X wins: ${xWins} Circle wins: ${oWins}`;

    return (
      <div className={styles.appContainer}>
        <WinOverlay show={winOverlay} winner={turn} clear={this.clear} />
        <h1>Tic Tac Toe</h1>
        <h2>{scoreRender}</h2>
        <button onClick={this.clear}>clear board</button>
        <div className={styles.ticTacToeContainer}>
          {
            board.map((item, idx) =>
              <Box
                key={idx}
                onClick={this.update}
                data={board[idx]}
                turn={turn}
                location={idx}
              />)
          }
        </div>
      </div>
    );
  }
}

const Box = ({ onClick, data, location }) => (
  <div className={styles.box} onClick={() => onClick(location)}>
    {data}
  </div>
);

const WinOverlay = ({ show, winner, clear }) => {
  let text;
  if (winner === 'c') {
    text = 'Cats game!';
  } else {
    text = `${winner} won!`
  }
  if (show) {
    return (
      <div className={styles.winOverlay}>
        <div className={styles.innerWinContainer}>
          <h1>{text}</h1>
          <button onClick={clear}>Play again?</button>
        </div>
      </div>
    );
  }

  return null;
};

export default App;
