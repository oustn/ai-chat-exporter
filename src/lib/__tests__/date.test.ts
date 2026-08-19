import { describe, expect, it } from "vitest";

import { formatConversationDate } from "../date";

describe("formatConversationDate", () => {
  it("accepts seconds, milliseconds, and ISO strings", () => {
    expect(formatConversationDate(1_786_497_015)).not.toBe("更新时间未知");
    expect(formatConversationDate(1_786_497_015_000)).not.toBe("更新时间未知");
    expect(formatConversationDate("2026-08-12T09:30:15.000Z")).not.toBe("更新时间未知");
  });

  it("returns a fallback for invalid dates", () => {
    expect(formatConversationDate("not-a-date")).toBe("更新时间未知");
  });
});
