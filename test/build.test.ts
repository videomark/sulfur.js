/** @jest-environment jsdom */

import childProcess from "node:child_process";
import util from "node:util";
import fs from "node:fs";

beforeAll(async () => {
  const exec = util.promisify(childProcess.exec);
  await exec("yarn build");
}, 30_000);

test("package.json main is correct.", () => {
  const pkg = require("../package.json");
  const { Sulfur } = require(`../${pkg.main}`);
  const sulfur = new Sulfur();
  expect(sulfur).toBeInstanceOf(Sulfur);
});

test("sulfur.js", () => {
  const { Sulfur } = require("../dist/sulfur.js");
  const sulfur = new Sulfur();
  expect(sulfur).toBeInstanceOf(Sulfur);
});

test("sulfur.dev.js", () => {
  const { Sulfur } = require("../dist/sulfur.dev.js");
  const sulfur = new Sulfur();
  expect(sulfur).toBeInstanceOf(Sulfur);
});

test("sulfur.js.LICENSE.txt", async () => {
  const filePath = `${__dirname}/../dist/sulfur.js.LICENSE.txt`;
  const stat = await fs.promises.stat(filePath);
  expect(stat.isFile()).toBe(true);
});
