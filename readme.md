# Blade Parser

This library provides a Laravel Blade parser written in TypeScript. In addition to being able to parse Blade template files, this library also provides utilities and libraries that make it simpler to perform static analysis on Blade documents.

What this project is:

* A standalone Blade parser written in TypeScript/JavaScript
* A standalone Blade compiler written in TypeScript/JavaScript
* A Blade static analysis library
* A Blade error/diagnostics library
* An advanced Blade document transformation library

What this project is not:

* This project (when used by itself) is *not* a formatter. However, it can be used to quickly write a formatter.
* A view engine. It will not be able to actually render your Blade templates

## Installing

This package can be installed in your project using the following command:

```bash
npm install --save stillat-blade-parser
```

## Basic Usage

The simplest way to get started using this library is to use the `BladeDocument.fromText` static helper method:

```ts
import { BladeDocument } from "stillat-blade-parser/out/document/bladeDocument";

const document = BladeDocument.fromText(`<html>
    <head>
        <title>{{ $title }}</title>
    </head>
</html>`);
```

This method will return an instance of `BladeDocument`, which provides many useful features and helpers.

As an example, we can ask the document for a list of all parsed nodes and do something special with any directives we find:

```ts
import { BladeDocument } from "stillat-blade-parser/out/document/bladeDocument";
import { DirectiveNode } from 'stillat-blade-parser/out/nodes/nodes';

const document = BladeDocument.fromText(`<html>
    <head>
        <title>{{ $title }}</title>
    </head>
</html>`);

document.getAllNodes().forEach((node) => {
    if (node instanceof DirectiveNode) {
        console.log(node.directiveName);
    }
});
```

## Parsing Options

The Blade parser can be configured with a few options to help guide the parser. These configurable options are:

* `customIfs`: A list of custom `if` directives
* `directives`: A list of directives that can be parsed
* `ignoreDirectives`: A list of directive names that should be ignored

All provided option values are case-insensitive. Do not include the `@` when supplying directive names to the `directives` or `ignoreDirectives` lists.

### Supplying Options to the Parser

To supply parser options, you must have an instance of `BladeDocument` *before* you parse the template contents. Each `BladeDocument` also contains a parser instance. We can use the `getParser()` method to retrieve the internal parser instance, which will allow us to set our options:

```ts
import { BladeDocument } from "stillat-blade-parser/out/document/bladeDocument";
import { ParserOptions } from 'stillat-blade-parser/out/parser/parserOptions';

const document = new BladeDocument(),
    options:ParserOptions = {
        customIfs: [],
        directives: [],
        ignoreDirectives: []
    };

// Set the parser options.
document.getParser().withParserOptions(options);

document.loadString(`Template content`);
```

### The `directives` and `ignoreDirectives` Options

The `directives` and `ignoreDirectives` options are mutually exclusive, and only one will be used at a time. If values are provided for the `directives` configuration option, it will take precedence over the `ignoreDirectives` option.

The `ignoreDirectives` option is the default configuration setup, and allows developers to supply a list of directive names that *should not be parsed*. Because this parser library does not have any runtime access to your project's specific directives, it will attempt to parse everything that *could* be a valid directive.

By default, the `ignoreDirectives` option is set to the following:

```ts
const options:ParserOptions = {
    customIfs: [],
    directives: [],
    ignoreDirectives: [
        'media',
        'charset',
        'import',
        'namespace',
        'supports',
        'document',
        'page',
        'font-face',
        'keyframes',
        'viewport',
        'counter-style',
        'font-feature-values',
        'swash',
        'ornaments',
        'annotation',
        'stylistic',
        'styleset',
        'character-variant',
        'font-variant-alternates',
        'property',
        'color-profile',
    ]
};
```

Whenever a potential directive is encountered and is present in the `ignoreDirectives` list, that section of the template is skipped over and that potential directive becomes part of the document's literal text.

To contrast, the `directives` configuration option can be used to supply a list of directive names that *can be parsed*. If a potential directive is encountered that is *not* in this list, that potential directive is skipped and becomes part of the document's literal text.

### The `customIfs` Configuration Option

The `customIfs` configuration option is the parser's counterpart to Laravel's [Custom If Statements](https://laravel.com/docs/9.x/blade#custom-if-statements) feature. An important thing to note is this configuration option simply hints to the parser what will become an `if` statement internally.

This option can be set like so:

```ts
const options:ParserOptions = {
    customIfs: [
        'disk',
    ],
    directives: [],
    ignoreDirectives: []
};
```

In most situations you do *not* need to supply any value for this configuration option. The parser is capable of analyzing your Blade templates and detecting custom if statements automatically.

## Reporting Issues

Please use the issue's feature on GitHub to report bugs/issues. For general questions on how to use this library, please use the Discussions feature. Be considerate when interacting with others :)

Due to the complexity and scope of this project, when reporting bugs/issues please include *all* required information to reproduce the bug or issue. You are encouraged to attach any problematic templates to the issue as a file in addition to being included in the issue description (this helps to eliminate any formatting/adjustments that the GitHub UI may apply).

## Contributing Changes

Thank you for considering contributing changes to this project!

### Building from Source

To build this project from source, issue the following commands:

```bash
npm install
npm run compile
```

If you introduce changes that break existing tests with un-important whitespace changes, it is fine to simply update those tests to account for the new whitespace changes. An example of these types of changes would be the `transformer_` tests. Breaking whitespace inside literal/node content (unless its a bug fix) is not acceptable, however.

### Running the Tests

Before opening a pull request, do try and ensure that new features/changes have corresponding tests created. In addition, make sure to correct any failing tests.

To run the test suite issue the following command:

```bash
npm run test:parser
```

### Debugging the Parser Library

The easiest method to debug the parser library is to use VS Code and select the `Blade Parser` Run and Debug configuration. This debug configuration will launch the `/src/parser.ts` file in debug mode, allowing you to run and debug code from within that file right within VS Code.

## License

This library is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

If you find this project useful, or are using it in a commercial setting, please consider funding the project to ensure it's continued development.
