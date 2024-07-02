//test design to verify that Jest is working properly
const sum = require('../src/bricks/sum.js');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});