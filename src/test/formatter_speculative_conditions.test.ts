import assert from 'assert';
import { formatBladeString } from '../formatting/prettier/utils';

suite('Speculative Conditions Formatting', () => {
    test('it can format detected custom conditions', () => {
        assert.strictEqual(
            formatBladeString(`@disk('local')
    <div>
    @disk('local')
    @disk('local')
    <!-- The application is using the local disk... -->
@elsedisk('s3')
    <!-- The application is using the s3 disk... -->
@else
    <!-- The application is using some other disk... -->
@enddisk
@elsedisk('s3')
    <!-- The application is using the s3 disk... -->
@else
    <!-- The application is using some other disk... -->
@enddisk
    </div>
@elsedisk('s3')
    <!-- The application is using the s3 disk... -->
@else
    <!-- The application is using some other disk... -->
@enddisk`).trim(),
            `@disk ("local")
    <div>
        @disk ("local")
            @disk ("local")
                <!-- The application is using the local disk... -->
            @elsedisk ("s3")
                <!-- The application is using the s3 disk... -->
            @else
                <!-- The application is using some other disk... -->
            @enddisk
        @elsedisk ("s3")
            <!-- The application is using the s3 disk... -->
        @else
            <!-- The application is using some other disk... -->
        @enddisk
    </div>
@elsedisk ("s3")
    <!-- The application is using the s3 disk... -->
@else
    <!-- The application is using some other disk... -->
@enddisk`
        );
    });
});