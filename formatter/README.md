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
    "spacesAfterDirective": 0
}
```

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
