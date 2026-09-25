import { describe, expect, it } from "vitest";
import { format, formatEqual } from "../helpers.js";

// Collapses whitespace runs the way HTML rendering does, and drops the
// whitespace a block-level element ignores at its edges.
function renderedText(source: string): string {
  return source
    .replaceAll(/\s+/gu, " ")
    .replaceAll(/(<\/?\w+) >/gu, "$1>")
    .replaceAll(/\s*(<\/?(?:p|legend)>)\s*/gu, "$1")
    .trim();
}

async function expectSameRenderedText(input: string): Promise<string> {
  const output = await format(input);
  expect(renderedText(output)).toBe(renderedText(input));
  return output;
}

describe("block directives inside inline text", () => {
  it("keeps an @if flush against an echo and the text after it", async () => {
    const input =
      "<p>Waiting time: {{ $years.' years' }}@if ($months), {{ $months.' months' }}@endif.</p>\n";

    await expectSameRenderedText(input);
    await formatEqual(
      input,
      [
        "<p>",
        "  Waiting time: {{ $years.' years' }}@if ($months), {{ $months.' months' }}@endif.",
        "</p>",
        "",
      ].join("\n"),
    );
  });

  it("keeps a @foreach body flush against its args and the closer flush against text", async () => {
    const input =
      "<p>Also issued in @foreach ($langs as $lang){{ $lang }}@endforeach, as the law asks.</p>\n";

    const output = await expectSameRenderedText(input);
    expect(output).not.toMatch(/\w@foreach/u);
    expect(output).toBe(
      [
        "<p>",
        "  Also issued in",
        "  @foreach ($langs as $lang){{ $lang }}@endforeach, as the law asks.",
        "</p>",
        "",
      ].join("\n"),
    );
  });

  it("does not insert whitespace around a block glued to text", async () => {
    const output = await expectSameRenderedText(
      "<p>one two{{ $x }}@if ($y), three.@endif four</p>\n",
    );

    expect(output).toContain("{{ $x }}@if ($y), three.@endif");
  });

  it("keeps whitespace around a nested block inside a body", async () => {
    const output = await expectSameRenderedText(
      "<p>Drawn up.@if ($t) Also in @foreach ($t as $l){{ $l }}@endforeach, too.@endif Done.</p>\n",
    );

    expect(output).toContain(
      "Drawn up.@if ($t) Also in @foreach ($t as $l){{ $l }}@endforeach, too.@endif",
    );
  });

  it("keeps the space between body text and an echo", async () => {
    const output = await expectSameRenderedText(
      "<p>{{ $c }}@if ($n), 등록번호 {{ $n }}@endif, 대표자 {{ $s }}</p>\n",
    );

    expect(output).toContain("{{ $c }}@if ($n), 등록번호 {{ $n }}@endif, 대표자");
  });

  it("keeps @unless and @else branches flush against their bodies", async () => {
    await formatEqual(
      "<p>Status: {{ $name }}@unless ($active), inactive.@else, active.@endunless</p>\n",
      [
        "<p>",
        "  Status: {{ $name }}@unless ($active), inactive.@else, active.@endunless",
        "</p>",
        "",
      ].join("\n"),
    );
  });

  it("keeps @forelse and @empty bodies flush against their tokens", async () => {
    await formatEqual(
      "<p>Languages: {{ $lead }}@forelse ($langs as $lang){{ $lang }}, @empty none.@endforelse</p>\n",
      [
        "<p>",
        "  Languages: {{ $lead }}@forelse ($langs as $lang){{ $lang }}, @empty none.@endforelse",
        "</p>",
        "",
      ].join("\n"),
    );
  });

  it("keeps every @case body and @break of an inline @switch", async () => {
    await formatEqual(
      "<p>Plan: {{ $plan }}@switch($kind) @case('a') alpha @break @default other @endswitch.</p>\n",
      [
        "<p>",
        "  Plan: {{ $plan }}@switch ($kind) @case ('a') alpha @break @default other @endswitch.",
        "</p>",
        "",
      ].join("\n"),
    );
  });

  it("keeps a multiline @switch intact when text follows its closer", async () => {
    await formatEqual(
      [
        "<p>",
        "    @switch($kind)",
        "        @case('a')",
        "            First option.",
        "            @break",
        "        @case('b')",
        "            Second option.",
        "            @break",
        "        @default",
        "            Fallback option.",
        "    @endswitch@if ($extra) Extra sentence.@endif",
        "</p>",
        "",
      ].join("\n"),
      [
        "<p>",
        "  @switch ($kind)",
        "    @case ('a')",
        "      First option.",
        "      @break",
        "    @case ('b')",
        "      Second option.",
        "      @break",
        "    @default",
        "      Fallback option.",
        "  @endswitch@if ($extra) Extra sentence.@endif",
        "</p>",
        "",
      ].join("\n"),
    );
  });

  it("keeps a borrowed tag marker on body text next to an echo", async () => {
    const output = await expectSameRenderedText(
      [
        "<p>",
        "    @if ($a)",
        "        @if ($b)",
        `            The party may share it with its "<strong>Agents</strong>", its {{ $c->term('agents') }}, and a "<strong>Related Party</strong>" is anyone it controls.`,
        "        @else",
        "            Only its advisers.",
        "        @endif",
        "    @endif",
        "</p>",
        "",
      ].join("\n"),
    );

    expect(output.match(/<strong/gu)).toHaveLength(2);
  });

  it("keeps a glued block inline when its source spans lines", async () => {
    const input = [
      "<legend>",
      "    {{ $label }}@if ($required)<sup>*</sup>",
      "    @endif",
      "</legend>",
      "",
    ].join("\n");

    await expectSameRenderedText(input);
    await formatEqual(
      input,
      ["<legend>", "  {{ $label }}@if ($required)<sup>*</sup> @endif", "</legend>", ""].join("\n"),
    );
  });

  it("keeps a glued block inside an inline element", async () => {
    await expectSameRenderedText(
      [
        "<flux:text>",
        "    {{ __('unit') }} ≈ {{ trans_choice('years', $y) }}@if ($m > 0), {{ trans_choice('months', $m) }}@endif",
        "</flux:text>",
        "",
      ].join("\n"),
    );
  });

  it("keeps a standalone directive glued to text", async () => {
    const output = await expectSameRenderedText("<p>Total:@money ($amount) incl. VAT</p>\n");

    expect(output).toContain("Total:@money ($amount)");
  });

  it("formats a block surrounded by whitespace as before", async () => {
    await formatEqual(
      "<p>one two {{ $x }} @if ($y) three @endif four</p>\n",
      ["<p>", "  one two {{ $x }}", "  @if ($y) three @endif", "  four", "</p>", ""].join("\n"),
    );
  });
});
