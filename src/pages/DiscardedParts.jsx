import React from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { Footer, useInitializer } from "ehrrsn7-components"
import { Context } from "@contexts"
import { Header, TaskTable } from "@components"
import { objToArray, filterFunctions } from "@utils"
import { deleteTasks } from "../firebase"
import "./DiscardedParts.css"

export function DiscardedParts() {
   const { tasks } = React.useContext(Context)
   const { setUpdateExpanded } = React.useContext(Context)
   const { tasksLength, setFilterFunction } = React.useContext(Context)

   const handleStatusFilter = () => {
      setFilterFunction(() => filterFunctions.unfiltered)
   }

   const handleUpdateExpanded = () => setUpdateExpanded(-1)

   const handleDeleteTasks = () => {
      const getTasks = () => objToArray(tasks)
         .filter(filterFunctions.discardedPartsStatus)
      deleteTasks(getTasks())
         .then(() => toast(<h5>Successfully deleted tasks</h5>))
         .catch(err => toast.error(err))
   }

   useInitializer(handleStatusFilter)
   useInitializer(handleUpdateExpanded)

   return <div id="DiscardedParts" className="Page">
      <Header>
         Discarded Parts
      </Header>
      <main id="Content">
         <span style={{maxWidth: 1000}}>
            <button 
            onClick={() => window.print()}>
               <h5>
                  print
               </h5>
            </button>

            <button 
            disabled={tasksLength <= 0} 
            onClick={handleDeleteTasks}>
               <h5>
                  delete tasks
               </h5>
            </button>
         </span>
         <TaskTable discarded />
      </main>
      <Footer>
         <nav id="StatusNavigation">
            <button disabled/>

            <Link to="/">
               <button>
                  <h5>
                     Back to Dashboard
                  </h5>
               </button>
            </Link>
            <button disabled/>
         </nav>
      </Footer>
   </div>
}