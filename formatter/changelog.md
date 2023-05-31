# Changelog

## 1.4.7

- Improves relative indentation of PHP blocks in more scenarios
- Improves indentation of multi-line if statements
- General layout engine improvements

## 1.4.6

- Improves placement of spaces after directives when content is inlined within an element or attribute (#51)
- Improves relative indentation of directive arguments (#49)
- Corrects an issue that would cause odd replacements inside attached conditions (#52)
- Improves how PHP content is sent to Laravel Pint for better output results (#50)

## 1.4.5

- Improves internal management of Pint cache
- Improves how nested `@php @endphp` and `<?php ?>` code blocks are formatted with Pint
- Improves recovery behavior when internal issues are detected
- Improves relative PHP indentation when formatting using Pint
- Improves relative echo indentation when formatting using Pint
- Improves namespace and `use` behavior when formatting using Pint
- Improves formatting of docblock comments and their indentation when using Pint
- Overrides the `no_unused_imports` ruleset when using Pint to prevent namespaces from being removed (this would impact documents that imported things at the top, but used them in separate PHP regions later)
- Improves how simple conditions are formatted when they are attached to Blade echos on their left
- General improvements to overall layout engine
- Pint formatting results will now utilize trailing comma configuration more consistently
- Improved relative indentation of nested arrays and directive arguments when using Pint
- Improved trailing whitespace after inlined condition behavior
- Resolves an issue where directive parenthesis can be duplicated when Pint fails
- Resolves an issue where valid trailing semicolons may be removed when formatting raw PHP blocks
- Improves on reflowing of content when Prettier's layout breaks virtual elements onto separate lines
- Improves trailing whitespace behavior of inline directives, echos, etc. when lines are separated

## 1.4.4

- Improves management of Pint output to help prevent placeholder characters from appearing in output

## 1.4.3

- Improves the Pint transformation process to help prevent incorrect indentation levels (more #47)

## 1.4.2

- Improves the Pint transformation process to help prevent incorrect indentation levels (more #47)

## 1.4.1

- Improved the relative indentation logic of echo blocks
- Improves the Pint transformation process to help prevent incorrect indentation levels (#47)

## 1.4.0

- Adds support for Laravel Pint
- Tons of bug fixes, minor improvements, test coverage :)

## 1.3.2

- Improves newline management when formatting really long lines inside directive array arguments

## 1.3.1

- Improves formatting of nested documents (style, script)
- Improves newline management when formatting really long lines inside echos

## 1.3.0

- Adds a new `echoStyle` configuration option, with support for either `block` (default) or `inline` mode
- Corrects an issue where `{{-- format-ignore-start --}}` behaves incorrectly with nested documents (#44)
- Improves management of print width settings internally (#46)
- Corrects an issue that caused style blocks to be repeatedly indented (#45)

## 1.2.1

- Improves inline echo analyzer and formatted output (#42)
- Improves formatting of array directive arguments (#43)

## 1.2.0

- Adds support for ignoring entire sections of a template

## 1.1.18

- Formatting of echos will now respect manual newline placement, while preserving inline echos as text (#41)
- Improved condition and paired directive formatting to handle more nuanced situations (#40)

## 1.1.17

- Improves formatting of code inside echos

## 1.1.16

- Fixes an issue where expressions inside directive arrays were formatted incorrectly

## 1.1.15

- Improves directive spacing consistency (#39)
- Improves formatting of components inside conditions (#37)
- Improves operator reflow (#38)

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
