import React from "react"
import { Link } from "react-router-dom"
import { Footer, useInitializer } from "ehrrsn7-components"
import { Context } from "@contexts"
import { filterFunctions } from "@utils"
import { Header, TaskTable, Paginator } from "@components"
import "./HighPriority.css"

export function HighPriority() {
   const { setFilterFunction } = React.useContext(Context)

   const handleStatusFilter = () => {
      setFilterFunction(() => filterFunctions.highPriority)
   }

   useInitializer(handleStatusFilter)
   
   return <div id="HighPriority" className="Page">
      <Header>
         High Priority
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
            <button disabled />
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <button disabled />
         </nav>
      </Footer>
   </div>
}