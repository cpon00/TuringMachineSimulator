# TuringMachine385
A Turing machine simulator built in JS

### Please use this command to run the machine
```node turingMachine.js [string to be checked] < [description of turing machine]```
### For my test case,
```node turingMachine.js 000011 < inputText.txt```

In my example file, the description of the Turing Machine recognizes a machine that will accept double the amount of 0's than 1's
Ex:001, 000011

The script will parse transitions and start states from the text file in the form of:
```
START=q0;ACCEPT=q5;BLANK=B

q0:0->B,R,q1
q0:B->B,R,q5
...
```
