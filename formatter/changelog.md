# Changelog

## 2.1.21

- Corrects a bug when formatting `@forelse` directives (same as #116)

## 2.1.20

- Corrects a bug when formatting `@foreach` directives (#116)

## 2.1.19

- Improves formatting of `@if` statements neighboring the `>` or `<` characters (#112)

## 2.1.18

- Improves formatting results of foreach directives with upper-case characters (#108)

## 2.1.17

- Corrects an issue where leading parenthesis may be repeatedly toggled or duplicated (#102)
- Corrects an issue where some content may be interpreted as directives, causing improper line wrapping (#106)

## 2.1.16

- Prevents `x-mask` attributes from being supplied to class string emulation (#105)

## 2.1.15

- Corrects an issue where some attributes may be excessively indented (#104)

## 2.1.14

- Improves formatting of directives inside attribute content (#103)

## 2.1.13

- Corrects an issue when parsing escaped echo blocks (#99)

## 2.1.12

- Corrects an issue where leading spaces may be removed from literal nodes in some situations (#97)

## 2.1.11

- Improves parsing of escaped Directives within Blade component attribute list

## 2.1.10

- Improves relative indentation of Blade component attribute content (#96)

## 2.1.9

- Improves parsing of directives to reduce false positives

## 2.1.8

- Improves relative indentation when formatting `@php @endphp` blocks when not using Pint

## 2.1.7

- Corrects an issue when using Blade echo blocks as dynamic HTML attribute values without quotes and there is trailing whitespace duplicating the internal substitution (`<div data-something={{ something() }} >`)
- Prevent excessive indentation when formatting Blade component parameters containing PHP in some circumstances (#95)

## 2.1.6

- Corrects an issue where JavaScript assignments would get improperly ordered when combined with the Tailwind CSS plugin

## 2.1.5

- Corrects an issue when using the formatter with different Pint configurations (#94)

## 2.1.2

- Improves directive array formatting to prevent trashing complex input (#93)

## 2.1.1

- Corrects an issue preventing `@hasSection` from formatting correctly (#92)

## 2.1.0

- Adds general support for formatting directives with multiple parameters (#89)

## 2.0.0

- Prettier v3 support (#69)
- Improved relative indentation of attribute content when not using Pint
- Improved graceful fallback of Pint command when not running in a full Laravel project

## 1.6.19

- Corrects an issue when `{{-- format-ignore-start --}}{{-- format-ingore-end --}}` that would cause some nodes to be internally eaten

## 1.6.18

- Improves handling of attribute content to help prevent excessive indentation (#87)

## 1.6.17

- Improves formatting directives whose name contains underscores
- Improves relative indentation of deeply nested paired directives containing literal content (#86)

## 1.6.16

- Continues to improve formatting of `@switch` directives when used as HTML attributes

## 1.6.15

- Improves formatting of escaped single quotes inside Alpine.js attribute (#81)
- Improves relative indentation of Blade component attributes (#82)
- Improves formatting of `@forelse` `@empty` directives that contain no structures (#83)
- Improves formatting of escaped Blade tag inside Alpine.js attributes (#84)
- Adds support for using `@switch` directives as HTML attributes (#85)

## 1.6.14

- Improves parsing of Blade echo blocks that contain PHP comments (#79)

## 1.6.13

- Adds a note about supported Prettier version to readme.

## 1.6.12

- Improves class string emulation to prevent removing of leading/trailing whitespace (#77)
- Improves formatting of JavaScript attributes (#76)

## 1.6.10

- Improvements to relative indentation when formatting PHP inside Blade component dynamic expressions (#73)

## 1.6.9

- Improves formatting of comments inside Blade component attribute content (#71)
- Prevents formatting JavaScript inside attribute content if literals begin or end with `-` (#70)

## 1.6.8

- Adds support for formatting nested structures inside HTML content (#67)

## 1.6.7

- Corrects an issue prevent comments from being formatted inside HTML elements (#68)

## 1.6.6

- Corrects issues where some void elements would miss trailing nodes (#64 continued)
- Corrects the default value for the `concat_space` spacing rule (#66)
- Corrects issues where escaped Blade content causes strange output (#63)

## 1.6.5

- Preserves shorthand syntax when formatting Blade slot components (#65)
- Formats custom HTML elements that have the same name as void HTML elements (#64)

## 1.6.4

- Improves the layout of echos inside HTML element content

## 1.6.3

- Adds a "safe mode" for attribute newline management to prevent issues with front-end libraries (#62)

## 1.6.2

- Corrects an issue with condition spacing inside HTML attributes (#61)

## 1.6.1

- Corrects an issue where some Alpine.js directives would receive a leading semicolon (#60)
- Updates default Alpine.js JavaScript formatting style to better reflect community defaults

## 1.6.0

- Corrects an extreme edge case where some input strings would be duplicated or strangely converted
- Formats PHP inside Blade component parameters (i.e., `<x-alert :parameter="!$something" />`)
- Formats JavaScript inside Blade component parameters (i.e., `<x-alert ::parameter="1+1+1" />`)
- Formats JavaScript inside HTML attributes, such as AlpineJS directives
- Improves placement of Blade component attribute contents
- Improves newline management of attributes containing multiple lines
- Improves relative indentation of multi-line directives inside attributes and Blade component parameters
- Laravel Pint will no longer be called if no Blade structures were eligible to be formatted.
- `@verbatim @endverbatim` blocks that appear on the same line will no longer be formatted across multiple lines

## 1.5.6

- Corrects an issue that would break up attribute and directive names, such as `@click.prevent` (#58)

## 1.5.5

- Improves placement of literal content within a condition, when not accompanied by HTML or Blade structures
- Corrects an issue with Blade comments inside Components (#57)

## 1.5.4

- Corrects an issue where `@php @endphp` content may be lost when `formatDirectivePhpParameters` is set to false (#56)
- Automatically disables the `declare_strict_types` Pint rule when formatting PHP inside Blade (#56)

## 1.5.3

- Improves internal error recovery mechanisms

## 1.5.0

- Improves whitespace management of Blade echoes inside embedded documents, such as `<style>` and `<script>`
- Improves internal parser recovery mechanics when encountering improper directive arguments
- Applies prettier plugins that target HTML class-lists to strings inside Blade directives and embedded PHP code (such as the TailwindCSS prettier plugin)

## 1.4.8

- Corrects resolution of Pint configuration when formatting nested documents (#53)

## 1.4.7

- Improves relative indentation of PHP blocks in more scenarios
- Improves indentation of multi-line if statements
- General layout engine improvements

## 1.4.6

- Improves placement of spaces after directives when content is in-lined within an element or attribute (#51)
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
- Improves formatting of doc-block comments and their indentation when using Pint
- Overrides the `no_unused_imports` ruleset when using Pint to prevent namespaces from being removed (this would impact documents that imported things at the top, but used them in separate PHP regions later)
- Improves how simple conditions are formatted when they are attached to Blade echoes on their left
- General improvements to overall layout engine
- Pint formatting results will now utilize trailing comma configuration more consistently
- Improved relative indentation of nested arrays and directive arguments when using Pint
- Improved trailing whitespace after in-lined condition behavior
- Resolves an issue where directive parenthesis can be duplicated when Pint fails
- Resolves an issue where valid trailing semicolons may be removed when formatting raw PHP blocks
- Improves on reflowing of content when Prettier's layout breaks virtual elements onto separate lines
- Improves trailing whitespace behavior of inline directives, echoes, etc. when lines are separated

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
- Improves newline management when formatting really long lines inside echoes

## 1.3.0

- Adds a new `echoestyle` configuration option, with support for either `block` (default) or `inline` mode
- Corrects an issue where `{{-- format-ignore-start --}}` behaves incorrectly with nested documents (#44)
- Improves management of print width settings internally (#46)
- Corrects an issue that caused style blocks to be repeatedly indented (#45)

## 1.2.1

- Improves inline echo analyzer and formatted output (#42)
- Improves formatting of array directive arguments (#43)

## 1.2.0

- Adds support for ignoring entire sections of a template

## 1.1.18

- Formatting of echoes will now respect manual newline placement, while preserving inline echoes as text (#41)
- Improved condition and paired directive formatting to handle more nuanced situations (#40)

## 1.1.17

- Improves formatting of code inside echoes

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

- Improves formatting of very long echoes when start/ends were left on the same line

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

- Preserves inline echoes as text (#25)

## 1.1.6

- Improves wrapping behavior inside conditions (#26)
- Improves formatting of empty arrays inside `@props` and other directives (#23)
- Fixes a bug where `{{ $echo }}` echoes inside component tags were missed (#22)
- Improves wrapping behavior of array arguments inside directives (#24)

## 1.1.5

- Prevents email addresses from becoming directives (#21)

## 1.1.4

- Prevents email addresses from becoming directives (#21)
- Improves formatting of multi-line echoes (#20, #19, #18)

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
