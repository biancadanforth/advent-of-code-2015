const fs = require("fs");

const BITWISE_OPERATORS = [
  "AND",
  "OR",
  "NOT",
  "LSHIFT",
  "RSHIFT"
];

function main() {
  const path = __dirname + "/../input";
  let input = fs.readFileSync(path, { encoding: "utf8" });

  console.log("Day 7, part 1: ", part1(input).a); //3176
  console.log("Day 7, part 2: ", part2(input));
}

if (require.main === module) {
  main();
}

/*
 * Truncates an n-bit value by setting all but the least significant
 * 16 bits to 0.
 *
 * This only works when n <= 65535 (2^16); otherwise the n-bit
 * value is too large, and it cannot be cast as an equivalent 16-bit
 * value.
 */
function uint16 (n) {
  return n & 0xFFFF;
}

function part1(input) {
  const instructions = parseInput(input);
  const signals = {};
  let n = instructions.length - 1;
  while (instructions.length) {
    if (n === -1) {
      // We got to the bottom of the stack, start over at the top
      n = instructions.length - 1;
    }
    let instruction = instructions[n];
    const wireID = instruction[instruction.length - 1];
    for (let token of instruction) {
      const index = instruction.indexOf(token);
      let reWireID = /[a-z]+/;
      let result, leftOperand, rightOperand;
      if (BITWISE_OPERATORS.includes(token)) {
        // Found a bitwise operator in the instruction
        // operands could be wireIDs or ints
        // leftOperandString could be undefined if token is the NOT operator, as
        // that is the first token in the instruction
        const leftOperandString = instruction[index - 1];
        if (leftOperandString && reWireID.test(leftOperandString) && typeof signals[leftOperandString] !== "number") {
          // The operand is a wireID, and the wireID does not have a numerical signal value; skip it for now
          n--;
          break;
        }
        leftOperand = signals[leftOperandString] || parseInt(leftOperandString);
        const rightOperandString = instruction[index + 1];
        if (reWireID.test(rightOperandString) && typeof signals[rightOperandString] !== "number") {
          // The operand is a wireID, and the wireID does not have a numerical signal value; skip it for now
          n--;
          break;
        }
        rightOperand = signals[rightOperandString] || parseInt(rightOperandString);
        switch (token) {
          case "AND":
            result = uint16(leftOperand & rightOperand);
            break;
          case "OR":
            result = uint16(leftOperand | rightOperand);
            break;
          case "LSHIFT":
            result = uint16(leftOperand << rightOperand);
            break;
          case "RSHIFT":
            result = uint16(leftOperand >> rightOperand);
            break;
          case "NOT":
            result = uint16(~rightOperand);
            break;
          default:
            throw new Error(`Unrecognized bitwise operator ${token}`);
        }
        signals[wireID] = result;
        instructions.splice(n, 1);
        n = instructions.length - 1;
        break;
      } else if (index === instruction.length - 1) {
        // We got to the end of the instruction, and we didn't encounter a bitwise operator
        // This instruction is a direct assignment, but the value could be a reference
        // to another wire (e.g. "a -> lx") as opposed to a literal number.
        if (reWireID.test(instruction[0]) && typeof signals[instruction[0]] !== "number") {
          // The first field is a wireID, and the wireID does not have a numerical signal value; skip it for now
          n--;
          break;
        }
        result = signals[instruction[0]] || parseInt(instruction[0]);
        signals[wireID] = result;
        instructions.splice(n, 1);
        n = instructions.length - 1;
      }
    }
  }
  return signals;
}

function part2(input) {
 // TODO
}

/**
 * @param {string} input - The puzzle input as a multi-line line string
 *   Assumptions about each line (aka "instruction") in the input:
 *   - There is only one bitwise operator
 *   - Each non-NOT bitwise operator is immediately preceded and followed by its operands
 *   - The last field corresponds to the wire ID
 * @returns {Array<Array<String>>} An array of tokenized bitwise operation instructions
 */
function parseInput(input) {
  const results = [];
  const instructions = input.trim().split("\n");
  for (let instruction of instructions) {
    results.push(instruction.trim().split(' '));
  }
  return results;
}

module.exports = {
  parseInput,
  part1,
  part2,
};
