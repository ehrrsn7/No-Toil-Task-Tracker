import readline from "readline"

export function handleInput(callback) {
   if (!process.stdin.isTTY) return;
   readline.emitKeypressEvents(process.stdin);
   process.stdin.setRawMode(true);
   process.stdin.on('keypress', (_, key) => { callback(key) });
}

// https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/