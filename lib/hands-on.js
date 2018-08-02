'use babel';

/**
 * hands-on for atom
 *
 * v0.0.0
 *
 * Arranges distance key on to a middle of keyboard when holding the
 * right Alt (or a key right of the spacebar)
 */


export default {
    cfg: {  // values match the .code property of the keyboard event
        enabler: ['AltRight', 'MetaRight', 'ContextMenu'],

        scroll: {
            up:    'KeyO',
            down:  'KeyI',
            left:  'KeyU',
            right: 'KeyP'
        },

        alias: {
            Backspace:  'BracketLeft',
            Delete:     'BracketRight',

            ArrowUp:    'KeyL',
            ArrowDown:  'KeyK',
            ArrowLeft:  'KeyJ',
            ArrowRight: 'Semicolon',
            Enter:      'Quote',

            PageUp:     'Period',
            PageDown:   'Comma',
            Home:       'KeyM',
            End:        'Slash'
        },

        code: {
            ArrowUp:    38,
            ArrowDown:  40,
            ArrowLeft:  37,
            ArrowRight: 39,
            PageUp:     33,
            PageDown:   34,
            Home:       36,
            End:        35,
            Backspace:  8,
            Delete:     46,
            Enter:      13
        },

        suppress: [  // in addition to all 'Key...' codes
            'BracketLeft',
            'BracketRight',
            'Semicolon',
            'Quote',
            'Backslash',
            'Comma',
            'Period',
            'Slash'
        ],

        modes: { // mode to .key mapping
            ctrlKey:  'Control',
            shiftKey: 'Shift',
            altKey:   'Alt',
            metaKey:  'Meta'
        }
    },

    held: {
        enabler: new Set,
        key:     new Set,
        mode:    new Map
    },

    initialized: false,

    activate() {
        if (!this.initialized) {
            this.init();
            this.initialized = true;
        }

        window.document.addEventListener('keydown', this.keydown, true);
        window.document.addEventListener('keyup', this.keyup, true);
        window.document.addEventListener('keypress', this.keypress, true);
        window.addEventListener('blur', this.blur);
    },

    deactivate() {
        window.document.removeEventListener('keydown', this.keydown, true);
        window.document.removeEventListener('keyup', this.keyup, true);
        window.document.removeEventListener('keypress', this.keypress, true);
        window.removeEventListener('blur', this.blur);

        this.held.enabler.clear()
        this.held.mode.clear();
    },

    init() {
        // bind keyboard listeners
        this.keydown  = this.keydown.bind(this);
        this.keyup    = this.keyup.bind(this);
        this.keypress = this.keypress.bind(this);
        this.blur     = this.blur.bind(this);

        // map aliases and modes the other way around
        this.cmd = {};
        this.cfg.enabler.forEach(function(key) {
            this.cmd[key] = 'enabler';
        }, this);

        var list = this.cfg.alias;
        for (let cmd in list) if (list.hasOwnProperty(cmd)) {
            this.cmd[list[cmd]] = cmd;
        }

        list = this.cfg.scroll;
        this.scrollDir = {};
        for (let cmd in list) if (list.hasOwnProperty(cmd)) {
            this.scrollDir[list[cmd]] = cmd;
        }

        this.modeKeys = {};
        var modes = this.cfg.modes;
        for (let mode in modes) if (modes.hasOwnProperty(mode)) {
            this.modeKeys[modes[mode]] = mode;
        }
    },

    keydown(e) {
        console.log('down ' + e.code);
        if (!this.cfg.alias[e.code]) {
            var cmd = this.cmd[e.code];
            if (cmd == 'enabler') {

                this.enable(e);
                this.held.enabler.add(e.code);
            } else {
                if (this.held.enabler.size > 0) {
                    if (this.suppressable(e.code)) {
                        this.held.key.add(e.code);
                    }

                    this.down(e.code, e);
                }  // else HandsOn inactive

                var mode = this.modeKeys[e.key];
                if (mode) {
                    this.held.mode.set(e.code, mode);
                }
            }

            this.suppress(e);
        }
    },

    keyup(e) {
        if (!this.cfg.alias[e.code]) {
            this.suppress(e);
            var cmd = this.cmd[e.code];
            if (cmd == 'enabler') {
                this.held.enabler.delete(e.code);
                this.disable(e);
            } else {
                if (this.suppressable(e.code)) {
                    this.held.key.delete(e.code);
                }

                if (this.held.enabler.size > 0) {
                    this.up(e.code, e);
                }

                var mode = this.modeKeys[e.key];
                if (mode) {
                    this.held.mode.delete(e.code);
                }
            }
        }
    },

    keypress(e) {
        if (!this.cfg.alias[e.code]) {
            this.suppress(e);
        }
    },

    blur(e) {
        this.held.enabler.clear()
        this.disable(e);
        this.held.mode.clear();
    },

    // activate navigation mode
    enable(e) {
        if (this.held.enabler.size == 0) {
            for (let code of this.held.key) {
                this.down(code, e);
            }
        }
    },

    // deactivate navigation mode
    disable(e) {
        if (this.held.enabler.size == 0) {
            for (let code of this.held.key) {
                this.up(code, e);
            }
        }
    },

    // perform keydown
    down(code, e) {
        var cmd = this.cmd[code];
        var scrolldir = this.scrollDir[code];

        if (cmd) {
            // simulate aliased key
            e.target.dispatchEvent(this.event('keydown', cmd, e));
        } else if (scrolldir) {
            // perform scroll
            this.scroll(scrolldir);
        }
    },

    // perform keyup
    up(code, e) {
        var cmd = this.cmd[code];
        if (cmd) {
            // simulate aliased key
            e.target.dispatchEvent(this.event('keyup', cmd, e));
        }
    },

    scroll(dir) {
        var viewport = atom.workspace.getActivePaneItem();
        var isEditor = viewport == atom.workspace.getActiveTextEditor();
        if (viewport) {
            var lines = 3;
            var lineHeight = isEditor ? viewport.getLineHeightInPixels() : 10;
            var vOffset = lineHeight * lines;
            var vert = dir =='up' || dir == 'down';
            var offset = vert ? vOffset : 10;
            var sign = (dir == 'up' || dir == 'left') ? 1 : -1;
            if (isEditor) {
                var name = vert ? 'ScrollTop' : 'ScrollLeft';
                var cur = viewport.element['get' + name]();
                viewport.element['set' + name](cur + sign * offset);
                if (vert) {
                    // prevent offscreen cursor
                    var cur = viewport.element.getScrollTop();  // actual position
                    var height = viewport.element.getHeight();
                    var min = Math.ceil(cur / lineHeight) + 2;
                    var max = Math.floor((cur + height) / lineHeight) - 3;
                    var cursor = viewport.getCursorScreenPosition();
                    viewport.setCursorScreenPosition([
                        Math.min(max, Math.max(min, cursor.row)),
                        cursor.column
                    ], {autoscroll: false});
                }
            } else {
                var name = vert ? 'scrollTop' : 'scrollLeft';
                var cur = viewport.element[name];
                viewport.element[name] = cur + sign * offset;
            }
        }
    },

    // checks if the given mode is active
    isMode(mode) {
        var found = false;
        for (let val of this.held.mode.values()) {
            if (val == mode) {
                found = true;
                break;
            }
        }

        return found;
    },

    // suppress the given event if needed
    suppress(e) {
        var enabler = this.cfg.enabler.indexOf(e.code) != -1;
        var held = this.held.key.has(e.code);
        var active = this.held.enabler.size > 0;
        var suppress = this.suppressable(e.code);
        if (enabler || held || (active && suppress)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
        }
    },

    // checks if the given event code is to be suppressed
    suppressable(code) {
        return code.indexOf('Key') == 0 ||
               this.cfg.suppress.indexOf(code) != -1;
    },

    // creates a simulated event object to fire
    event(name, cmd, e) {
        var code = this.cfg.code[cmd];
        var cfg = {
            bubbles:  e.bubbles,
            composed: e.composed,
            view:     e.view,
            key:      cmd,
            code:     cmd,
            charCode: 0,
            which:    code,
            keyCode:  code
        };

        var modes = this.cfg.modes;
        for (let mode in modes) if (modes.hasOwnProperty(mode)) {
            cfg[mode] = this.isMode(mode);
        }

        var event = new KeyboardEvent(name, cfg);

        // faking getters for the event properties
        for (let key in cfg) if (cfg.hasOwnProperty(key)) {
            Object.defineProperty(
                event,
                key,
                { // val should not get into the closure
                    get: (function(val){
                        return function(){ return val; }
                    })(cfg[key])
                }
            );
        }

        return event;
    }

};
