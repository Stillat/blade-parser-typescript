import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils.js';
import { setupTestHooks } from './testUtils/formatting.js';

suite('@include Formatting', () => {
  setupTestHooks();

  test('it formats simple @include directives', async () => {
    assert.strictEqual(
      (await formatBladeString('@include( "shared.errors"   )')).trim(),
      '@include("shared.errors")',
    );
  });

  test('it formats @include directives with view parameters', async () => {
    assert.strictEqual(
      (
        await formatBladeString('@include( "view.name"   , [ "status"   =>"complete"   ]   )')
      ).trim(),
      '@include("view.name", ["status" => "complete"])',
    );
  });

  test('it formats conditional @include directives', async () => {
    assert.strictEqual(
      (await formatBladeString('@includeWhen(  $boolean,  "view.name"  , [ "status"   =>"complete"   ]    )')).trim(),
      '@includeWhen($boolean, "view.name", ["status" => "complete"])',
    );

    assert.strictEqual(
      (await formatBladeString('@includeUnless(  $boolean,  "view.name"  , [ "status"   =>"complete"   ]    )')).trim(),
      '@includeUnless($boolean, "view.name", ["status" => "complete"])',
    );
  });

  test('it formats @each directives', async () => {
    assert.strictEqual(
      (await formatBladeString('@each("view.name",   $jobs , "job"   )')).trim(),
      '@each("view.name", $jobs, "job")',
    );
  });

  test('it formats @section directives with multiple parameters', async () => {
    assert.strictEqual(
      (await formatBladeString('@section( "title" ,  "Page Title" )')).trim(),
      '@section("title", "Page Title")',
    );
  });

  test('it formats @extends directives with view parameters', async () => {
    assert.strictEqual(
      (await formatBladeString('@extends("layouts.app" ,  [ "view"   =>"data"   ] )')).trim(),
      '@extends("layouts.app", ["view" => "data"])',
    );
  });

  test('it formats @include directives with many view parameters', async () => {
    // Arrays will remain a single line if the input was a single line.
    assert.strictEqual(
      (
        await formatBladeString('@include( "lorem.ipsum.dolor"   , ["sit"=>"amet",    "consectetur" => "adipiscing", "elit" => "sed", "do" => "eiusmod" ]   )')
      ).trim(),
      `@include("lorem.ipsum.dolor", ["sit" => "amet", "consectetur" => "adipiscing", "elit" => "sed", "do" => "eiusmod"])`,
    );

    // If an array already has a newline, we will allow it unwrap to multiple lines.
    assert.strictEqual(
        (
          await formatBladeString(`@include( "lorem.ipsum.dolor"   , [
            "sit"=>"amet",    "consectetur" => "adipiscing", "elit" => "sed", "do" => "eiusmod" ]   )`)
        ).trim(),
        `@include(
    "lorem.ipsum.dolor",
    [
        "sit" => "amet",
        "consectetur" => "adipiscing",
        "elit" => "sed",
        "do" => "eiusmod",
    ]
)`,
      );
  });

  test('it formats @include directives with many view parameters inside nested elements', async () => {
    const template = `
<div><div><div><div>
@include( "lorem.ipsum.dolor"   , [
    "sit"=>"amet",    "consectetur" => "adipiscing", "elit" => "sed", "do" => "eiusmod" ]   )
</div></div></div></div>`;
    const expected = `<div>
    <div>
        <div>
            <div>
                @include(
                    "lorem.ipsum.dolor",
                    [
                        "sit" => "amet",
                        "consectetur" => "adipiscing",
                        "elit" => "sed",
                        "do" => "eiusmod",
                    ]
                )
            </div>
        </div>
    </div>
</div>`;

    let result = (await formatBladeString(template)).trim();

    assert.strictEqual(
      result,
      expected
    );

    // Ensure that repeated formatting does not do weird things.
    for (let i = 0; i < 5; i++) {
        result = (await formatBladeString(result)).trim();

        assert.strictEqual(
            result,
            expected
        );
    }
  });

  test('it formats @include directives with view parameters', async () => {
    assert.strictEqual(
      (
        await formatBladeString('@include([ "a.b"   , [ "c"   =>"d"   ]   ])')
      ).trim(),
      '@include(["a.b", ["c" => "d"]])',
    );
  });
});
