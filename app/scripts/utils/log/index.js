console.log('%cWelcome to the debugger!', 'color: #00AA00; font-size: 1.5em;');

// prefix console logging with timestamp:
function decorate(args) {
    args = Array.prototype.slice.call(args);
    var now = new Date();
    var time = now.toTimeString().substr(0, 8);
    var ms = String(now.getMilliseconds());
    //ms = '0'.repeat(3 - ms.length) + ms;
    args.unshift('%c' + time + ':' + ms, 'color: #00AA00;');
    return args;
}

// console logging tool:
module.exports = {
    info: function() {
        console.log.apply(console, decorate(arguments));
    },
    error: function() {
        console.error.apply(console, decorate(arguments));
    },
};
