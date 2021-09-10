(function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    /* src\Notepad.svelte generated by Svelte v3.42.4 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (180:10) {#if forUser.text !== 'za sebe'}
    function create_if_block(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let div0;
    	let input;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Zatražio nove podatke:";
    			t1 = space();
    			div0 = element("div");
    			input = element("input");
    			attr(label, "class", "label is-small");
    			attr(input, "class", "input is-small");
    			attr(input, "type", "text");
    			attr(input, "placeholder", "");
    			attr(div0, "class", "control");
    			attr(div1, "class", "field");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, label);
    			append(div1, t1);
    			append(div1, div0);
    			append(div0, input);
    			set_input_value(input, /*mailSender*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen(input, "input", /*input_input_handler*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*mailSender*/ 1 && input.value !== /*mailSender*/ ctx[0]) {
    				set_input_value(input, /*mailSender*/ ctx[0]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (213:16) {#each users as user}
    function create_each_block_3(ctx) {
    	let label;
    	let input;
    	let input_value_value;
    	let t0;
    	let t1_value = /*user*/ ctx[36].name + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr(input, "class", "is-small");
    			attr(input, "type", "radio");
    			input.__value = input_value_value = /*user*/ ctx[36];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[19][0].push(input);
    			attr(label, "class", "radio");
    		},
    		m(target, anchor) {
    			insert(target, label, anchor);
    			append(label, input);
    			input.checked = input.__value === /*selectedUser*/ ctx[1];
    			append(label, t0);
    			append(label, t1);
    			append(label, t2);

    			if (!mounted) {
    				dispose = listen(input, "change", /*input_change_handler*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*selectedUser*/ 2) {
    				input.checked = input.__value === /*selectedUser*/ ctx[1];
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(label);
    			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (236:20) {#each mainBodies as main}
    function create_each_block_2(ctx) {
    	let option;
    	let t0_value = /*main*/ ctx[33].text + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	return {
    		c() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*main*/ ctx[33];
    			option.value = option.__value;
    		},
    		m(target, anchor) {
    			insert(target, option, anchor);
    			append(option, t0);
    			append(option, t1);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(option);
    		}
    	};
    }

    // (258:20) {#each operatingSystems as system}
    function create_each_block_1(ctx) {
    	let option;
    	let t0_value = /*system*/ ctx[30].os + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	return {
    		c() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*system*/ ctx[30];
    			option.value = option.__value;
    		},
    		m(target, anchor) {
    			insert(target, option, anchor);
    			append(option, t0);
    			append(option, t1);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(option);
    		}
    	};
    }

    // (272:14) {#each actions as action}
    function create_each_block(ctx) {
    	let label;
    	let input;
    	let input_value_value;
    	let t0;
    	let t1_value = /*action*/ ctx[27].name + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr(input, "class", "is-small");
    			attr(input, "type", "radio");
    			input.__value = input_value_value = /*action*/ ctx[27];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[19][1].push(input);
    			attr(label, "class", "radio");
    		},
    		m(target, anchor) {
    			insert(target, label, anchor);
    			append(label, input);
    			input.checked = input.__value === /*selectedAction*/ ctx[4];
    			append(label, t0);
    			append(label, t1);
    			append(label, t2);

    			if (!mounted) {
    				dispose = listen(input, "change", /*input_change_handler_1*/ ctx[22]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*selectedAction*/ 16) {
    				input.checked = input.__value === /*selectedAction*/ ctx[4];
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(label);
    			/*$$binding_groups*/ ctx[19][1].splice(/*$$binding_groups*/ ctx[19][1].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let div32;
    	let div10;
    	let div8;
    	let form;
    	let div1;
    	let label0;
    	let t1;
    	let div0;
    	let input0;
    	let t2;
    	let div3;
    	let label1;
    	let t4;
    	let div2;
    	let input1;
    	let t5;
    	let div5;
    	let label2;
    	let t7;
    	let div4;
    	let input2;
    	let t8;
    	let div7;
    	let label3;
    	let t10;
    	let div6;
    	let input3;
    	let t11;
    	let t12;
    	let div9;
    	let button;
    	let t14;
    	let div31;
    	let div30;
    	let div20;
    	let div11;
    	let t16;
    	let div14;
    	let div13;
    	let div12;
    	let t17;
    	let div15;
    	let t19;
    	let div19;
    	let div18;
    	let div17;
    	let div16;
    	let select0;
    	let t20;
    	let div28;
    	let div21;
    	let t22;
    	let div27;
    	let div24;
    	let div23;
    	let div22;
    	let select1;
    	let t23;
    	let div25;
    	let t25;
    	let div26;
    	let t26;
    	let div29;
    	let textarea;
    	let mounted;
    	let dispose;
    	let if_block = /*forUser*/ ctx[2].text !== 'za sebe' && create_if_block(ctx);
    	let each_value_3 = /*users*/ ctx[10];
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*mainBodies*/ ctx[11];
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*operatingSystems*/ ctx[12];
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*actions*/ ctx[13];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			div32 = element("div");
    			div10 = element("div");
    			div8 = element("div");
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Vlasnik mTokena";
    			t1 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t2 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Serijski broj mTokena";
    			t4 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t5 = space();
    			div5 = element("div");
    			label2 = element("label");
    			label2.textContent = "Korisnički identifikator";
    			t7 = space();
    			div4 = element("div");
    			input2 = element("input");
    			t8 = space();
    			div7 = element("div");
    			label3 = element("label");
    			label3.textContent = "Aktivacijski kod";
    			t10 = space();
    			div6 = element("div");
    			input3 = element("input");
    			t11 = space();
    			if (if_block) if_block.c();
    			t12 = space();
    			div9 = element("div");
    			button = element("button");
    			button.textContent = "Kopiraj";
    			t14 = space();
    			div31 = element("div");
    			div30 = element("div");
    			div20 = element("div");
    			div11 = element("div");
    			div11.innerHTML = `<label class="label">Od:</label>`;
    			t16 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t17 = space();
    			div15 = element("div");
    			div15.innerHTML = `<label class="label">Za:</label>`;
    			t19 = space();
    			div19 = element("div");
    			div18 = element("div");
    			div17 = element("div");
    			div16 = element("div");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t20 = space();
    			div28 = element("div");
    			div21 = element("div");
    			div21.innerHTML = `<label class="label">OS:</label>`;
    			t22 = space();
    			div27 = element("div");
    			div24 = element("div");
    			div23 = element("div");
    			div22 = element("div");
    			select1 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t23 = space();
    			div25 = element("div");
    			div25.innerHTML = `<label class="label">Vrsta akcije:</label>`;
    			t25 = space();
    			div26 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t26 = space();
    			div29 = element("div");
    			textarea = element("textarea");
    			attr(label0, "class", "label is-small");
    			input0.value = /*tokenOwner*/ ctx[7];
    			attr(input0, "class", "input is-small");
    			attr(input0, "type", "text");
    			attr(input0, "placeholder", "");
    			input0.disabled = true;
    			attr(div0, "class", "control");
    			attr(div1, "class", "field");
    			attr(label1, "class", "label is-small");
    			input1.value = /*tokenSerialNumber*/ ctx[6];
    			attr(input1, "class", "input is-small");
    			attr(input1, "type", "text");
    			attr(input1, "placeholder", "");
    			input1.disabled = true;
    			attr(div2, "class", "control");
    			attr(div3, "class", "field");
    			attr(label2, "class", "label is-small");
    			input2.value = /*userIdentificator*/ ctx[8];
    			attr(input2, "class", "input is-small");
    			attr(input2, "type", "text");
    			attr(input2, "placeholder", "");
    			input2.disabled = true;
    			attr(div4, "class", "control");
    			attr(div5, "class", "field");
    			attr(label3, "class", "label is-small");
    			input3.value = /*activationCode*/ ctx[9];
    			attr(input3, "class", "input is-small");
    			attr(input3, "type", "text");
    			attr(input3, "placeholder", "");
    			input3.disabled = true;
    			attr(div6, "class", "control");
    			attr(div7, "class", "field");
    			attr(form, "class", "box");
    			attr(div8, "class", "tile is-child ");
    			attr(button, "class", "button is-primary");
    			attr(div9, "class", "tile is-child ");
    			attr(div10, "class", "tile is-4 is-vertical is-parent");
    			attr(div11, "class", "field ");
    			attr(div12, "class", "control");
    			attr(div13, "class", "field");
    			attr(div14, "class", "field-body");
    			attr(div15, "class", "field is-small");
    			attr(select0, "id", "za");
    			if (/*forUser*/ ctx[2] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[20].call(select0));
    			attr(div16, "class", "select ");
    			attr(div17, "class", "control");
    			attr(div18, "class", "field");
    			attr(div19, "class", "field-body");
    			attr(div20, "class", "field is-horizontal ");
    			attr(div21, "class", "field ");
    			if (/*selectedOS*/ ctx[3] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[21].call(select1));
    			attr(div22, "class", "select ");
    			attr(div23, "class", "control");
    			attr(div24, "class", "field");
    			attr(div25, "class", "field is-small");
    			attr(div26, "class", "control ");
    			attr(div27, "class", "field-body");
    			attr(div28, "class", "field is-horizontal");
    			attr(textarea, "id", "mail");
    			textarea.value = /*mail*/ ctx[5];
    			attr(textarea, "class", "textarea is-primary");
    			attr(textarea, "placeholder", "Write something ...");
    			attr(textarea, "cols", "60");
    			attr(textarea, "rows", "15");
    			attr(div29, "class", "tile is-child ");
    			attr(div30, "class", "tile is-child box");
    			attr(div31, "class", "tile is-vertical is-parent");
    			attr(div32, "class", "tile is-ancestor");
    		},
    		m(target, anchor) {
    			insert(target, div32, anchor);
    			append(div32, div10);
    			append(div10, div8);
    			append(div8, form);
    			append(form, div1);
    			append(div1, label0);
    			append(div1, t1);
    			append(div1, div0);
    			append(div0, input0);
    			append(form, t2);
    			append(form, div3);
    			append(div3, label1);
    			append(div3, t4);
    			append(div3, div2);
    			append(div2, input1);
    			append(form, t5);
    			append(form, div5);
    			append(div5, label2);
    			append(div5, t7);
    			append(div5, div4);
    			append(div4, input2);
    			append(form, t8);
    			append(form, div7);
    			append(div7, label3);
    			append(div7, t10);
    			append(div7, div6);
    			append(div6, input3);
    			append(form, t11);
    			if (if_block) if_block.m(form, null);
    			append(div10, t12);
    			append(div10, div9);
    			append(div9, button);
    			append(div32, t14);
    			append(div32, div31);
    			append(div31, div30);
    			append(div30, div20);
    			append(div20, div11);
    			append(div20, t16);
    			append(div20, div14);
    			append(div14, div13);
    			append(div13, div12);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div12, null);
    			}

    			append(div20, t17);
    			append(div20, div15);
    			append(div20, t19);
    			append(div20, div19);
    			append(div19, div18);
    			append(div18, div17);
    			append(div17, div16);
    			append(div16, select0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(select0, null);
    			}

    			select_option(select0, /*forUser*/ ctx[2]);
    			append(div30, t20);
    			append(div30, div28);
    			append(div28, div21);
    			append(div28, t22);
    			append(div28, div27);
    			append(div27, div24);
    			append(div24, div23);
    			append(div23, div22);
    			append(div22, select1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select1, null);
    			}

    			select_option(select1, /*selectedOS*/ ctx[3]);
    			append(div27, t23);
    			append(div27, div25);
    			append(div27, t25);
    			append(div27, div26);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div26, null);
    			}

    			append(div30, t26);
    			append(div30, div29);
    			append(div29, textarea);

    			if (!mounted) {
    				dispose = [
    					listen(button, "click", copyTextArea),
    					listen(select0, "change", /*getOption*/ ctx[14]),
    					listen(select0, "change", /*select0_change_handler*/ ctx[20]),
    					listen(select1, "change", /*select1_change_handler*/ ctx[21])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (/*forUser*/ ctx[2].text !== 'za sebe') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(form, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*users, selectedUser*/ 1026) {
    				each_value_3 = /*users*/ ctx[10];
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(div12, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty[0] & /*mainBodies*/ 2048) {
    				each_value_2 = /*mainBodies*/ ctx[11];
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*forUser, mainBodies*/ 2052) {
    				select_option(select0, /*forUser*/ ctx[2]);
    			}

    			if (dirty[0] & /*operatingSystems*/ 4096) {
    				each_value_1 = /*operatingSystems*/ ctx[12];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*selectedOS, operatingSystems*/ 4104) {
    				select_option(select1, /*selectedOS*/ ctx[3]);
    			}

    			if (dirty[0] & /*actions, selectedAction*/ 8208) {
    				each_value = /*actions*/ ctx[13];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div26, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*mail*/ 32) {
    				textarea.value = /*mail*/ ctx[5];
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div32);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function copyTextArea() {
    	let textToCopy = document.querySelector('#mail');

    	//console.log(textToCopy.value);
    	let split = textToCopy.value.split('\n\n');

    	//console.log(split);
    	let back = split.join('\n');

    	console.log(back);
    	textToCopy.value = back;
    	textToCopy.select();
    	document.execCommand('copy');
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let helloUser;
    	let osAction;
    	let mail;
    	let tokenSerialNumber = document.querySelector("#content > div > div.w-half.left > div:nth-child(1)").nextElementSibling.innerText;
    	let tokenOwnerFullName = document.querySelector("#content > div > div.w-half.left > div:nth-child(3)").nextElementSibling.innerText.split(' ');
    	let tokenOwner = tokenOwnerFullName[tokenOwnerFullName.length - 1];
    	let userIdentificator = tokenSerialNumber.slice(2);
    	let indexActivation = document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.search('activation_number');
    	document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.search('phone');
    	let log = document.querySelector("#log > tbody > tr:nth-child(2) > td:nth-child(3)").innerText;
    	let activationCode = log.slice(indexActivation + 22, indexActivation + 27);

    	//let activationCode = '010101';
    	let mailSender = '';

    	let users = [
    		{
    			id: 1,
    			msg: `Poštovana gospođo`,
    			name: 'Gđa.'
    		},
    		{
    			id: 2,
    			msg: `Poštovani gospodine`,
    			name: 'Gdin.'
    		}
    	];

    	let selectedUser = users[0];

    	let mainBodies = [
    		{
    			msg: `,

mToken djelatnice ${tokenOwner} je`,
    			text: 'za gospođu'
    		},
    		{
    			msg: `,

mToken djelatnika ${tokenOwner} je`,
    			text: 'za gospodina'
    		},
    		{
    			msg: `,

mToken je uspješno`,
    			text: 'za sebe'
    		}
    	];

    	let forUser = mainBodies[0];

    	let operatingSystems = [
    		{
    			id: 1,
    			msg: `Budući da se radi o sustavu Android, za aktivaciju je potrebno koristiti aktivacijski kod (${activationCode}).`,
    			os: 'Android'
    		},
    		{
    			id: 2,
    			msg: `U slučaju da se radi o sustavu iOS, za aktivaciju se koriste inicijalna lozinka i korisnički identifikator.

Inicijalna lozinka: ${activationCode}
Korisnički identifikator: ${userIdentificator} `,
    			os: 'iOS'
    		},
    		{
    			id: 3,
    			msg: ` Ako se radi o sustavu Android, za aktivaciju je potrebno koristiti aktivacijski kod. U slučaju da se radi o sustavu iOS, za aktivaciju se koriste inicijalna lozinka i korisnički identifikator.

Aktivacijski kod/inicijalna lozinka: ${activationCode}
Korisnički identifikator: ${userIdentificator}`,
    			os: 'Nepoznat'
    		}
    	];

    	let selectedOS = operatingSystems[0];

    	let actions = [
    		{
    			id: 1,
    			status: 'aktiviran.',
    			name: 'Aktivacija',
    			msg: `Ako ćete mToken koristiti za prijavu u e-Dnevnik, prije prve prijave potrebno je da e-Dnevnik administrator Vaše škole unese serijski broj mTokena ${tokenSerialNumber} u sustav.`
    		},
    		{
    			id: 2,
    			status: 'reaktiviran.',
    			name: 'Reaktivacija',
    			msg: `Serijski broj mTokena ostaje isti, odnosno ${tokenSerialNumber}.`
    		}
    	];

    	let selectedAction = actions[0];

    	function getOption() {
    		let select = document.getElementById('za');
    		let selectedValue = select.options[select.selectedIndex].innerText;

    		if (selectedValue === 'za sebe ') {
    			console.log(selectedValue);
    			$$invalidate(0, mailSender = tokenOwner);
    		}
    	}

    	const $$binding_groups = [[], []];

    	function input_input_handler() {
    		mailSender = this.value;
    		$$invalidate(0, mailSender);
    	}

    	function input_change_handler() {
    		selectedUser = this.__value;
    		$$invalidate(1, selectedUser);
    	}

    	function select0_change_handler() {
    		forUser = select_value(this);
    		$$invalidate(2, forUser);
    		$$invalidate(11, mainBodies);
    	}

    	function select1_change_handler() {
    		selectedOS = select_value(this);
    		$$invalidate(3, selectedOS);
    		$$invalidate(12, operatingSystems);
    	}

    	function input_change_handler_1() {
    		selectedAction = this.__value;
    		$$invalidate(4, selectedAction);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*selectedUser, mailSender, forUser*/ 7) {
    			$$invalidate(16, helloUser = `${selectedUser.msg} ${mailSender}${forUser.msg}`);
    		}

    		if ($$self.$$.dirty[0] & /*selectedAction, selectedOS*/ 24) {
    			$$invalidate(15, osAction = `${selectedAction.status} ${selectedOS.msg}`);
    		}

    		if ($$self.$$.dirty[0] & /*helloUser, osAction, selectedAction*/ 98320) {
    			// main msg
    			$$invalidate(5, mail = `${helloUser} ${osAction} 

${selectedAction.msg}

Za sve ostale upite stojimo Vam na raspolaganju.`);
    		}
    	};

    	return [
    		mailSender,
    		selectedUser,
    		forUser,
    		selectedOS,
    		selectedAction,
    		mail,
    		tokenSerialNumber,
    		tokenOwner,
    		userIdentificator,
    		activationCode,
    		users,
    		mainBodies,
    		operatingSystems,
    		actions,
    		getOption,
    		osAction,
    		helloUser,
    		input_input_handler,
    		input_change_handler,
    		$$binding_groups,
    		select0_change_handler,
    		select1_change_handler,
    		input_change_handler_1
    	];
    }

    class Notepad extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, null, [-1, -1]);
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.4 */

    function create_fragment(ctx) {
    	let main;
    	let notepad;
    	let current;
    	notepad = new Notepad({});

    	return {
    		c() {
    			main = element("main");
    			create_component(notepad.$$.fragment);
    			attr(main, "class", "container is-max-desktop");
    		},
    		m(target, anchor) {
    			insert(target, main, anchor);
    			mount_component(notepad, main, null);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(notepad.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(notepad.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(main);
    			destroy_component(notepad);
    		}
    	};
    }

    function instance($$self) {

    	return [];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, {});
    	}
    }

    // inject bulma css
    let headTag = document.head;

    const agentStatusIconLink = document.createElement('link');
    agentStatusIconLink.rel = 'stylesheet';
    agentStatusIconLink.href = "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma-rtl.min.css";
    headTag.append(agentStatusIconLink);

    const background = document.querySelector("#content > div");
    let placement = document.createElement("section");
    background.after(placement);


    const app = new App({
        target:placement
    });

    return app;

}());
//# sourceMappingURL=bundles.js.map
