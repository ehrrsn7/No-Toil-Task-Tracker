/**********************************************************************
 * Import
 **********************************************************************/
import process from "process"
import open from "open"
import colors from "./scripts/colors.js"
import { runServer } from "./scripts/index.js"
import { handleInput } from "./scripts/handleInput.js"

/**********************************************************************
 * Start Servers
 **********************************************************************/
const servers = {
   noToilTaskTracker: runServer(80, "no-toil-task-tracker", "./dist"),
}

// User Interaction
console.log(colors.green, " →", colors.reset, 
   colors.white + "press " + 
   colors.bold + colors.black + "h" +
   colors.reset +
   colors.white + " to show help\n" + 
   colors.reset
)

handleInput(key => {
   // exit on '^+c'
   if (key.ctrl && key.name === 'c' || key.name === 'q')
      process.exit()

   switch (key.name) {
      case 'h':
         const formatHelpMessage = (key, description) =>
            colors.white + "\n   press " +
            colors.bold + colors.black + key + colors.reset +
            colors.white + ` to ${description}` + colors.reset
         console.log(colors.bold, colors.black, " Shortcuts", colors.reset,
            formatHelpMessage('u', "show server url"),
            formatHelpMessage('o', "open in browser"),
            formatHelpMessage('c', "clear console"),
            formatHelpMessage('q', "quit"))
         console.log()
         break
      case 'u':
         Object.keys(servers).forEach(key => console.log(
            colors.green, ` → '${servers[key].info?.subdomain}':`.padEnd(26),
            colors.reset, colors.cyan, colors.bold,
            servers[key].info?.url, colors.reset
         ))
         console.log()
         break
      case 'o':
         const defaultURL = servers[Object.keys(servers)[0]].info.url
         if (defaultURL) open(defaultURL)
         break
      case 'c':
         if (key.ctrl) process.exit(0)
         console.log(colors.clearTerminal)
         break
      case 'q':
         process.exit(0)
   }
})
