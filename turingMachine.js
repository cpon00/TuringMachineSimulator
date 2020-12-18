class State {
    constructor(cell, accept, transitions) {
        Object.assign(this,{cell,accept})
        this.transitions = {};
        if (transitions != null) {
            this.transitions[transitions[0]] = transitions;
        }
    }
    addTransition(state) {
        this.transitions[Object.keys(state.transitions)[0]] = state.transitions[Object.keys(state.transitions)[0]];
    }
    contains(state){
        return (this.cell in state)
    }
}

class Tape {
    constructor(string) {
        this.nodes = string.split('');
        this.currIndex = 0;
        this.blank = 'B';
    }
    moveR() {
        this.currIndex++
        if (this.checkBounds()) {
            this.nodes.push(this.blank);
        }
    }
    moveL() {
        this.currIndex--
        if (this.checkBounds()) {
            this.currIndex++;
            this.nodes.unshift(this.blank);
        }
    }
    checkBounds(){
        if(this.currIndex > this.nodes.length - 1 || this.currIndex < 0){
            return true;
        }
    }
    transition(read, write, direction, currState, nextState) {
        if (this.nodes[this.currIndex] === read) {
            this.nodes[this.currIndex] = write;
            if(direction === 'R'){
                this.moveR()
            }else{
                this.moveL()
            }
              return nextState;
        }
        return currState;
    }
}

class TuringMachine {
    constructor(string, states, current) {
        Object.assign(this,{string,states, current})
        this.blank = 'B'
        this.tape = new Tape(string);
    }
    operate() {
        while (Object.keys(this.current.transitions).includes(this.tape.nodes[this.tape.currIndex])) {
            this.printCurrState()
            this.current = this.tape.transition(this.tape.nodes[this.tape.currIndex],
            this.current.transitions[this.tape.nodes[this.tape.currIndex]][1], this.current.transitions[this.tape.nodes[this.tape.currIndex]][2],
            this.current, this.states[this.current.transitions[this.tape.nodes[this.tape.currIndex]][3]]);
        }
        this.checkAccept();
    }
    printCurrState(){
        console.log(`Current state: ${this.current.cell} \nTape: ${this.tape.nodes}`)
        console.log(`      ${'  '.repeat(this.tape.currIndex)}^`)
    }
    checkAccept() {
        if (this.current.accept === true) {
            console.log(`\nString '${this.string}', is Accepted`);
        } else {
            console.log(`\nString '${this.string}', is not Accepted`);
        }
    }
}

const parseDescription = (line) => {
    let descArray = line.split(/START=|;ACCEPT=|;BLANK=/).filter(element => element != '');
    return descArray 
}
const parseTransition = (line) => {
    return new State(line.split(/[:,]|->/)[0], false, line.split(/[:,]|->/).slice(1));
}

const parseAcceptStates = (line,states) => {
    return line.forEach(acceptStates => {
        if (acceptStates.includes(states)) {
            states[acceptStates].accept = true;
        } else {
            states[acceptStates] = new State(acceptStates, true, null)
        }
    })
}

async function runTuringMachine() {
    let descriptionRead = false;
    let description
    let states = {};
    const read = require('readline');
    const readline = read.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    for await (const line of readline) { 
        if (line != '') {
            if(descriptionRead === false){
                description = parseDescription(line);
                descriptionRead = true;
            } else {
                if (parseTransition(line).cell in states) {
                    states[parseTransition(line).cell].addTransition(parseTransition(line));
                } else {
                    states[parseTransition(line).cell] = parseTransition(line);
                }
            }
        }
    }
    parseAcceptStates(description[1].split(','),states)
    const start = states[description[0]]
    const turingMachine = new TuringMachine(process.argv[2],states, start);
    turingMachine.operate();
}

runTuringMachine();