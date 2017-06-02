const EventEmitter = require('events');
const Readline = require('readline');

class CLI extends EventEmitter {
    /**
     * Reserver commands
     */
    static get RESERVED() { return ['unknown']; }

    /**
     * @param {String} prompt
     */
    constructor(prompt = '') {
        super();

        const { stdin, stdout } = process;

        this.commands = new Set();
        this.readline = Readline.createInterface({ input: stdin, output: stdout, prompt });

        this.onClose = this.onClose.bind(this);
        this.onLine = this.onLine.bind(this);
        this.close = this.close.bind(this);

        this.readline.on('close', this.onClose);
        this.readline.on('line', this.onLine);

        this.on('exit', this.close);
    }

    /**
     * Register a new command
     *
     * @param {String} name
     * @param {Function} callback
     */
    on(name, callback) {
        super.on(name, callback);

        if (CLI.RESERVED.indexOf(name) < 0) {
            this.commands.add(name);
        }
    }

    /**
     * Write a message
     *
     * @param {String} message
     */
    write(message) {
        console.info(message);
    }

    /**
     * Display command result
     */
    result(message) {
        this.write(typeof message === 'string' ? message : message.join('\r\n'));
        this.readline.prompt();
    }

    /**
     * Close the CLI
     */
    close() {
        //this.write('\r\n');
        process.exit(0);
    }

    /**
     * Get the command corresponding to the given user input
     *
     * @param {String} input
     *
     * @return {String}
     */
    getCommand(input) {
        if (this.commands.has(input.trim())) {
            return input;
        }

        return 'unknown';
    }

    /**
     * When a new user input occur
     *
     * @param {String} line
     */
    onLine(line) {
        this.emit(this.getCommand(line) || 'unknown');
    }

    /**
     * When user close the cli
     */
    onClose() {
        this.close();
    }
}

module.exports = CLI;
