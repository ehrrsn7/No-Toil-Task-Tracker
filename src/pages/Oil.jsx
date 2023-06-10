import React from "react"
import { Link } from "react-router-dom"
import { Footer, useInitializer } from "ehrrsn7-components"
import { Context } from "@contexts"
import { filterFunctions } from "@utils"
import { Header, TaskTable, Paginator } from "@components"
import "./Oil.css"

export function Oil() {
   const { setFilterFunction } = React.useContext(Context)

   const handleStatusFilter = () => {
      setFilterFunction(() => filterFunctions.oilStatus)
   }

   useInitializer(handleStatusFilter)

   return <div id="Oil" className="Page">
      <Header>
         Oil
      </Header>
      <main id="Content">
         <TaskTable
            showHighPriority
            showLastModified
            showUpdate 
            isPaginated
            search
            navigate
         />
      </main>
      <Footer>
         <Paginator />
         <nav id="StatusNavigation">
            <Link to="/Check"><button><h5>← Check</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <Link to="/Bag"><button><h5>Bag →</h5></button></Link>
         </nav>
      </Footer>
   </div>
}