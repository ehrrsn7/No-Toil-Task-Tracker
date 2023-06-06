import React from "react"
import { Link } from "react-router-dom"
import { Footer, useInitializer } from "ehrrsn7-components"
import { Context } from "@contexts"
import { filterFunctions } from "@utils"
import { Header, TaskTable, Paginator } from "@components"
import "./Spray.css"

export function Spray() {
   const { setFilterFunction } = React.useContext(Context)

   const handleStatusFilter = () => {
      setFilterFunction(() => filterFunctions.sprayStatus)
   }

   useInitializer(handleStatusFilter)

   return <div id="Spray" className="Page">
      <Header>
         Spray
      </Header>
      <main id="Content">
         <TaskTable
            showHighPriority
            showLastModified
            showUpdate 
            paginated
            search
            navigate
         />
      </main>
      <Footer>
         <Paginator />
         <nav id="StatusNavigation">
            <Link to="/Stamp"><button><h5>← Stamp</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <Link to="/Check"><button><h5>Check →</h5></button></Link>
         </nav>
      </Footer>
   </div>
}