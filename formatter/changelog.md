# Changelog

## 1.1.14

- Improves formatting of if statements inside HTML elements
- Improves formatting of nested directive documents

## 1.1.13

- Improves formatting of very long echos when start/ends were left on the same line

## 1.1.11

- Improves arrow function reflowing inside PHP content (#32)

## 1.1.10

- Improves formatting of match statements (#31)

## 1.1.9

- Makes it possible to customize prettier PHP options via the `.blade.format.json` file (#27)
- Internal prettier PHP version is now 8.0 by default (#27)
- Improves formatting of PHP arrow functions (#27)
- Improves formatting of some directives, such as `@can` (#28)
- Improves formatting of directives inside HTML elements (#29)

## 1.1.8

- Detected custom if statements are now treated as control structures

## 1.1.7

- Preserves inline echos as text (#25)

## 1.1.6

- Improves wrapping behavior inside conditions (#26)
- Improves formatting of empty arrays inside `@props` and other directives (#23)
- Fixes a bug where `{{ $echo }}` echos inside component tags were missed (#22)
- Improves wrapping behavior of array arguments inside directives (#24)

## 1.1.5

- Prevents email addresses from becoming directives (#21)

## 1.1.4

- Prevents email addresses from becoming directives (#21)
- Improves formatting of multi-line echos (#20, #19, #18)

## 1.1.3

- Improves formatting of `@props` (#17)

## 1.1.2

- Corrects an issue where NOT operator reflow breaks up inequality
- Improves relative indentation inside `@php` blocks (#16)
- Corrects an issue where `@php` and `@verbatim` block content is lost inside nested child documents (#15)
- Improves formatting of conditions when the branch contains a single node, without any HTML fragments (#14)
- Improves formatting behavior of very long echo lines (#13)
- Prevents indentation of blank lines inside block structures (#12)

## 1.1.1

- Adds additional control directives
- Corrects issue with some `@props` formatting

## 1.1.0

- General formatting improvements

## 1.0.0

- General improvements to formatting

## 0.1.5

- Improves the formatting of Blade echo regions

## 0.1.4

- Adds coverage for short attribute syntax `<x-profile :user-id="$userId"></x-profile>` (from https://twitter.com/calebporzio/status/1568700635683627008)

## 0.1.3

- Fixes an issue that falsely flagged `can` pairs as invalid [#2](https://github.com/Stillat/blade-parser-typescript/issues/2)

## 0.1.2

- Fixes an issue where `@for` and `@endfor` regions were incorrectly labeled as not paired

## 0.1.0

- Improves the handling of the `spacesAfterDirective` configuration option
- Adds additional configuration option documentation
- Improves formatting of directives with parameters that contain a lot of spaces between the directive name and the opening `(`
- Changed the package name from `prettier-plugin-blade-stillat` to `prettier-plugin-blade`
