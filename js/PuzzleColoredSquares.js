import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updatePuzzleStatus} from '../store';
import {
  ViroFlexView,
  ViroMaterials,
  ViroQuad,
  ViroText,
  ViroNode,
  ViroSound,
} from 'react-viro';

class PuzzleColoredSquares extends Component {
  constructor() {
    super();
    this.state = {
      gameBoard: this.makeBoard(6, 6),
      secretCodeDigit: 1,
    };

    this.clickSquare = this.clickSquare.bind(this);
  }

  makeBoard = (height, width) => {
    let newBoard = [];
    for (let i = 0; i < height; i++) {
      let row = [];

      for (let j = 0; j < width; j++) {
        let sqr = Math.round(Math.random());

        row.push(sqr); //need code to guard against board being comlpeted at start
      }
      newBoard.push(row);
    }
    return newBoard;
  };

  clickSquare(r, c) {
    return function() {
      const boardCopy = [...this.state.gameBoard];

      boardCopy[r][c] = boardCopy[r][c] ? 0 : 1;
      if (c < 5) {
        boardCopy[r][c + 1] = boardCopy[r][c + 1] ? 0 : 1;
      }
      if (c > 0) {
        boardCopy[r][c - 1] = boardCopy[r][c - 1] ? 0 : 1;
      }
      if (r < 5) {
        boardCopy[r + 1][c] = boardCopy[r + 1][c] ? 0 : 1;
      }
      if (r > 0) {
        boardCopy[r - 1][c] = boardCopy[r - 1][c] ? 0 : 1;
      }

      this.setState({gameBoard: boardCopy});
      this.checkSolved(boardCopy);
    };
  }
  //http://perfectweb.org/ddo/solver/vale_puzzle.html for solutions!!!

  checkSolved = board => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === 0) {
          return false;
        }
      }
    }

    this.props.updatePuzzleStatus('colorBlock');
  };

  render() {
    return (
      <ViroNode shadowCastingBitMask={2}>
        <ViroFlexView
          position={[-3.8, -0.8, 0]}
          rotation={[0, 90, 0]}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          width={1.2}
          height={1.2}
          backgroundColor="transparent"
          shadowCastingBitMask={2}>
          {this.props.lightOn || !this.props.solved ? (
            this.state.gameBoard.map((row, rowIdx) => {
              return (
                <ViroFlexView
                  key={`row${rowIdx}`}
                  style={{flexDirection: 'row'}}
                  width={1.2}
                  height={0.2}>
                  {row.map((tile, colIdx) => {
                    return (
                      <ViroQuad
                        key={`tile${colIdx}`}
                        width={0.2}
                        height={0.2}
                        materials={
                          tile === 1 ? ['redSquare'] : ['yellowSquare']
                        }
                        onClick={
                          this.props.solved === true
                            ? null
                            : this.clickSquare(rowIdx, colIdx).bind(this)
                        }
                        shadowCastingBitMask={2}
                      />
                    );
                  })}
                </ViroFlexView>
              );
            })
          ) : (
            <ViroFlexView
              materials={['helpme']}
              width={1.2}
              height={1.2}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ViroText
                text={this.props.codeDigit}
                color="red"
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 32,
                }}
              />
            </ViroFlexView>
          )}
        </ViroFlexView>
        {this.props.solved && (
          <ViroSound
            source={require('./sounds/female_scream.wav')}
            loop={false}
          />
        )}
      </ViroNode>
    );
  }
}

ViroMaterials.createMaterials({
  redSquare: {
    diffuseTexture: require('./res/ColoredSquares/redSquare.png'),
    lightingModel: 'Blinn',
  },
  yellowSquare: {
    diffuseTexture: require('./res/ColoredSquares/yellowSquare.png'),
    lightingModel: 'Blinn',
  },
  helpme: {
    diffuseTexture: require('./res/ColoredSquares/helpme.png'),
  },
});

const mapStateToProps = state => ({
  codeDigit: state.game.lockCombo[0],
  lightOn: state.game.lightOn,
  solved: state.game.puzzles.colorBlock.complete,
});

const mapDispatchToProps = dispatch => ({
  updatePuzzleStatus: puzzle => dispatch(updatePuzzleStatus(puzzle)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PuzzleColoredSquares);
