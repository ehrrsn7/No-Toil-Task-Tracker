import React from "react"
import { Link } from "react-router-dom"
import { Footer } from "ehrrsn7-components"
import { Context } from "../contexts/context"
import { Header, TaskTable } from "../components"
import { filterFunctions } from "../components/TaskTable/TaskTable"
import "./Oil.css"

export function Oil() {
   const { setFilterFunction } = React.useContext(Context)

   React.useEffect(() => {
      setFilterFunction(() => filterFunctions.oilStatus)
   }, [])

   return <div id="Oil" className="Page">
      <Header>
         Oil
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
            <Link to="/Check"><button><h5>← Check</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <Link to="/Bag"><button><h5>Bag →</h5></button></Link>
         </nav>
      </Footer>
   </div>
}