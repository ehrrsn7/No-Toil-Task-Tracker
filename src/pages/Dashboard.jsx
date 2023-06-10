import React from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import {
   separateCamelCase, useInitializer, ErrorBoundary, useMedia
} from "ehrrsn7-components"
import { Context } from "@contexts"
import {
   Header, Footer, TaskTable, Paginator, AddMore, ToggleAddMoreButton
} from "@components"
import { downloadFile, objToArray, arrToCsv } from "@utils"
import "./Dashboard.css"

export function Dashboard() {
   const { tasks } = React.useContext(Context)
   const { setSortedBy } = React.useContext(Context)
   const { setFilterFunction } = React.useContext(Context)

   const tablet = useMedia("(max-width: 700px)")

   const [ showAddTasks, setShowAddTasks ] = React.useState(false)
   const [ showImportCsv, setShowImportCsv ] = React.useState(false)

   const handleTasksSorting = () => setSortedBy("Title-Ascending")
   const handleStatusFilter = () => setFilterFunction(row => row)

   useInitializer(handleTasksSorting)
   useInitializer(handleStatusFilter)

   return <ErrorBoundary fallback={<>Error rendering Dashboard component.</>}>
   <span id="Dashboard" className="Page">
      <Header>
         Dashboard
      </Header>
      <main id="Content" style={{
         placeContent: "space-between",
         placeItems: "space-between",
      }}>
         <TaskTable
            showHighPriority
            showStatus
            showLastModified
            showUpdate 
            isPaginated
            search
            navigate
         />
      </main>

      <Footer>
         <Paginator />

         <nav className="AddMore">
            <ToggleAddMoreButton 
            showAddTasks={showAddTasks} 
            setShowAddTasks={setShowAddTasks} />

            { showAddTasks ? <button
            style={{
               background: showImportCsv && "rgba(204, 255, 204, 0.5)",
               border: showImportCsv && "1px solid green",
            }}
            onClick={() => setShowImportCsv(!showImportCsv)}>
               <h5>Import .csv</h5>
            </button> : <button disabled /> }

            <button onClick={event => exportToCSV(event, tasks)}
            style={{border: "2px solid transparent"}}>
               <h5>Export .csv</h5>
            </button>
         </nav>

         <AddMore showAddTasks={showAddTasks} showImportCsv={showImportCsv} />

         <nav id="PageLinks"
         style={{
            gridTemplateColumns: tablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)"
         }}>
            {!tablet && <button disabled />}
            <Link to="/DiscardedParts">
               <button>
                  <h5>{separateCamelCase("DiscardedParts")}</h5>
               </button>
            </Link>

            <Link to="/CompletedParts">
               <button>
                  <h5>{separateCamelCase("CompletedParts")}</h5>
               </button>
            </Link>
            {!tablet && <button disabled />}
         </nav>
         <nav id="StatusNavigation">
            <Link to="/HighPriority">
               <button><h5> High Priority </h5></button>
            </Link>
            {/* <button disabled style={{ cursor: "default"}} /> */}
            <button disabled style={{ cursor: "default"}}><h5>Back to Dashboard</h5></button>
            <Link to="/Stamp">
               <button><h5> Stamp → </h5></button>
            </Link>
         </nav>
      </Footer>
   </span>
   </ErrorBoundary>
}

// event handlers
function exportToCSV(event, tasks) {
   event.preventDefault()
   // todo: handle toast with promise/await/etc. logic
   toast("export to csv")
   console.log(arrToCsv(tasks))
   downloadFile(`tasks-${new Date().toString()}.csv`, arrToCsv(objToArray(tasks)))
}
