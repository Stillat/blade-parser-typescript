# Change Log

A list of what's changed, and more.

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

## 1.0.0

- Improves results of `DirectiveNode.getImmediateChildren()`
- General formatting improvements
- Additional test coverage

## 0.1.2

- Adds coverage for short attribute syntax `<x-profile :user-id="$userId"></x-profile>` (from https://twitter.com/calebporzio/status/1568700635683627008)

## 0.1.1

- Improves `can` directive pairing

## 0.1.0

- Abstracts the PHP Validator so that it is no longer dependent on `php-parser`
- Moves `php-parser` to a development dependency
- Improves the management of internal parser references and child documents
- Adds an `.npmignore` file to prevent the `/out` directory being purged when publishing
- Additional dependency removal/cleanup

## 0.0.4

- Fixes an issue where `@for` and `@endfor` regions were incorrectly labeled as not paired

## 0.0.3

- Improves parsing and formatting of directives with lots of spaces between the directive name and the opening `(`

## 0.0.2

- Documentation updates
- Adds common JavaScript events to the default list of excluded directives

## 0.0.1

- Initial test release
