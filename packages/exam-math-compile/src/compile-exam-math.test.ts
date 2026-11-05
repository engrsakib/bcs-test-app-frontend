import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compileExamMathFormula,
  renderStoredMathFormulaHtml,
} from "./index";

function assertNoKatexError(html: string) {
  assert.doesNotMatch(html, /katex-error/);
  assert.match(html, /katex/);
}

describe("compileExamMathFormula", () => {
  it("uses stored path for MathLive \\text{} polynomial tail", () => {
    const raw = String.raw`\text{যদি } x^2 + 2x + 1 = 0 \text{ হয়}`;
    const outcome = compileExamMathFormula(raw, false);
    assert.equal(outcome.kind, "single-html");
    if (outcome.kind !== "single-html") return;
    assert.equal(outcome.result.strategy, "stored");
    assertNoKatexError(outcome.result.html);
  });

  it("composes Q2 leading prose plus delimited equation as hybrid single HTML", () => {
    const raw =
      "4 এবং $x + 2y = \\frac{x}{y} = 2$ হলে, x এর মান কত?";
    const outcome = compileExamMathFormula(raw, false);
    assert.equal(outcome.kind, "single-html");
    if (outcome.kind !== "single-html") return;
    assert.match(outcome.result.latex, /\\text\{4 এবং \}/);
    assertNoKatexError(outcome.result.html);
  });

  it("rebuilds Q20 corrupt dollar placement via hybrid", () => {
    const raw = String.raw`x+2y=4$ এবং $\frac{x}{y}=2$ হলে, x এর মান কত?`;
    const outcome = compileExamMathFormula(raw, false);
    assert.equal(outcome.kind, "single-html");
    if (outcome.kind !== "single-html") return;
    assert.match(outcome.result.latex, /\\frac\{x\}\{y\}/);
    assert.match(outcome.result.latex, /\\text\{/);
    assertNoKatexError(outcome.result.html);
  });

  it("composes micro-delimited Q1 stem as one HTML document", () => {
    const raw =
      "$m$ এর মান কত হলে $x$^2$+$x$-$m$ একটি পূর্ণবর্গ রাশি হবে।";
    const outcome = compileExamMathFormula(raw, false);
    assert.equal(outcome.kind, "single-html");
    if (outcome.kind !== "single-html") return;
    assertNoKatexError(outcome.result.html);
  });

  it("composes Q9-style glued multi-equation stem", () => {
    const raw =
      "x-y=3 হলে x²-y²-9xy এর মান কত এবং x+y=5 হলে x²+y²+10xy এর মান কত?";
    const outcome = compileExamMathFormula(raw, false);
    assert.equal(outcome.kind, "single-html");
    if (outcome.kind !== "single-html") return;
    assertNoKatexError(outcome.result.html);
  });

  it("uses stored path for pure wrapped fraction option", () => {
    const raw = String.raw`$\frac{1}{2}$`;
    const outcome = compileExamMathFormula(raw, false);
    assert.equal(outcome.kind, "single-html");
    if (outcome.kind !== "single-html") return;
    assert.equal(outcome.result.strategy, "stored");
    assertNoKatexError(outcome.result.html);
  });

  it("admin renderStoredMathFormulaHtml matches compile primary html", () => {
    const raw = String.raw`x^2 - y^2 + 2y - 1\;\text{ এর একটি উৎপাদক}`;
    const outcome = compileExamMathFormula(raw, false);
    assert.equal(outcome.kind, "single-html");
    if (outcome.kind !== "single-html") return;
    const adminHtml = renderStoredMathFormulaHtml(raw, false);
    assert.equal(adminHtml, outcome.result.html);
  });
});
