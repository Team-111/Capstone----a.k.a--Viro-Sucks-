import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updatePuzzleStatus} from '../store';

import {
  ViroText,
  ViroFlexView,
  ViroMaterials,
  ViroSound,
  ViroNode,
} from 'react-viro';

class Combo extends Component {
  constructor() {
    super();
    this.state = {
      solution: [],
      digits: [0, 0, 0, 0],
    };

    this.handleClick = this.handleClick.bind(this);
    this.checkMatch = this.checkMatch.bind(this);
  }

  componentWillMount() {
    let code = this.props.code.split('');
    code = code.map(digit => +digit);

    this.setState({
      solution: code,
    });
  }

  handleClick(idx) {
    const digitsCopy = [...this.state.digits];
    digitsCopy[idx]++;

    if (digitsCopy[idx] > 9) {
      digitsCopy[idx] = 0;
    }

    const correctCode = this.checkMatch(digitsCopy);
    if (correctCode) this.props.updatePuzzleStatus('combo');

    this.setState({digits: digitsCopy});
  }

  // If a match occurs, the player gets the key
  checkMatch(digits) {
    for (let i = 0; i < digits.length; i++) {
      if (digits[i] !== this.state.solution[i]) {
        return false;
      }
    }
    return true;
  }

  render() {
    return (
      <ViroNode shadowCastingBitMask={2}>
        <ViroFlexView
          backgroundColor="black"
          width={0.3}
          height={1.2}
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          position={[0, -0.5, 3.2]}
          rotation={[0, 180, 0]}
          shadowCastingBitMask={2}>
          {this.state.digits.map((digit, idx) => {
            return (
              <ViroFlexView
                key={`digit${idx}`}
                materials={[`combo${idx}`]}
                width={0.3}
                height={0.3}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 0.1,
                }}
                onClick={
                  !this.props.solved ? () => this.handleClick(idx) : () => {}
                }
                shadowCastingBitMask={2}>
                <ViroText
                  color="red"
                  height={0.3}
                  width={0.3}
                  textAlign="center"
                  textAlignVertical="center"
                  text={digit.toString()}
                  shadowCastingBitMask={2}
                />
              </ViroFlexView>
            );
          })}
        </ViroFlexView>
        {this.props.solved && (
          <ViroSound
            source={require('./sounds/horror_stab.mp3')}
            loop={false}
          />
        )}
      </ViroNode>
    );
  }
}

ViroMaterials.createMaterials({
  combo0: {
    diffuseTexture: require('./res/combo0.jpg'),
  },
  combo1: {
    diffuseTexture: require('./res/combo1.jpg'),
  },
  combo2: {
    diffuseTexture: require('./res/combo2.jpg'),
  },
  combo3: {
    diffuseTexture: require('./res/combo3.jpg'),
  },
});

const mapStateToProps = state => ({
  code: state.game.lockCombo,
  solved: state.game.puzzles.combo.complete,
});

const mapDispatchToProps = dispatch => ({
  updatePuzzleStatus: puzzle => dispatch(updatePuzzleStatus(puzzle)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Combo);
