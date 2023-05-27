# Blade Prettier Plugin

This package provides a Prettier plugin that can parse and format Laravel Blade template files.

## Installation

The Blade Prettier Plugin can be installed with `npm` using the following command:

```bash
npm install prettier-plugin-blade
```

After installing, add the following to your `.prettierrc` file:

```json
{
    "plugins": [
        "./node_modules/prettier-plugin-blade/"
    ],
    "overrides": [
        {
            "files": [
                "*.blade.php"
            ],
            "options": {
                "parser": "blade"
            }
        }
    ]
}
```

## Ignoring Parts of a Template

Entire sections of a Blade template can be ignored by surrounding it with two special comments:

```blade
<div>
{{-- format-ignore-start --}}
    The template code inside this section will be ignored when formatting.
{{-- format-ignore-end --}}
</div>
```

## Configuring the Blade Parser (Optional)

You may optionally configure the Blade parser by creating a file named `.blade.format.json` at the root of your project. The options that can be used currently are:

* `customIfs`: A list of custom if statements. These provide hints to the parser and teach it how to treat custom ifs it encounters differently. If the parser consistently produces odd results for custom ifs, adding them to this list helps. Most of the time the parser can figure these out on its own, however.
* `ignoreDirectives`: A list of directive names the parser should ignore.
* `formatDirectivePhpParameters`: Indicates if PHP directive content should be formatted. Default: `true`
* `formatDirectiveJsonParameters`: Indicates if JSON directive parameters should be formatted. Default: `true`
* `spacesAfterDirective`: The number of spaces to add after directive names when they contain parameters. Values can be between `0` and `3`. Default: `0`

> Note: Do not add the leading @ when adding directive names to any of the configuration options. When adding custom if statements, you just need to add the first name (add just "disk" instead of adding "disk" and "elsedisk").

```json
{
    "ignoreDirectives": [],
    "customIfs": [],
    "formatDirectivePhpParameters": true,
    "formatDirectiveJsonParameters": true,
    "formatInsideEcho": true,
    "spacesAfterDirective": 0,
    "spacesAfterControlDirective": 1,
    "echoStyle": "block",
    "phpOptions": {
        "phpVersion": "8.0"
    }
}
```

The valid options for the `echoStyle` option are `block` (the default) and `inline`. To illustrate what these options do, lets consider the following Blade template:

```blade
<div
{{
    match ($foo) {
        'foo' => 'foo',
        default => 'bar',
    }
}}
></div>
```

With the option `inline`, the formatted result becomes:

```blade
<div
    {{ match ($foo) {
        "foo" => "foo",
        default => "bar",
    } }}
></div>
```

With the option `block`, the formatted result is:

```blade
<div
    {{
        match ($foo) {
            "foo" => "foo",
            default => "bar",
        }
    }}
></div>
```

### Configuring Prettier PHP Options

By default, PHP version `8.0` is configured when formatting directives, `@php` blocks, etc. You may change this by adding a `phpOptions` configuration object within your `.blade.format.json` file. For example, to change the PHP version, disable single quotes, you could do this:

```json
{
    "ignoreDirectives": [],
    "customIfs": [],
    "formatDirectivePhpParameters": true,
    "formatDirectiveJsonParameters": true,
    "formatInsideEcho": true,
    "spacesAfterDirective": 0,
    "spacesAfterControlDirective": 1,
    "phpOptions": {
        "singleQuote": false,
        "phpVersion": "7.0"
    }
}
```

### Configuring Laravel Pint

If you would like to use [Laravel Pint](https://github.com/laravel/pint) as the PHP formatter, you will need to create a `.blade.format.json` file at the root of your project (within a typical Laravel application, this will be the same location as your `composer.json` file).

Inside this file, you will need to enable support for Laravel Pint:

```json
{
    "useLaravelPint": true
}
```

By default, the Blade formatter will look for Pint at the following location:

```
project_root/vendor/bin/pint
```

If you running Pint elsewhere, or need to customize how it is called, you can add a `pintCommand` configuration option to your `.blade.format.json` file:

```json
{
    "useLaravelPint": true,
    "pintCommand": "your-pint-command {file}"
}
```

Make sure to include the `{file}` as part of your custom command, as the Blade formatter will supply the path to a temporary path it using to invoke Pint. This path will already be wrapped in double quotes - do not add these yourself.

> The Blade formatter does not check what exactly it is you have added to the `pintCommand` configuration option. If you add some really dumb shell commands, it will attempt to run those.

### Configuring Other Options

The following are currently consider control directives: `if`, `elseif`, `unless`, `while`, `foreach`, `forelse`, and `for`.

The internal formatters will only format PHP and JSON content if their contents are considered to be valid when configured to do so. The formatter will not throw an error, and will simply leave the JSON/PHP content unformatted and continue with the rest of the document.

When configuring the `ignoreDirectives` option whatever values provided will take precedence over the defaults. By default the parser will ignore the following potential directive names that you may want to add back:

```js
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
    'click',
    'submit', 
    'scroll',
    'keydown',
    'keypress',
    'keyup',
    'blur', 
    'change',
    'contextmenu',
    'copy',
    'cut',
    'paste',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragleave',
    'dragover',
    'dragstart',
    'drop',
    'focus',
    'focusin',
    'focusout',
    'input',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseover',
    'mouseout',
    'mouseup',
    'mousewheel',
    'resize',
    'select',
    'touchcancel',
    'touchend',
    'touchmove',
    'touchstart',
    'wheel'
]
```

## Prettier Configuration

If you continuously receive errors like "could not resolve module prettier-plugin-blade", the following updates to a project's `.prettierrc` have proved successful:

```json
{
    "plugins": [
      "./node_modules/prettier-plugin-blade/"
    ],
    "overrides": [
      {
        "files": "*.blade.php",
        "vscodeLanguageIds": ["blade"],
        "options": {
          "parser": "blade"
        }
      }
    ]
}
```

## Reporting Issues

If you come across an issue, or have a suggestion to improve the Blade formatter, feel free to create an issue on the project's GitHub repository here:

[https://github.com/stillat/blade-parser-typescript](https://github.com/stillat/blade-parser-typescript)

If you are looking to report a security vulnerability, please **do not** create an issue on the GitHub repository.

To report sensitive issues or a security vulnerability please email [security@stillat.com](mailto:security@stillat.com) with the relevant details.

Emails requesting information on bounties, etc. will not be responded to.

## License

This formatter utility is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
