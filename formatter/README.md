# Blade Prettier Plugin

This package provides a Prettier plugin that can parse and format Laravel Blade template files.

If you'd like to view the source, report issues, etc. you can do so on the formatter's repository on GitHub:

[https://github.com/stillat/blade-parser-typescript](https://github.com/stillat/blade-parser-typescript)

> **Important**: This plugin currently only supports Prettier v2.

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

## Working with Other Plugins, such as the Prettier Plugin for Tailwind CSS

The Blade formatter does not ship with third-party plugins, like the [Prettier Plugin for Tailwind CSS](https://github.com/tailwindlabs/prettier-plugin-tailwindcss).

> Technically the formatter does ship with built-in JSON and PHP formatters, but these are to handle some internal formatting under special circumstances, and are not applied to your entire template.

You are free to install and configure whichever versions of these plugins you would like. However, if you are unable to get them to work in conjunction with the Blade formatter, you can update the `.prettierrc` file and include them in the plugins list.

For example, if we had installed the `prettier-plugin-tailwindcss` plugin, we could update our `.prettierrc` file like so:

> Starting with version 1.5, prettier plugins that modify class strings, such as `prettier-plugin-tailwindcss` can also be applied to strings contained within Blade directives and embedded PHP code. See the section "Class String Emulation" for more information.

```json
{
    "tailwindConfig": "path/to/tailwind.config.js",
    "plugins": [
        "./node_modules/prettier-plugin-blade/",
        "./node_modules/prettier-plugin-tailwindcss/"
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

> Note: If you are using VS Code you may have to restart the editor after installing/changing Prettier plugins for them to take effect.

### Which Plugins are Compatible?

The Blade formatter will utilize Prettier's HTML parser when formatting your Blade document. Your Prettier plugin configuration is passed along to the Blade formatter and will be used when formatting your Blade document - you do not need to wait for it to be supported by the formatting library.

When the Blade formatter invokes Prettier's HTML formatter, the PHP and Blade code will be safely removed from the document to prevent the Blade and PHP content from being mangled by other front-end plugins with similar syntax. Once the layout of the template has been established by the HTML formatter using your project's configuration, the layout engine will start assembling the Blade and PHP content (utilizing the built-in PHP formatter or Laravel Pint, if configured).

## Configuring Laravel Pint

If you would like to use [Laravel Pint](https://github.com/laravel/pint) as the PHP formatter, you will need to create a `.blade.format.json` file at the root of your project (within a typical Laravel application, this will be the same location as your `composer.json` file). The location of this file is important if you do *not* configure a custom Pint command (details below). If no custom Pint command has been configured, the formatting library will use the location of the `.blade.format.json` as the root of your project, and will look for the `vendor/bin/pint` file relative to it's location.

Inside the `.blade.format.json` file, you will need to enable support for Laravel Pint:

```json
{
    "useLaravelPint": true
}
```

By default, the Blade formatter will look for Pint at the following location:

```text
project_root/vendor/bin/pint
```

If you running Pint elsewhere, or need to customize how it is called, you can add a `pintCommand` configuration option to your `.blade.format.json` file:

```json
{
    "useLaravelPint": true,
    "pintCommand": "your-pint-command {file}"
}
```

Make sure to include the `{file}` as part of your custom command, as the Blade formatter will supply the path to a temporary path it using when invoking Pint. This path will already be wrapped in double quotes - do not add these yourself. Do not include anything after the `{file}` part of the command. The Blade formatter will merge your Pint configuration (if available) with some internal settings that must be present for safe output.

> ⚠️ The Blade formatter does not check what exactly it is you have added to the `pintCommand` configuration option. If you add some really dumb shell commands, it will attempt to run those.

### Pint Result Cache

The Blade formatter will cache Pint output on a per-file basis. By default this cache is stored in `node_modules/prettier-plugin-blade/_cache`.

The location of the cache can be changed by updating the `.blade.format.json` file and specifying a path for the `pintCacheDirectory`:

```json
{
    "useLaravelPint": true,
    "pintCacheDirectory": "../directory/"
}
```

The cache may also be disabled entirely by setting the `pintCacheEnabled` value to `false`:

```json
{
    "useLaravelPint": true,
    "pintCacheEnabled": false
}
```

### Pint Temporary Directory

The Blade formatter will extract the relevant PHP from Blade templates and place them in a temporary file to supply to Laravel Pint. By default this directory is located at `node_modules/prettier-plugin-blade/_temp`.

Temporary files are automatically cleaned up after formatting each Blade template. However, if you would like to move this temporary directory you may specify a value for the `pintTempDirectory` configuration option within your `.blade.format.json` file:

```json
{
    "useLaravelPint": true,
    "pintCacheDirectory": "../path/"
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

## Class String Emulation

Class string emulation is a feature (starting with version 1.5) that is able to apply the results of prettier plugins that target CSS class lists to strings contained within Blade directives and embedded PHP code. This feature also works when using Laravel Pint as the PHP formatter.

This feature is enabled by default, with a sensible (and safe) default configuration. If you'd like to disable this feature entirely, you may add a `classStrings` configuration object to your `.blade.format.json` file and set the `enabled` value to `false`:

```json
{
    "classStrings": {
        "enabled": false
    }
}
```

### Setting Excluded Directives

By default, the Blade formatter will not apply this feature to the following list of directives:

* if
* unless
* elseif
* for
* forelse
* foreach

If you'd like to modify this list you may add a `classStrings` configuration object to your `.blade.format.json` file and modify the `excludedDirectives` configuration property:

```json
{
    "classStrings": {
        "excludedDirectives": [
            "if", "unless", "elseif", "for", "forelse", "foreach"
        ]
    }
}
```

### Avoiding Class String Emulation for Entire Templates

Sometimes you may wish to have the class string emulation feature enabled, but have the ability to not have it evaluate certain documents or templates. To help with this, you may set up a list of exclusion regular expressions that will be used to reject a template.

```json
{
    "classStrings": {
        "documentRules": {
            "excludeWhen": [
                "skip"
            ]
        }
    }
}
```

Each regular expression in the list will be tested against the document before it is evaluated. If any of the exclusion patterns pass, the template will not have class string emulation applied to Blade directives or embedded PHP content.

If you need to do the opposite, and only run the feature on documents that *do* match a certain pattern, you may alternatively use the `includeWhen` option:

```json
{
    "classStrings": {
        "documentRules": {
            "includeWhen": [
                
            ]
        }
    }
}
```

### Specifying Rules for Strings

Similar to excluding or including entire documents, you may also set up a list of rules that are applied to each string. For example, if we only wanted to run the feature on Blade directive or PHP strings that contain the value `!tw`, we could set up our `.blade.format.json` file like so:

```json
{
    "classStrings": {
        "stringRules": {
            "includeWhen": [
                "!tw"
            ]
        }
    }
}
```

### Class String Emulation and PHP Language Features

By default, class string emulation will not be applied to strings under a wide variety of situations. For example, if the string is contained with a condition statement, used in a comparison operation, or is the target of most assignments, the string will *not* be changed.

For example, the strings in the following template would not be impacted:

```blade

@php

    if ($someValue == 'text-white px-4 sm:px-8 py-2') {

    }

@endphp

```

If you really want to override this behavior (you probably don't need to), you can adjust this behavior by updating the `.blade.format.json` file and adding a `ignoredLanguageStructures` configuration property:

> Important: If you override this value, you must include *all* of the structures you would like ignored.

```json
{
    "classStrings": {
        "ignoredLanguageStructures": [
            "assign",
            "concat",
            ...
        ]
    }
}
```

The following table lists the available configuration options:

| PHP Operator/Structure | Configuration String | Ignored by Default |
|---|---|--|
| If Statements | `if` | Yes |
| Method/Function Calls | `call` | Yes* |
| Ternary | `ternary` | Yes |
| Addition | `addition` | Yes |
| Subtraction | `subtraction` | Yes |
| Multiplication | `multiplication` | Yes |
| Division | `division` | Yes |
| Modulus | `modulus` | Yes |
| Exponentiation | `exponentiation` | Yes |
| Generic Comparison (if a more specific match was not found) | `compare` | Yes |
| Concatenation | `concat` | Yes |
| Greater Than | `greater_than` | Yes |
| Greater Than or Equal | `greater_than_equal` | Yes |
| Less Than | `less_than` | Yes |
| Less Than or Equal | `less_than_equal` | Yes |
| Bitwise AND | `bitwise_and` | Yes |
| Bitwise OR | `bitwise_or` | Yes |
| Bitwise XOR | `bitwise_xor` | Yes |
| Left Shift | `left_shift` | Yes |
| Right Shift | `right_shift` | Yes |
| Equality | `equality` | Yes |
| Inequality | `inequality` | Yes |
| Not Identity | `not_identity` | Yes |
| AND Comparison (`&&`, `and`, etc.) |  `and` | Yes |
| OR Comparison (`\|\|`, `or`, etc.) | `or` | Yes |
| XOR | `xor` | Yes |
| Assignment | `assign` | No |
| Addition Assignment | `assign_addition` | Yes |
| Subtraction Assignment | `assign_subtraction` | Yes |
| Multiplication Assignment | `assign_multiplication` | Yes |
| Division Assignment | `assign_division` | Yes |
| Modulus Assignment | `assign_modulus` | Yes |
| Concatenation Assignment | `assign_concat` | Yes |
| Bitwise AND Assignment | `assign_bitwise_and` | Yes |
| Bitwise OR Assignment | `assign_bitwise_or` | Yes |
| Bitwise XOR Assignment | `assign_bitwise_xor` | Yes |
| Left Shift Assignment | `assign_left_shift` | Yes |
| Right Shift Assignment | `assign_right_shift` | Yes |

\* By default the Blade Formatter will allow processing of strings contained within any method named `class`. You can change this behavior by adding a `allowedMethodNames` configuration item to the `classStrings` configuration within your `.blade.format.json` file:

```json
{
    "classStrings": {
        "allowedMethodNames": [
            "class",
            "methodName",
            "anotherName"
        ]
    }
}
```

Method names are case sensitive.

### Ignored Strings

Strings will be ignored if any of the following conditions are met (these behaviors cannot be disabled at this time):

* The string does not contains a space
* The string contains newline characters
* The string contains any of the following characters: `${"'`
* The string contains the `, ` (comma space) character sequence
* Strings inside `{{-- format-ignore-start --}}{{-- format-ignore-end --}}` regions will **not** be changed

## Formatting JavaScript Inside Attributes

The Blade formatter will format JavaScript inside Alpine.js directives by default (starting with 1.6.0). This can be disabled by adding a `formatJsAttributes` configuration item to your `.blade.format.json`:

```json
{
    "formatJsAttributes": false,
}
```

If you would like to exclude a list of attributes from being formatted, you may add a list of regular expressions to the `.blade.format.json` file. By default, it contains the following items:

```json
{
    "formatJsAttributes": true,
    "excludeJsAttributes": [
        "^v-"
    ]
}
```

If you'd like to expand the list of attributes to be formatted, you may add a list of regular expressions to the `.blade.format.json` file. By default this list contains the following items:

```json
{
    "formatJsAttributes": true,
    "includeJsAttributes": [
        "^x-",
        "^ax-"
    ]
}
```

### Prevent Attribute Content from Being Wrapped in Newlines

Some attribute contents are sensitive to newlines, such as Alpine's `x-data`. To help address this in a general way, the Blade formatter allows you to configure a `safeWrappingJsAttributes` configuration property within your `.blade.format.json` file.

This configuration option contains a list of regular expressions. When an attribute matches an item in this list, the internal formatting behavior will change to prevent newlines from being added to the beginning and end of the formatted attribute's content. This configuration contains the following items by default:

```json
{
    "formatJsAttributes": true,
    "safeWrappingJsAttributes": [
        "^x-data"
    ]
}
```

### Modifying JavaScript Prettier Options

You can change which prettier options are applied to attribute content by adding a `attributeJsOptions` configuration object to your `.blade.format.json` file. For example, to increase the print width and disable the insertion of semicolons, you could add the following:

```json
{
    "attributeJsOptions": {
        "semi": false,
        "printWidth": 120
    }
}
```

The formatter will override the following settings internally for safety reasons:

* `singleQuote`: `true`
* `quoteProps`: `preserve`

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
