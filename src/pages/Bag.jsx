import React from "react"
import { Link } from "react-router-dom"
import { separateCamelCase, Footer, useInitializer } from "ehrrsn7-components"
import { Context } from "@contexts"
import { filterFunctions } from "@utils"
import { Header, TaskTable, Paginator } from "@components"
import "./Bag.css"

export function Bag() {
   const { setFilterFunction } = React.useContext(Context)
   
   const handleStatusFilter = () => {
      setFilterFunction(() => filterFunctions.bagStatus)
   }
   
   useInitializer(handleStatusFilter)
   
   return <div id="Bag" className="Page">
      <Header>
         Bag
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
            <Link to="/Oil"><button><h5>← Oil</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <Link to="/CompletedParts"><button><h5>{separateCamelCase("CompletedParts")} →</h5></button></Link>
         </nav>
      </Footer>
   </div>
}