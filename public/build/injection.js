(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
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
    function empty() {
        return text('');
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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\User.svelte generated by Svelte v3.42.4 */

    const file$7 = "src\\User.svelte";

    // (13:5) {:else}
    function create_else_block$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Stranger!";
    			attr_dev(span, "class", "is-size-8");
    			add_location(span, file$7, 13, 5, 218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(13:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:5) {#if user != ''}
    function create_if_block$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = `${/*user*/ ctx[0]}!`;
    			attr_dev(span, "class", "has-text-primary is-size-8");
    			add_location(span, file$7, 9, 5, 125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(9:5) {#if user != ''}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;

    	function select_block_type(ctx, dirty) {
    		if (/*user*/ ctx[0] != '') return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-zx9gig");
    			add_location(main, file$7, 7, 1, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_block.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('User', slots, []);
    	let user = '';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<User> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ user });

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user];
    }

    class User extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "User",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\Header.svelte generated by Svelte v3.42.4 */
    const file$6 = "src\\Header.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let section;
    	let div;
    	let h10;
    	let t3;
    	let h11;
    	let t4;
    	let user;
    	let current;
    	user = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			section = element("section");
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = `${/*heading*/ ctx[0]}  ${/*manifestData*/ ctx[1]}`;
    			t3 = space();
    			h11 = element("h1");
    			t4 = text("Hi ");
    			create_component(user.$$.fragment);
    			attr_dev(h10, "class", "title");
    			add_location(h10, file$6, 12, 6, 251);
    			attr_dev(div, "class", "container");
    			add_location(div, file$6, 11, 4, 220);
    			attr_dev(h11, "class", "subtitle");
    			add_location(h11, file$6, 14, 4, 316);
    			attr_dev(section, "class", "section");
    			add_location(section, file$6, 10, 2, 189);
    			attr_dev(main, "class", "svelte-19jtqi4");
    			add_location(main, file$6, 9, 0, 179);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section);
    			append_dev(section, div);
    			append_dev(div, h10);
    			append_dev(section, t3);
    			append_dev(section, h11);
    			append_dev(h11, t4);
    			mount_component(user, h11, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(user);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let heading = 'CN Helper';
    	let manifestData = '';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ User, heading, manifestData });

    	$$self.$inject_state = $$props => {
    		if ('heading' in $$props) $$invalidate(0, heading = $$props.heading);
    		if ('manifestData' in $$props) $$invalidate(1, manifestData = $$props.manifestData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [heading, manifestData];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\SearchSchool.svelte generated by Svelte v3.42.4 */

    const file$5 = "src\\SearchSchool.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let section;
    	let div0;
    	let input_1;
    	let t;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			section = element("section");
    			div0 = element("div");
    			input_1 = element("input");
    			t = space();
    			div1 = element("div");
    			attr_dev(input_1, "class", "input is-rounded");
    			attr_dev(input_1, "placeholder", "Search schools...");
    			attr_dev(input_1, "type", "text");
    			add_location(input_1, file$5, 103, 6, 3504);
    			attr_dev(div0, "class", "container");
    			add_location(div0, file$5, 102, 4, 3473);
    			attr_dev(div1, "id", "school-search_list");
    			add_location(div1, file$5, 111, 4, 3703);
    			attr_dev(section, "class", "section");
    			add_location(section, file$5, 101, 2, 3442);
    			add_location(main, file$5, 100, 0, 3432);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section);
    			append_dev(section, div0);
    			append_dev(div0, input_1);
    			set_input_value(input_1, /*input*/ ctx[0]);
    			append_dev(section, t);
    			append_dev(section, div1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						input_1,
    						"input",
    						function () {
    							if (is_function(/*searchSchools*/ ctx[1](/*input*/ ctx[0]))) /*searchSchools*/ ctx[1](/*input*/ ctx[0]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[2])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*input*/ 1 && input_1.value !== /*input*/ ctx[0]) {
    				set_input_value(input_1, /*input*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchSchool', slots, []);
    	let input = '';

    	// search and filter school.csv
    	const searchSchools = async function (userInput) {
    		let data = await fetchSchools('skole_matica2.csv');
    		let schoolList = cleanData(data);

    		/*
      match input and data
      - regular expressions are patterns used to match character combinations in strings. In JavaScript, regular expressions are also objects.
      - filter array with regular expression.
      - reg exp is an object. ^ matches the beginning of input. npr. when user types letter A, all strings that start with letter A are found. g is global and i is insensitive.
      . we get match if array first element (šifra) matches regex or if it matches array second element (naziv)
      */
    		let matches = schoolList.filter(schoolMatch => {
    			const regex = new RegExp(`${userInput}`, 'gi');
    			return schoolMatch[0].match(regex) || schoolMatch[2].match(regex);
    		});

    		clearIfInputEmpty();
    		showResults(matches);

    		// listener for each results div
    		getResultsDiv().forEach(e => {
    			e.addEventListener('click', () => {
    				const schoolListDiv = document.getElementById('school-search_list');
    				e.classList.add('has-background-info-light');

    				// get clicked div school name and show only that school
    				let schoolName = e.querySelector('.school-name').innerText;

    				schoolListDiv.innerHTML = e.outerHTML;

    				// fill input with clicked div's school name
    				$$invalidate(0, input = schoolName);
    			});
    		});

    		// functions
    		async function fetchSchools(table) {
    			let response = await fetch(table);
    			let data = await response.text();
    			return data;
    		}

    		function cleanData(data) {
    			let rows = data.split('\n').slice(1);

    			// we need to make an array of arrays since we dont have json format. We loop through each row, split it on ; make an array and push it to array schoolList.
    			let schoolList = [];

    			rows.forEach(row => {
    				let rowElements = row.split(';');

    				// rowElements.splice(2, 5);
    				// rowElements.splice(4, 6);
    				schoolList.push(rowElements);
    			});

    			return schoolList;
    		}

    		function showResults(matches) {
    			if (matches.length > 0) {
    				// we get an array of html strings
    				// then we use join method to convert them to strings
    				const matcheshtml = matches.map(match => `<div class= 'box mt-2'>
              <h3 class = 'school-name'> ${match[2]} </h3>
              <p> Šifra ustanove: ${match[0]}  <br> 
            </div>`).join('');

    				const schoolListDiv = document.getElementById('school-search_list');
    				schoolListDiv.innerHTML = matcheshtml;
    			} //return matcheshtml
    		}

    		function clearIfInputEmpty() {
    			//clean matches if empty input text
    			if (input === '') {
    				matches = [];
    				document.getElementById('school-search_list').innerHTML = '';
    			}
    		}

    		function getResultsDiv() {
    			// testing clicked div
    			let resultsDiv = document.getElementById('school-search_list');

    			let schoolListResult = resultsDiv.childNodes;
    			return schoolListResult;
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchSchool> was created with unknown prop '${key}'`);
    	});

    	function input_1_input_handler() {
    		input = this.value;
    		$$invalidate(0, input);
    	}

    	$$self.$capture_state = () => ({ input, searchSchools });

    	$$self.$inject_state = $$props => {
    		if ('input' in $$props) $$invalidate(0, input = $$props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [input, searchSchools, input_1_input_handler];
    }

    class SearchSchool extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchSchool",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\SearchTab.svelte generated by Svelte v3.42.4 */
    const file$4 = "src\\SearchTab.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let searchschool;
    	let current;
    	searchschool = new SearchSchool({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Search tab";
    			t1 = space();
    			create_component(searchschool.$$.fragment);
    			add_location(h1, file$4, 7, 6, 101);
    			attr_dev(main, "class", "svelte-kukug3");
    			add_location(main, file$4, 6, 2, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(searchschool, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchschool.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchschool.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(searchschool);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchTab', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchTab> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SearchSchool });
    	return [];
    }

    class SearchTab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchTab",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\Notepad.svelte generated by Svelte v3.42.4 */

    const { console: console_1 } = globals;
    const file$3 = "src\\Notepad.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    // (169:10) {#if forUser.text !== 'za sebe'}
    function create_if_block$1(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let div0;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Zatražio nove podatke:";
    			t1 = space();
    			div0 = element("div");
    			input = element("input");
    			attr_dev(label, "class", "label is-small");
    			add_location(label, file$3, 170, 14, 4805);
    			attr_dev(input, "class", "input is-small");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "");
    			add_location(input, file$3, 172, 16, 4920);
    			attr_dev(div0, "class", "control");
    			add_location(div0, file$3, 171, 14, 4881);
    			attr_dev(div1, "class", "field");
    			add_location(div1, file$3, 169, 12, 4770);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*mailSender*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*mailSender*/ 1 && input.value !== /*mailSender*/ ctx[0]) {
    				set_input_value(input, /*mailSender*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(169:10) {#if forUser.text !== 'za sebe'}",
    		ctx
    	});

    	return block;
    }

    // (202:16) {#each users as user}
    function create_each_block_3(ctx) {
    	let label;
    	let input;
    	let t0;
    	let t1_value = /*user*/ ctx[32].name + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "class", "is-small");
    			attr_dev(input, "type", "radio");
    			input.__value = /*user*/ ctx[32];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[19][0].push(input);
    			add_location(input, file$3, 203, 20, 5796);
    			attr_dev(label, "class", "radio");
    			add_location(label, file$3, 202, 18, 5753);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*selectedUser*/ ctx[1];
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedUser*/ 2) {
    				input.checked = input.__value === /*selectedUser*/ ctx[1];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(202:16) {#each users as user}",
    		ctx
    	});

    	return block;
    }

    // (225:20) {#each mainBodies as main}
    function create_each_block_2(ctx) {
    	let option;
    	let t0_value = /*main*/ ctx[29].text + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*main*/ ctx[29];
    			option.value = option.__value;
    			add_location(option, file$3, 225, 22, 6535);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(225:20) {#each mainBodies as main}",
    		ctx
    	});

    	return block;
    }

    // (247:20) {#each operatingSystems as system}
    function create_each_block_1(ctx) {
    	let option;
    	let t0_value = /*system*/ ctx[26].os + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*system*/ ctx[26];
    			option.value = option.__value;
    			add_location(option, file$3, 247, 22, 7205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(247:20) {#each operatingSystems as system}",
    		ctx
    	});

    	return block;
    }

    // (261:14) {#each actions as action}
    function create_each_block$1(ctx) {
    	let label;
    	let input;
    	let t0;
    	let t1_value = /*action*/ ctx[23].name + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "class", "is-small");
    			attr_dev(input, "type", "radio");
    			input.__value = /*action*/ ctx[23];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[19][1].push(input);
    			add_location(input, file$3, 262, 18, 7680);
    			attr_dev(label, "class", "radio");
    			add_location(label, file$3, 261, 16, 7639);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*selectedAction*/ ctx[4];
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[22]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedAction*/ 16) {
    				input.checked = input.__value === /*selectedAction*/ ctx[4];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[19][1].splice(/*$$binding_groups*/ ctx[19][1].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(261:14) {#each actions as action}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
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
    	let label4;
    	let t16;
    	let div14;
    	let div13;
    	let div12;
    	let t17;
    	let div15;
    	let label5;
    	let t19;
    	let div19;
    	let div18;
    	let div17;
    	let div16;
    	let select0;
    	let t20;
    	let div28;
    	let div21;
    	let label6;
    	let t22;
    	let div27;
    	let div24;
    	let div23;
    	let div22;
    	let select1;
    	let t23;
    	let div25;
    	let label7;
    	let t25;
    	let div26;
    	let t26;
    	let div29;
    	let textarea;
    	let mounted;
    	let dispose;
    	let if_block = /*forUser*/ ctx[2].text !== 'za sebe' && create_if_block$1(ctx);
    	let each_value_3 = /*users*/ ctx[10];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*mainBodies*/ ctx[11];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*operatingSystems*/ ctx[12];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*actions*/ ctx[13];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
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
    			label4 = element("label");
    			label4.textContent = "Od:";
    			t16 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t17 = space();
    			div15 = element("div");
    			label5 = element("label");
    			label5.textContent = "Za:";
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
    			label6 = element("label");
    			label6.textContent = "OS:";
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
    			label7 = element("label");
    			label7.textContent = "Vrsta akcije:";
    			t25 = space();
    			div26 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t26 = space();
    			div29 = element("div");
    			textarea = element("textarea");
    			attr_dev(label0, "class", "label is-small");
    			add_location(label0, file$3, 119, 12, 3173);
    			input0.value = /*tokenOwner*/ ctx[6];
    			attr_dev(input0, "class", "input is-small");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "");
    			input0.disabled = true;
    			add_location(input0, file$3, 121, 14, 3277);
    			attr_dev(div0, "class", "control");
    			add_location(div0, file$3, 120, 12, 3240);
    			attr_dev(div1, "class", "field");
    			add_location(div1, file$3, 118, 10, 3140);
    			attr_dev(label1, "class", "label is-small");
    			add_location(label1, file$3, 132, 12, 3549);
    			input1.value = /*tokenSerialNumber*/ ctx[7];
    			attr_dev(input1, "class", "input is-small");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "");
    			input1.disabled = true;
    			add_location(input1, file$3, 134, 14, 3659);
    			attr_dev(div2, "class", "control");
    			add_location(div2, file$3, 133, 12, 3622);
    			attr_dev(div3, "class", "field");
    			add_location(div3, file$3, 131, 10, 3516);
    			attr_dev(label2, "class", "label is-small");
    			add_location(label2, file$3, 144, 12, 3936);
    			input2.value = /*userIdentificator*/ ctx[8];
    			attr_dev(input2, "class", "input is-small");
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "placeholder", "");
    			input2.disabled = true;
    			add_location(input2, file$3, 146, 14, 4049);
    			attr_dev(div4, "class", "control");
    			add_location(div4, file$3, 145, 12, 4012);
    			attr_dev(div5, "class", "field");
    			add_location(div5, file$3, 143, 10, 3903);
    			attr_dev(label3, "class", "label is-small");
    			add_location(label3, file$3, 156, 12, 4326);
    			input3.value = /*activationCode*/ ctx[9];
    			attr_dev(input3, "class", "input is-small");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "placeholder", "");
    			input3.disabled = true;
    			add_location(input3, file$3, 158, 14, 4431);
    			attr_dev(div6, "class", "control");
    			add_location(div6, file$3, 157, 12, 4394);
    			attr_dev(div7, "class", "field");
    			add_location(div7, file$3, 155, 10, 4293);
    			attr_dev(form, "class", "box");
    			add_location(form, file$3, 117, 8, 3110);
    			attr_dev(div8, "class", "tile is-child ");
    			add_location(div8, file$3, 116, 6, 3072);
    			attr_dev(button, "class", "button is-primary");
    			add_location(button, file$3, 185, 8, 5237);
    			attr_dev(div9, "class", "tile is-child ");
    			add_location(div9, file$3, 184, 6, 5199);
    			attr_dev(div10, "class", "tile is-4 is-vertical is-parent");
    			add_location(div10, file$3, 115, 4, 3019);
    			attr_dev(label4, "class", "label");
    			add_location(label4, file$3, 195, 12, 5536);
    			attr_dev(div11, "class", "field ");
    			add_location(div11, file$3, 194, 10, 5502);
    			attr_dev(div12, "class", "control");
    			add_location(div12, file$3, 200, 14, 5673);
    			attr_dev(div13, "class", "field");
    			add_location(div13, file$3, 199, 12, 5638);
    			attr_dev(div14, "class", "field-body");
    			add_location(div14, file$3, 198, 10, 5600);
    			attr_dev(label5, "class", "label");
    			add_location(label5, file$3, 217, 12, 6189);
    			attr_dev(div15, "class", "field is-small");
    			add_location(div15, file$3, 216, 10, 6147);
    			attr_dev(select0, "id", "za");
    			if (/*forUser*/ ctx[2] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[20].call(select0));
    			add_location(select0, file$3, 223, 18, 6404);
    			attr_dev(div16, "class", "select ");
    			add_location(div16, file$3, 222, 16, 6363);
    			attr_dev(div17, "class", "control");
    			add_location(div17, file$3, 221, 14, 6324);
    			attr_dev(div18, "class", "field");
    			add_location(div18, file$3, 220, 12, 6289);
    			attr_dev(div19, "class", "field-body");
    			add_location(div19, file$3, 219, 10, 6251);
    			attr_dev(div20, "class", "field is-horizontal ");
    			add_location(div20, file$3, 193, 8, 5456);
    			attr_dev(label6, "class", "label");
    			add_location(label6, file$3, 238, 12, 6876);
    			attr_dev(div21, "class", "field ");
    			add_location(div21, file$3, 237, 10, 6842);
    			if (/*selectedOS*/ ctx[3] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[21].call(select1));
    			add_location(select1, file$3, 245, 18, 7093);
    			attr_dev(div22, "class", "select ");
    			add_location(div22, file$3, 244, 16, 7052);
    			attr_dev(div23, "class", "control");
    			add_location(div23, file$3, 243, 14, 7013);
    			attr_dev(div24, "class", "field");
    			add_location(div24, file$3, 242, 12, 6978);
    			attr_dev(label7, "class", "label");
    			add_location(label7, file$3, 257, 14, 7482);
    			attr_dev(div25, "class", "field is-small");
    			add_location(div25, file$3, 256, 12, 7438);
    			attr_dev(div26, "class", "control ");
    			add_location(div26, file$3, 259, 12, 7558);
    			attr_dev(div27, "class", "field-body");
    			add_location(div27, file$3, 241, 10, 6940);
    			attr_dev(div28, "class", "field is-horizontal");
    			add_location(div28, file$3, 236, 8, 6797);
    			attr_dev(textarea, "id", "mail");
    			textarea.value = /*mail*/ ctx[5];
    			attr_dev(textarea, "class", "textarea is-primary");
    			attr_dev(textarea, "placeholder", "Write something ...");
    			attr_dev(textarea, "cols", "60");
    			attr_dev(textarea, "rows", "15");
    			add_location(textarea, file$3, 362, 10, 10947);
    			attr_dev(div29, "class", "tile is-child ");
    			add_location(div29, file$3, 361, 8, 10907);
    			attr_dev(div30, "class", "tile is-child box");
    			add_location(div30, file$3, 192, 6, 5415);
    			attr_dev(div31, "class", "tile is-vertical is-parent");
    			add_location(div31, file$3, 191, 4, 5367);
    			attr_dev(div32, "class", "tile is-ancestor");
    			add_location(div32, file$3, 114, 2, 2983);
    			attr_dev(main, "class", "svelte-1l46m81");
    			add_location(main, file$3, 113, 0, 2973);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div32);
    			append_dev(div32, div10);
    			append_dev(div10, div8);
    			append_dev(div8, form);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			append_dev(form, t2);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, input1);
    			append_dev(form, t5);
    			append_dev(form, div5);
    			append_dev(div5, label2);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, input2);
    			append_dev(form, t8);
    			append_dev(form, div7);
    			append_dev(div7, label3);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div6, input3);
    			append_dev(form, t11);
    			if (if_block) if_block.m(form, null);
    			append_dev(div10, t12);
    			append_dev(div10, div9);
    			append_dev(div9, button);
    			append_dev(div32, t14);
    			append_dev(div32, div31);
    			append_dev(div31, div30);
    			append_dev(div30, div20);
    			append_dev(div20, div11);
    			append_dev(div11, label4);
    			append_dev(div20, t16);
    			append_dev(div20, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div12);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div12, null);
    			}

    			append_dev(div20, t17);
    			append_dev(div20, div15);
    			append_dev(div15, label5);
    			append_dev(div20, t19);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, select0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(select0, null);
    			}

    			select_option(select0, /*forUser*/ ctx[2]);
    			append_dev(div30, t20);
    			append_dev(div30, div28);
    			append_dev(div28, div21);
    			append_dev(div21, label6);
    			append_dev(div28, t22);
    			append_dev(div28, div27);
    			append_dev(div27, div24);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, select1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select1, null);
    			}

    			select_option(select1, /*selectedOS*/ ctx[3]);
    			append_dev(div27, t23);
    			append_dev(div27, div25);
    			append_dev(div25, label7);
    			append_dev(div27, t25);
    			append_dev(div27, div26);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div26, null);
    			}

    			append_dev(div30, t26);
    			append_dev(div30, div29);
    			append_dev(div29, textarea);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", copyTextArea, false, false, false),
    					listen_dev(select0, "change", /*getOption*/ ctx[14], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[20]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[21])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*forUser*/ ctx[2].text !== 'za sebe') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(form, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*users, selectedUser*/ 1026) {
    				each_value_3 = /*users*/ ctx[10];
    				validate_each_argument(each_value_3);
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
    				validate_each_argument(each_value_2);
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
    				validate_each_argument(each_value_1);
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
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    				prop_dev(textarea, "value", /*mail*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function copyTextArea() {
    	let textToCopy = document.querySelector('#mail');
    	textToCopy.select();
    	document.execCommand('copy');
    	console.log(textToCopy.value);
    	let split = textToCopy.value.split('\n\n');
    	console.log(split);
    	let back = split.join('\n');
    	console.log(back);
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let helloUser;
    	let osAction;
    	let mail;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notepad', slots, []);
    	let tokenOwner = `Čovjekčić`;
    	let tokenSerialNumber = 'CN12345';
    	let userIdentificator = tokenSerialNumber.slice(2);
    	let activationCode = '010101';
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
    			msg: `Budući da se radi o sustavu Android, za aktivaciju je potrebno koristiti aktivacijski kod (${activationCode})`,
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
    			status: 'reaktiviran',
    			name: 'Reaktivacija',
    			msg: `Serijski broj mTokena ostaje isti, odnosno ${tokenSerialNumber}`
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

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Notepad> was created with unknown prop '${key}'`);
    	});

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

    	$$self.$capture_state = () => ({
    		tokenOwner,
    		tokenSerialNumber,
    		userIdentificator,
    		activationCode,
    		mailSender,
    		users,
    		selectedUser,
    		mainBodies,
    		forUser,
    		operatingSystems,
    		selectedOS,
    		actions,
    		selectedAction,
    		copyTextArea,
    		getOption,
    		osAction,
    		helloUser,
    		mail
    	});

    	$$self.$inject_state = $$props => {
    		if ('tokenOwner' in $$props) $$invalidate(6, tokenOwner = $$props.tokenOwner);
    		if ('tokenSerialNumber' in $$props) $$invalidate(7, tokenSerialNumber = $$props.tokenSerialNumber);
    		if ('userIdentificator' in $$props) $$invalidate(8, userIdentificator = $$props.userIdentificator);
    		if ('activationCode' in $$props) $$invalidate(9, activationCode = $$props.activationCode);
    		if ('mailSender' in $$props) $$invalidate(0, mailSender = $$props.mailSender);
    		if ('users' in $$props) $$invalidate(10, users = $$props.users);
    		if ('selectedUser' in $$props) $$invalidate(1, selectedUser = $$props.selectedUser);
    		if ('mainBodies' in $$props) $$invalidate(11, mainBodies = $$props.mainBodies);
    		if ('forUser' in $$props) $$invalidate(2, forUser = $$props.forUser);
    		if ('operatingSystems' in $$props) $$invalidate(12, operatingSystems = $$props.operatingSystems);
    		if ('selectedOS' in $$props) $$invalidate(3, selectedOS = $$props.selectedOS);
    		if ('actions' in $$props) $$invalidate(13, actions = $$props.actions);
    		if ('selectedAction' in $$props) $$invalidate(4, selectedAction = $$props.selectedAction);
    		if ('osAction' in $$props) $$invalidate(15, osAction = $$props.osAction);
    		if ('helloUser' in $$props) $$invalidate(16, helloUser = $$props.helloUser);
    		if ('mail' in $$props) $$invalidate(5, mail = $$props.mail);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*selectedUser, mailSender, forUser*/ 7) {
    			$$invalidate(16, helloUser = `${selectedUser.msg} ${mailSender} ${forUser.msg} `);
    		}

    		if ($$self.$$.dirty[0] & /*selectedAction, selectedOS*/ 24) {
    			$$invalidate(15, osAction = `${selectedAction.status} ${selectedOS.msg}`);
    		}

    		if ($$self.$$.dirty[0] & /*helloUser, osAction, selectedAction*/ 98320) {
    			// main msg
    			$$invalidate(5, mail = ` ${helloUser} ${osAction} 

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
    		tokenOwner,
    		tokenSerialNumber,
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

    class Notepad extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notepad",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\NotepadTab.svelte generated by Svelte v3.42.4 */
    const file$2 = "src\\NotepadTab.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let notepad;
    	let current;
    	notepad = new Notepad({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(notepad.$$.fragment);
    			attr_dev(main, "class", "svelte-6pyazu");
    			add_location(main, file$2, 6, 4, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(notepad, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notepad.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notepad.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(notepad);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotepadTab', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotepadTab> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Notepad });
    	return [];
    }

    class NotepadTab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotepadTab",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Navbar.svelte generated by Svelte v3.42.4 */

    const { Object: Object_1 } = globals;
    const file$1 = "src\\Navbar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (21:6) {#each tabs as tab}
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let t0_value = /*tab*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*tab*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(a, file$1, 26, 10, 716);
    			add_location(li, file$1, 21, 8, 618);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(21:6) {#each tabs as tab}",
    		ctx
    	});

    	return block;
    }

    // (36:2) {:else}
    function create_else_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Welcome.";
    			add_location(h1, file$1, 37, 4, 973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(36:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#if Object.keys(selected).length !== 0}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*selected*/ ctx[0].component;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*selected*/ ctx[0].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(34:2) {#if Object.keys(selected).length !== 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div;
    	let ul;
    	let t;
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let each_value = /*tabs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*selected*/ 1) show_if = !!(Object.keys(/*selected*/ ctx[0]).length !== 0);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if_block.c();
    			add_location(ul, file$1, 19, 4, 577);
    			attr_dev(div, "class", "tabs is-centered is-medium is-toggle is-fullwidth");
    			add_location(div, file$1, 18, 2, 508);
    			attr_dev(main, "class", "svelte-g0cywa");
    			add_location(main, file$1, 17, 0, 498);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(main, t);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selected, tabs*/ 3) {
    				each_value = /*tabs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);

    	let tabs = [
    		{
    			name: 'Traži',
    			value: 1,
    			component: SearchTab
    		},
    		{ name: 'Aplikacije', value: 2 },
    		{
    			name: 'Notepad',
    			value: 3,
    			component: NotepadTab
    		},
    		{ name: 'Kontakti', value: 4 }
    	];

    	//   in production change to empty object
    	let selected = {
    		name: 'Notepad',
    		value: 3,
    		component: NotepadTab
    	};

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = tab => {
    		$$invalidate(0, selected = tab);
    	};

    	$$self.$capture_state = () => ({ SearchTab, NotepadTab, tabs, selected });

    	$$self.$inject_state = $$props => {
    		if ('tabs' in $$props) $$invalidate(1, tabs = $$props.tabs);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, tabs, click_handler];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.4 */

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let heading;
    	let t;
    	let navbar;
    	let current;
    	heading = new Header({ $$inline: true });
    	navbar = new Navbar({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(heading.$$.fragment);
    			t = space();
    			create_component(navbar.$$.fragment);
    			attr_dev(main, "class", "container");
    			add_location(main, file, 12, 0, 265);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(heading, main, null);
    			append_dev(main, t);
    			mount_component(navbar, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading.$$.fragment, local);
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading.$$.fragment, local);
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(heading);
    			destroy_component(navbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let user = { loggedIn: false };

    	function toggle() {
    		user.loggedIn = !user.loggedIn;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Heading: Header, Navbar, user, toggle });

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) user = $$props.user;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
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
//# sourceMappingURL=injection.js.map
