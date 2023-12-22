import * as tailwind from 'prettier-plugin-tailwindcss';
import { addHtmlPlugin, clearAdditionalHtmlPlugins } from '../../formatting/prettier/utils.js';
import { afterEach, beforeEach } from 'mocha';

function addTailwindPlugin() {
    addHtmlPlugin(tailwind);
}

export function setupTestHooks() {
    beforeEach(function () {
        addTailwindPlugin();
    });

    afterEach(() => {
        clearAdditionalHtmlPlugins();
    });
}