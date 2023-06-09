import readline from "readline"
export function handleInput(callback) {
   readline.emitKeypressEvents(process.stdin)
   if (process.stdin.isTTY) {
      process.stdin.setRawMode(true)
      process.stdin.on('keypress', (_, key) => {
         callback(key)
      })
   }
}
// https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/