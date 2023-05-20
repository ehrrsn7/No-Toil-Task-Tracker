import express from "express"
import process from "process"
import { getIPAddress, getNets } from "./getIPAddress.js"

/**********************************************************************
 * Function
 * announce()
 * Parameter: port : number
 * Parameter: subdomain : str
 * List available network addresses
 * Formatted to sort of match vite dev server styling
 **********************************************************************/
export function announce(port, subdomain, ejhfotos=false) {
   // listening: " '{subdomain}' listening on port {port}:"
   if (subdomain) {
      process.stdout.write("\u001b[32m") // turn color green
      process.stdout.write(` '${subdomain}'`)
      process.stdout.write("\u001b[0m") // reset color
      process.stdout.write(" listening on ")
   }
   else process.stdout.write("  Listening on ")
   console.log(`port ${port}:\n`)

   // nets: "  →  Network Address:   {net.address}"
   getNets().filter(net => net.type != "IPv6").forEach(net => {
      process.stdout.write("\u001b[32m") // turn color green
      process.stdout.write("  →  ")
      process.stdout.write("\u001b[30;1m") // turn color bold black
      process.stdout.write(`${net.type}:`.padEnd(18) + ' ')
      process.stdout.write("\u001b[36m") // turn color cyan
      process.stdout.write(`http://${net.address}:${port}\n`)
      process.stdout.write("\u001b[0m") // reset color
   })

   if (ejhfotos) {
      process.stdout.write("\u001b[32m") // turn color green
      process.stdout.write("  →  ")
      process.stdout.write("\u001b[30;1m") // turn color bold black
      process.stdout.write(`Domain:`.padEnd(18) + ' ')
      process.stdout.write("\u001b[36m") // turn color cyan
      process.stdout.write(`http://${subdomain}.ejhfotos.com\n`)
      process.stdout.write("\u001b[0m") // reset color
   }

   console.log() // extra newline
}

/**********************************************************************
 * Function
 * listen()
 * Parameter: port : number
 * Parameter: subdomain : str
 * Creates a simple web server using express()
 * Listens on specified port, sends announce() as callback to list 
 * available addresses
 * Returns express server object (usage:
 *    const app_1 = listen(81, "app_1")
 *    app_1.use("./app_1/dist")
 * )
 **********************************************************************/
export function listen(port, subdomain, ejhfotos=false) {
   const server = express()
   server.listen(port, announce(port, subdomain, ejhfotos))
   server.info = {
      port, subdomain, ejhfotos,
      url: `http://${getIPAddress()}:${port}`
   }
   return server
}
