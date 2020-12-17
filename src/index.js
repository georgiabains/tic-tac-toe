import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)} />
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					<p></p>
					<p>A</p>
					<p>B</p>
					<p>C</p>
				</div>
				<div className="board-row">
					<p className="board-num">1</p>
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					<p className="board-num">2</p>
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					<p className="board-num">3</p>
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				coordinates: [],
			}],
			stepNumber: 0,
			xIsNext: true
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		const coordinates = current.coordinates.slice();
		const currLocation = this.findCoordinates(i);
		coordinates.push(currLocation);

		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				coordinates: coordinates
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	findCoordinates(i) {
		let col = this.findCol(i);
		let row = this.findRow(i);
		var coordinates = [col, row];
		return coordinates;
	}

	findRow(i) {
		let gameRows = {1: [0, 1, 2], 2: [3, 4, 5], 3: [6, 7, 8]}
		return this._iterateDict(i, gameRows);
	}

	findCol(i) {
		let gameCols = {"A": [0, 3, 6], "B": [1, 4, 7], "C": [2, 5, 8]}
		return this._iterateDict(i, gameCols);
	}

	_iterateDict(input, dictOfList) {
		for (var key in dictOfList) {
			let listNum = dictOfList[key];
			if (listNum.includes(input)) {
				return key;
			}
		}
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const coordinatesCopy = current.coordinates.slice();

		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move + ' (' + coordinatesCopy[move - 1] + ')':
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a]
		}
	}
	return null;
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
