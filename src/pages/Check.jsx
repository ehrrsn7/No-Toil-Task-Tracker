import React from "react"
import { Link } from "react-router-dom"
import { Footer } from "ehrrsn7-components"
import { Context } from "../contexts/context"
import { Header, TaskTable } from "../components"
import { filterFunctions } from "../components/TaskTable/TaskTable"
import "./Check.css"

export function Check() {
   const { setFilterFunction } = React.useContext(Context)

   React.useEffect(() => {
      setFilterFunction(() => filterFunctions.checkStatus)
   }, [])

   return <div id="Check" className="Page">
      <Header>
         Check
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
            <Link to="/Spray"><button><h5>← Spray</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <Link to="/Oil"><button><h5>Oil →</h5></button></Link>
         </nav>
      </Footer>
   </div>
}