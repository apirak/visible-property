const sum = require('./code');

test('Match #123:23 fill should return #123:23 and fill', () => {
  expect(matchName("#123:23 fill")).toBe({nodeId:"123:23", type:"fill"});
});