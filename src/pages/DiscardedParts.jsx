import React from "react"
import { Link } from "react-router-dom"
import { Footer } from "ehrrsn7-components"
import { Context } from "../contexts/context"
import { Header, TaskTable } from "../components"
import { filterFunctions } from "../components/TaskTable/TaskTable"
import "./DiscardedParts.css"

export function DiscardedParts() {
   const { setFilterFunction } = React.useContext(Context)

   React.useEffect(() => {
      setFilterFunction(() => filterFunctions.discardedPartsStatus)
   }, [])

   return <div id="DiscardedParts" className="Page">
      <Header>
         Discarded Parts
      </Header>
      <main id="Content">
         <TaskTable />
      </main>
      <Footer>
         <nav style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
            <button disabled style={{cursor: "default"}} />
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <button disabled style={{cursor: "default"}} />
         </nav>
      </Footer>
   </div>
}