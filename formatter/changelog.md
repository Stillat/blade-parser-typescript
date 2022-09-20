# Changelog

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
