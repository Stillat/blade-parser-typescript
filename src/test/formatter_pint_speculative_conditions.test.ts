import assert from 'assert';
import { formatBladeStringWithPint } from '../formatting/prettier/utils.js';

suite('Pint Transformer: Speculative Conditions', () => {
    test('pint: it can format detected custom conditions', async () => {
        assert.strictEqual(
            (await formatBladeStringWithPint(`@disk('local')
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
@enddisk`)).trim(),
            `@disk('local')
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
@enddisk`
        );
    });
});