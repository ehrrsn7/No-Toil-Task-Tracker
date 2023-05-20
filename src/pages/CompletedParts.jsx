import React from "react"
import { Link } from "react-router-dom"
import { Footer } from "ehrrsn7-components"
import { Context } from "../contexts/context"
import { Header, TaskTable } from "../components"
import { filterFunctions } from "../components/TaskTable/TaskTable"
import "./CompletedParts.css"

export function CompletedParts() {
   const { setFilterFunction } = React.useContext(Context)

   React.useEffect(() => {
      setFilterFunction(() => filterFunctions.completedPartsStatus)
   }, [])

   return <div id="CompletedParts" className="Page">
      <Header>
         Completed Parts
      </Header>
      <main id="Content">
         <span>
            <div style={{
               alignItems: "end", gap: "0.5em", marginBottom: "1em",
               width: "100%", maxWidth: "1000px"
            }}>
               <button onClick={() => window.print()} style={{
                  width: "100px", alignSelf: "right",
               }}>
                  Print
               </button>
               <button disabled style={{
                  width: "250px",
               }}>
                  Delete Completed Tasks
               </button>
            </div>
         </span>
         <TaskTable />
      </main>
      <Footer>
         <nav style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
            <Link to="/Bag"><button><h5>← Bag</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <button disabled style={{cursor: "default"}} />
         </nav>
      </Footer>
   </div>
}