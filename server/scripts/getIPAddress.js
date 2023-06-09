// import path from "path"
// import process from "process"
// import { fileURLToPath } from "url"
import { networkInterfaces } from "os"

export function getIPAddress() {
   // found at https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
   try {
      const nets = getNets().filter(net => net.type == "Network Address")
      let net = nets.length > 0 && nets[0]
      if (!net) throw "LAN IP Address not found."
      return net.address
   }
   catch (err) {
      console.error(err, "Using 'localhost'.")
      return "localhost"
   }
}

export function getNets() {
   class Net {
      constructor({address, netmask, family}) {
         this.address = address
         this.netmask = netmask
         this.family = family

         this.type = (this.netmask == "255.255.255.0") ?
               "Network Address" :
            (this.family == "IPv6") ?
               "IPv6" : 
            (this.address == "127.0.0.1" || this.address == "::1") ? 
               "localhost" :
            (this.netmask == "255.0.0.0") ?
               "Subnet Mask" : 
               undefined
      }
   }

   let interfaces = networkInterfaces()
   let nets = []
   Object.keys(interfaces).forEach(name => {
      interfaces[name].forEach(net => { nets.push(new Net(net)) })
   })
   return nets
}

// if (
//    path.resolve(process.argv[1]) ==
//    path.resolve(fileURLToPath(import.meta.url))
// ) {
//    console.log({ipAddress: getIPAddress(), nets: getNets().map(net => net.address)})
// }