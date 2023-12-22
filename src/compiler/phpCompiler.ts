import { BladeDocument } from '../document/bladeDocument.js';
import { BladeComponentNode, BladeEchoNode, BladeEscapedEchoNode, DirectiveNode, LiteralNode } from '../nodes/nodes.js';
import { NodeCompiler } from './nodeCompiler.js';
import * as Compilers from './compilers/index.js';
import { UuidDirectiveIdResolver } from './uuidDirectiveIdResolver.js';
import { ComponentTagCompiler } from './componentTagCompiler.js';

export class PhpCompiler {
    private directiveCompilers: Map<string, NodeCompiler> = new Map();
    private componentCompiler: ComponentTagCompiler;
    private compileComponentBlade = false;
    private unknownDirectiveCompiler: NodeCompiler | null = null;

    private registerDefaults() {
        this.registerCompiler('canany', new Compilers.CanAnyCompiler());
        this.registerCompiler('elsecanany', new Compilers.ElseCanAnyCompiler());
        this.registerCompiler('endcan', new Compilers.EndCanCompiler());
        this.registerCompiler('append', new Compilers.AppendCompiler());
        this.registerCompiler('break', new Compilers.BreakCompiler());
        this.registerCompiler('for', new Compilers.ForCompiler());
        this.registerCompiler('endfor', new Compilers.EndForCompiler());
        this.registerCompiler('cannot', new Compilers.CannotCompiler());
        this.registerCompiler('elsecannot', new Compilers.ElseCannotCompiler());
        this.registerCompiler('endcannot', new Compilers.EndCannotCompiler());
        this.registerCompiler('can', new Compilers.CanCompiler());
        this.registerCompiler('elsecan', new Compilers.ElseCanCompiler());
        this.registerCompiler('checked', new Compilers.CheckedCompiler());
        this.registerCompiler('disabled', new Compilers.DisabledCompiler());
        this.registerCompiler('selected', new Compilers.SelectedCompiler());
        this.registerCompiler('class', new Compilers.ClassCompiler());
        this.registerCompiler('componentFirst', new Compilers.ComponentFirstCompiler());
        this.registerCompiler('continue', new Compilers.ContinueCompiler());
        this.registerCompiler('auth', new Compilers.AuthCompiler());
        this.registerCompiler('elseauth', new Compilers.ElseAuthCompiler());
        this.registerCompiler('endauth', new Compilers.EndAuthCompiler());
        this.registerCompiler('guest', new Compilers.GuestCompiler());
        this.registerCompiler('elseguest', new Compilers.ElseGuestCompiler());
        this.registerCompiler('endguest', new Compilers.EndGuestCompiler());
        this.registerCompiler('if', new Compilers.IfCompiler());
        this.registerCompiler('elseif', new Compilers.ElseIfCompiler());
        this.registerCompiler('endif', new Compilers.EndIfCompiler());
        this.registerCompiler('else', new Compilers.ElseCompiler());
        this.registerCompiler('endsection', new Compilers.EndSectionCompiler());
        this.registerCompiler('env', new Compilers.EnvCompiler());
        this.registerCompiler('endenv', new Compilers.EndEnvCompiler());
        this.registerCompiler('production', new Compilers.ProductionCompiler());
        this.registerCompiler('endproduction', new Compilers.EndProductionCompiler());
        this.registerCompiler('error', new Compilers.ErrorCompiler());
        this.registerCompiler('enderror', new Compilers.EndErrorCompiler());
        this.registerCompiler('lang', new Compilers.LangCompiler());
        this.registerCompiler('choice', new Compilers.ChoiceCompiler());
        this.registerCompiler('extends', new Compilers.ExtendsCompiler());
        this.registerCompiler('foreach', new Compilers.ForEachCompiler());
        this.registerCompiler('endforeach', new Compilers.EndForEachCompiler());

        const forElse = new Compilers.ForElseCompiler();

        this.registerCompiler('forelse', forElse);
        this.registerCompiler('empty', new Compilers.EmptyCompiler(forElse));
        this.registerCompiler('endempty', new Compilers.EndEmptyCompiler());
        this.registerCompiler('endforelse', new Compilers.EndForElseCompiler());
        this.registerCompiler('hasSection', new Compilers.HasSectionCompiler());
        this.registerCompiler('csrf', new Compilers.CsrfCompiler());
        this.registerCompiler('method', new Compilers.MethodCompiler());
        this.registerCompiler('dd', new Compilers.DdCompiler());
        this.registerCompiler('dump', new Compilers.DumpCompiler());
        this.registerCompiler('vite', new Compilers.ViteCompiler());
        this.registerCompiler('viteReactRefresh', new Compilers.ViteReactRefreshCompiler());
        this.registerCompiler('isset', new Compilers.IssetCompiler());
        this.registerCompiler('endisset', new Compilers.EndIssetCompiler());

        const switchCompiler = new Compilers.SwitchCompiler();

        this.registerCompiler('switch', switchCompiler);
        this.registerCompiler('case', new Compilers.CaseCompiler(switchCompiler));
        this.registerCompiler('endswitch', new Compilers.EndSwitchCompiler());
        this.registerCompiler('each', new Compilers.EachCompiler());
        this.registerCompiler('include', new Compilers.IncludeCompiler());
        this.registerCompiler('includeFirst', new Compilers.IncludeFirstCompiler());
        this.registerCompiler('includeIf', new Compilers.IncludeIfCompiler());
        this.registerCompiler('includeUnless', new Compilers.IncludeUnlessCompiler());
        this.registerCompiler('includeWhen', new Compilers.IncludeWhenCompiler());
        this.registerCompiler('inject', new Compilers.InjectCompiler());
        this.registerCompiler('json', new Compilers.JsonCompiler());
        this.registerCompiler('js', new Compilers.JsCompiler());
        this.registerCompiler('overwrite', new Compilers.OverwriteCompiler());
        this.registerCompiler('php', new Compilers.PhpDirectiveCompiler());
        this.registerCompiler('endphp', new Compilers.EndPhpCompiler());
        this.registerCompiler('verbatim', new Compilers.VerbatimCompiler());
        this.registerCompiler('endverbatim', new Compilers.EndVerbatimCompiler());
        this.registerCompiler('prepend', new Compilers.PrependCompiler());
        this.registerCompiler('endprepend', new Compilers.EndPrependCompiler());

        const prependOnceCompiler = new Compilers.PrependOnceCompiler(new UuidDirectiveIdResolver());
        this.registerCompiler('prependOnce', prependOnceCompiler);
        this.registerCompiler('endPrependOnce', new Compilers.EndPrependOnceCompiler());
        this.registerCompiler('props', new Compilers.PropsCompiler());

        this.registerCompiler('push', new Compilers.PushCompiler());
        this.registerCompiler('endpush', new Compilers.EndPushCompiler());
        const pushOnceCompiler = new Compilers.PushOnceCompiler(new UuidDirectiveIdResolver());
        this.registerCompiler('pushOnce', pushOnceCompiler);
        this.registerCompiler('endPushOnce', new Compilers.EndPushOnceCompiler());
        this.registerCompiler('sectionMissing', new Compilers.SectionMissingCompiler());
        this.registerCompiler('section', new Compilers.SectionCompiler());
        this.registerCompiler('show', new Compilers.ShowCompiler());
        this.registerCompiler('stack', new Compilers.StackCompiler());
        this.registerCompiler('stop', new Compilers.StopCompiler());
        this.registerCompiler('unless', new Compilers.UnlessCompiler());
        this.registerCompiler('endunless', new Compilers.EndUnlessCompiler());
        this.registerCompiler('unset', new Compilers.UnsetCompiler());
        this.registerCompiler('while', new Compilers.WhileCompiler());
        this.registerCompiler('endwhile', new Compilers.EndWhileCompiler());
        this.registerCompiler('yield', new Compilers.YieldCompiler());
        const componentCompiler = new Compilers.ComponentCompiler();
        this.registerCompiler('component', componentCompiler);
        this.registerCompiler('endcomponent', new Compilers.EndComponentCompiler());
        this.registerCompiler('slot', new Compilers.SlotCompiler());
        this.registerCompiler('endslot', new Compilers.EndSlotCompiler());
        this.registerCompiler('endcomponentClass', new Compilers.EndComponentClassCompiler(componentCompiler));
    }

    setCompileComponentTagBlade(compileBlade: boolean) {
        this.compileComponentBlade = compileBlade;

        return this;
    }

    getComponentCompiler() {
        return this.componentCompiler;
    }

    registerCompilers(compilers: Map<string, NodeCompiler>) {
        this.directiveCompilers = compilers;

        return this;
    }

    setUnknownDirectiveCompiler(compiler: NodeCompiler | null) {
        this.unknownDirectiveCompiler = compiler;

        return this;
    }

    clone(): PhpCompiler {
        const compiler = new PhpCompiler();
        compiler.registerCompilers(this.directiveCompilers);

        return compiler;
    }

    constructor() {
        this.componentCompiler = new ComponentTagCompiler();
        this.registerDefaults();
    }

    registerCompiler(directiveName: string, compiler: NodeCompiler) {
        this.directiveCompilers.set(directiveName, compiler);

        return this;
    }

    getCompiler(directiveName: string): NodeCompiler | null {
        if (!this.directiveCompilers.has(directiveName)) { return null; }

        return this.directiveCompilers.get(directiveName) as NodeCompiler;
    }

    static compileString(template: string): string {
        const compiler = new PhpCompiler();

        return compiler.compile(BladeDocument.fromText(template));
    }

    compile(document: BladeDocument) {
        const nodes = document.getAllNodes();
        let compiled = '';
        nodes.forEach((node) => {
            if (node instanceof BladeEscapedEchoNode) {
                compiled += '<?php echo ' + node.content.trim() + '; ?>';
            } else if (node instanceof BladeEchoNode) {
                compiled += '<?php echo e(' + node.content.trim() + '); ?>';
            } else if (node instanceof DirectiveNode) {
                if (!this.directiveCompilers.has(node.directiveName)) {
                    if (this.unknownDirectiveCompiler == null) {
                        throw new Error('No compiler provided for ' + node.directiveName);
                    } else {
                        compiled += this.unknownDirectiveCompiler.compile(node);
                    }
                } else {
                    compiled += this.directiveCompilers.get(node.directiveName)?.compile(node);
                }
            } else if (node instanceof LiteralNode) {
                compiled += node.getOutputContent();
            } else if (node instanceof BladeComponentNode) {
                let tagResult = this.componentCompiler.compile(node);

                if (this.compileComponentBlade) {
                    tagResult = this.clone().compile(BladeDocument.fromText(tagResult));
                }

                compiled += tagResult;
            }
        });

        return compiled;
    }
}