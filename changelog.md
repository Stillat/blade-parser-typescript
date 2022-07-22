# Change Log

A list of what's changed, and more.

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
