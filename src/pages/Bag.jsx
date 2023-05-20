import React from "react"
import { Link } from "react-router-dom"
import { separateCamelCase, Footer } from "ehrrsn7-components"
import { Header, TaskTable } from "../components"
import { Context } from "../contexts/context"
import { filterFunctions } from "../components/TaskTable/TaskTable"
import "./Bag.css"

export function Bag() {
   const { setFilterFunction } = React.useContext(Context)

   React.useEffect(() => {
      setFilterFunction(() => filterFunctions.bagStatus)
   }, [])

   return <div id="Bag" className="Page">
      <Header>
         Bag
      </Header>
      <main id="Content">
         <TaskTable
         showHighPriority
         showLastModified
         showUpdate 
         />
      </main>
      <Footer>
         <nav style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
            <Link to="/Oil"><button><h5>← Oil</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <Link to="/CompletedParts"><button><h5>{separateCamelCase("CompletedParts")} →</h5></button></Link>
         </nav>
      </Footer>
   </div>
}