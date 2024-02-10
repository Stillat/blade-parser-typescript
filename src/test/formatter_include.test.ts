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

  test('it formats @include directives with many view  parameters', async () => {
    assert.strictEqual(
      (
        await formatBladeString('@include( "lorem.ipsum.dolor"   , ["sit"=>"amet",    "consectetur" => "adipiscing", "elit" => "sed", "do" => "eiusmod" ]   )')
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

  test('it formats @include directives with view parameters', async () => {
    // This test is only to demonstrate that arrays allow this to work on main.
    // This is not actually valid Blade, and should be removed before merge.
    assert.strictEqual(
      (
        await formatBladeString('@include([ "a.b"   , [ "c"   =>"d"   ]   ])')
      ).trim(),
      '@include(["a.b", ["c" => "d"]])',
    );
  });
});
