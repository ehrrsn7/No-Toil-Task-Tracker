import React from "react"
import { Link } from "react-router-dom"
import { Footer, useInitializer } from "ehrrsn7-components"
import { Context } from "@contexts"
import { filterFunctions } from "@utils"
import { Header, TaskTable, Paginator } from "@components"
import "./Check.css"

export function Check() {
   const { setFilterFunction } = React.useContext(Context)

   const handleStatusFilter = () => {
      setFilterFunction(() => filterFunctions.checkStatus)
   }

   useInitializer(handleStatusFilter)
   
   return <div id="Check" className="Page">
      <Header>
         Check
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
            <Link to="/Spray"><button><h5>← Spray</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <Link to="/Oil"><button><h5>Oil →</h5></button></Link>
         </nav>
      </Footer>
   </div>
}