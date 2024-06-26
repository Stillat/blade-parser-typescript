import { AbstractNode } from '../../nodes/nodes.js';
import { NodeCompiler } from '../nodeCompiler.js';
import { ComponentCompiler } from './component.js';

export class EndComponentClassCompiler implements NodeCompiler {
    private componentCompiler: ComponentCompiler;

    constructor(componentCompiler: ComponentCompiler) {
        this.componentCompiler = componentCompiler;
    }

    compile(node: AbstractNode): string {
        const componentHash = this.componentCompiler.getClassHash();
        this.componentCompiler.popHash();

        return `'<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal${componentHash})): ?>
<?php $component = $__componentOriginal${componentHash}; ?>
<?php unset($__componentOriginal${componentHash}); ?>
<?php endif; ?>`;
    }
}