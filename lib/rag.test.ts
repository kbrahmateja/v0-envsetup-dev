import { describe, expect, it } from "vitest"
import { buildContext, extractQuery, toOrTsQuery } from "./rag"

describe("toOrTsQuery", () => {
  it("joins words with the tsquery OR operator", () => {
    expect(toOrTsQuery("spring react mysql")).toBe("spring | react | mysql")
  })

  it("strips punctuation that would break tsquery syntax", () => {
    expect(toOrTsQuery("spring-boot & react!")).toBe("spring | boot | react")
  })

  it("collapses repeated whitespace", () => {
    expect(toOrTsQuery("  go   gin  ")).toBe("go | gin")
  })

  it("returns an empty string for input with no usable words", () => {
    expect(toOrTsQuery("&&&")).toBe("")
  })
})

describe("extractQuery", () => {
  it("joins the last two user messages", () => {
    const messages = [
      { role: "assistant", content: "Hi there" },
      { role: "user", content: "I need java" },
      { role: "assistant", content: "Sure" },
      { role: "user", content: "with mysql" },
    ]
    expect(extractQuery(messages)).toBe("I need java with mysql")
  })

  it("ignores assistant messages entirely", () => {
    const messages = [{ role: "assistant", content: "hello" }]
    expect(extractQuery(messages)).toBe("")
  })
})

describe("buildContext", () => {
  it("returns an empty string for no chunks", () => {
    expect(buildContext([])).toBe("")
  })

  it("formats chunks with category and title", () => {
    const context = buildContext([
      { title: "Java Spring Boot", content: "Spring Boot 3.2", category: "language", tags: [], rank: 1 },
    ])
    expect(context).toContain("[LANGUAGE] Java Spring Boot")
    expect(context).toContain("Spring Boot 3.2")
  })
})
