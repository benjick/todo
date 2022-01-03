import { msToTime } from "./helpers";

describe("msToTime", () => {
  test("different outcomes", () => {
    expect(msToTime(0x000)).toBe("00:00:00.000");
    expect(msToTime(60000)).toBe("00:01:00.000");
    expect(msToTime(30000)).toBe("00:00:30.000");
  });
});
