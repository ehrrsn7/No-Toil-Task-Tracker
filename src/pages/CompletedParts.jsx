import React from "react"
import { Link } from "react-router-dom"
import { Footer, SidebarContext, useInitializer } from "ehrrsn7-components"
import { toast } from "react-toastify"
import { Context } from "@contexts"
import { Header, TaskTable } from "@components"
import { objToArray, filterFunctions } from "@utils"
import { deleteTasks } from "../firebase"
import "./CompletedParts.css"

export function CompletedParts() {
   const { setFilterFunction, setUpdateExpanded } = React.useContext(Context)
   const { tasks, tasksLength } = React.useContext(Context)
   const { setShowSidebar } = React.useContext(SidebarContext)
   const [ enableDelete, setEnableDelete ] = React.useState(false)

   const handleStatusFilter = () =>
      setFilterFunction(() => filterFunctions.completedPartsStatus)

   const handleUpdateExpanded = () => setUpdateExpanded(-1)

   const onPrintClick = () => {
      setShowSidebar(false)
      window.print()
      if (tasksLength > 0)
         setEnableDelete(true)
   }

   const handleDeleteTasks = () => {
      const getTasks = () => objToArray(tasks)
         .filter(filterFunctions.completedPartsStatus)

      const toastPromise = new Promise(resolve => resolve(
         deleteTasks(getTasks())
      ))

      toast.promise(toastPromise, {
         pending: {
            render() {
               return <h5>Deleting tasks...</h5>
            },
            icon: false,
         },

         success: {
            render() {
               setEnableDelete(false)
               return <h5>Successfully deleted tasks.</h5>
            },
            icon: false,
         },

         error: {
            render({data}) {
               console.error(data)
               return data
            },
            icon: false,
         }
      })
   }

   useInitializer(handleStatusFilter)
   useInitializer(handleUpdateExpanded)

   return <div id="CompletedParts" className="Page">
      <Header>
         Completed Parts
      </Header>
      <main id="Content">
         <span style={{ marginBottom: "1em", maxWidth: 1000 }}>
            <button onClick={onPrintClick} style={{
               width: "100px", alignSelf: "right",
            }}>
               <h4>Print</h4>
            </button>
            <button disabled={!enableDelete} style={{
               width: "250px",
               background: enableDelete && "#ff000055"
            }}
            onClick={handleDeleteTasks}>
               <h4>Delete Completed Tasks</h4>
            </button>
         </span>
         <TaskTable />
      </main>
      <Footer>
         <nav id="StatusNavigation">
            <Link to="/Bag"><button><h5>← Bag</h5></button></Link>
            <Link to="/"><button><h5>Back to Dashboard</h5></button></Link>
            <button disabled style={{cursor: "default"}} />
         </nav>
      </Footer>
   </div>
}