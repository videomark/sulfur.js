import { Sulfur } from "../src/index";

test("Creates an instance of Sulfur.", () => {
  const sulfur = new Sulfur();
  expect(sulfur).toBeInstanceOf(Sulfur);
});
