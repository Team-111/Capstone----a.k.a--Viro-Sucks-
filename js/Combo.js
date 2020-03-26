import React, {Component} from 'react';

import {ViroText, ViroFlexView, ViroMaterials, ViroSound} from 'react-viro';

class Combo extends Component {
    constructor() {
        super();
        this.state = {
            solution: [],
            digits: [0, 0, 0, 0],
            solved: false,
        }

        this.handleClick = this.handleClick.bind(this);
        this.checkMatch = this.checkMatch.bind(this);
    }

    componentWillMount() {
        let code = this.props.code.split('');
        code = code.map(digit => +digit);

        this.setState({
            solution: code,
        })
    }

    handleClick(idx) {
        const digitsCopy = [...this.state.digits];
        digitsCopy[idx]++;

        if (digitsCopy[idx] > 9) digitsCopy[idx] = 0;
        
        const correctCode = this.checkMatch(digitsCopy);

        this.setState({
            digits: digitsCopy,
            solved: correctCode,
        });
    }

    // If a match occurs, the player gets the key
    checkMatch(digits) {
        for (let i=0; i < digits.length; i++) {
            if (digits[i] !== this.state.solution[i]) return false;
        }

        this.props.getItem('key',require('../js/Inventory/images/key.png'), true)
        return true;
    }

    render() {
        return (
            <ViroFlexView
                backgroundColor = "black"
                width={0.3}
                height={1.2}
                style={{flexDirection: "column", alignItems: "center", justifyContent: "space-between"}}
                position={[0, -0.5, 3.2]}
                rotation={[0, 180, 0]}
            >
            {
                this.state.digits.map((digit, idx) => {
                    return (
                        <ViroFlexView
                            key={`digit${idx}`}
                            backgroundColor="transparent"
                            materials={["comboBg"]}
                            width={0.3}
                            height={0.3}
                            style={{flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: 0.1}}
                            onClick={!this.state.solved
                                    ? () => this.handleClick(idx)
                                    : () => {}
                                }
                        >
                            <ViroText
                                color="red"
                                height={0.2}
                                width={0.2}
                                textAlign="center"
                                textAlignVertical="center"
                                text={digit.toString()} />
                        </ViroFlexView>
                    )
                })
            }
            {this.state.solved && <ViroSound source={require('./sounds/horror_stab.mp3')} loop={false} /> }
            </ViroFlexView>
        )
    }
}

ViroMaterials.createMaterials({
    comboBg: {
        diffuseTexture: require('./res/combo_bg.jpg'),
    }
})

export default Combo;