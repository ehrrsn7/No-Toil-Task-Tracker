import readline from "readline"
export function handleInput(callback) {
   readline.emitKeypressEvents(process.stdin)
   process.stdin.setRawMode(true)
   process.stdin.on('keypress', (str, key) => {
      callback(key)
   })
}
// https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/