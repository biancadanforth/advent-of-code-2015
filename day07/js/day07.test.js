const { expect } = require("chai");
const { parseInput, part1 } = require("./day07.js");

describe("day07", () => {
  describe("parseInput", () => {
    it("should work with example input", () => {
      const input = `
        123 -> x
        456 -> y
        x AND y -> d
        x OR y -> e
        x LSHIFT 2 -> f
        y RSHIFT 2 -> g
        NOT x -> h
        NOT y -> i`;
      const expected = [
        ["123", "->", "x"],
        ["456", "->", "y"],
        ["x", "AND", "y", "->", "d"],
        ["x", "OR", "y", "->", "e"],
        ["x", "LSHIFT", "2", "->", "f"],
        ["y", "RSHIFT", "2", "->", "g"],
        ["NOT", "x", "->", "h"],
        ["NOT", "y", "->", "i"],
      ];
      expect(parseInput(input)).to.deep.equal(expected);
    });
  });

  describe("part1", () => {
    it("should work for example 1", () => {
      const input = `
        123 -> x
        456 -> y
        x AND y -> d
        x OR y -> e
        x LSHIFT 2 -> f
        y RSHIFT 2 -> g
        NOT x -> h
        NOT y -> i`;
      const instructions = parseInput(input);
      const expected = {
        d: 72,
        e: 507,
        f: 492,
        g: 114,
        h: 65412,
        i: 65079,
        x: 123,
        y: 456,
      };
      expect(part1(instructions)).to.deep.equal(expected);
    });
  });

  describe("part2", () => {
    // TODO
  });
});
