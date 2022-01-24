import { validate } from "../src/validator";

test("valid data", () => {
  const peerId = "foo";
  const remoteId = "bar";
  const apikey = "baz";
  const additionalId = "qux";
  const statsSeq = 0;
  const events = [];
  const stats = [require("./data/rtc-stats-report.json")];

  validate({
    peerId,
    remoteId,
    apikey,
    additionalId,
    statsSeq,
    events,
    stats,
  });
});
