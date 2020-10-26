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

  console.log("Day 7, part 1: ", part1(input).a);
  console.log("Day 7, part 2: ", part2(input));
}

if (require.main === module) {
  main();
}

/*
 * Truncates a 32-bit value by setting the most significant 16 bits
 * to 0s and preserving the least significant 16 bits.
 *
 * This only works when n <= 65535 (2^16); otherwise the 32-bit
 * value is too large, and it cannot be cast as an equivalent 16-bit
 * value.
 */
function uint16 (n) {
  return n & 0xFFFF;
}

// Assumptions about each line (aka "instruction") in the input:
// - There is only one bitwise operator
// - Each non-NOT bitwise operator is immediately preceded and followed by its operands
// - The last field corresponds to the wire ID
function part1(input) {
  const instructions = parseInput(input);
  const signals = {};
  for (let instruction of instructions) {
    const wireID = instruction[instruction.length - 1];
    for (let token of instruction) {
      const index = instruction.indexOf(token);
      let result, leftOperand, rightOperand;
      if (BITWISE_OPERATORS.includes(token)) {
        // Found a bitwise operator in the instruction
        const leftOperandString = instruction[index - 1];
        leftOperand = signals[leftOperandString];
        const rightOperandString = instruction[index + 1];
        // For LSHIFT and RSHIFT, rightOperand is an int
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
        break;
      } else if (index === instruction.length - 1) {
        // We got to the end of the instruction, and we didn't encounter a bitwise operator
        result = parseInt(instruction[0]);
        signals[wireID] = result;
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
 * @returns {Array<Array<String>>} An array of tokenized bitwise operation instructions
 */
function parseInput(input) {
  const results = [];
  const instructions = input.trim().split("\n");
  for (let instruction of instructions) {
    results.push(instruction.split(' '));
  }
  return results;
}

module.exports = {
  parseInput,
  part1,
  part2,
};
