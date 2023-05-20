import express from "express" 
import { listen } from "./listen.js"

export function use(app, dist, index="index.html") {
   app.use(express.static(dist))
   app.get('*', function(r, res) {
     res.sendFile(index, {root: dist});
   })
}

export function runServer(port, subdomain, dist, ejhfotos=false) {
   const app = listen(port, subdomain, ejhfotos)
   use(app, dist)
   return app
}
