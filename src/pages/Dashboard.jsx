import React from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import {
   separateCamelCase, useInitializer, ErrorBoundary, useMedia
} from "ehrrsn7-components"
import { Context } from "@contexts"
import { Header, Footer, TaskTable } from "@components"
import { post } from "../firebase"
import "./Dashboard.css"

export function Dashboard() {
   const { setFilterFunction } = React.useContext(Context)
   const { setSortedBy } = React.useContext(Context)

   const [ showAddTasks, setShowAddTasks ] = React.useState(false)

   useInitializer(() => {
      setFilterFunction(() => row => row)
      setSortedBy("Status-Descending")
   })

   return <span id="Dashboard" className="Page">
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
         />

         <div style={{maxWidth: 1000, margin: 0}}>
            <span style={{
               display: "grid", width: "100%", margin: 0,
               gridTemplateColumns: "repeat(3, 1fr)",
               gap: "1em"
            }}>
               <ToggleAddMoreButton 
               showAddTasks={showAddTasks} 
               setShowAddTasks={setShowAddTasks} />

               <div />

               <button onClick={exportToCSV}
               style={{border: "2px solid transparent"}}>
                  <h5>Export .csv</h5>
               </button>
            </span>
            <AddMore showAddTasks={showAddTasks} />
         </div>
      </main>

      <Footer>
         <nav>
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
         </nav>
         <nav style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <button disabled style={{ cursor: "default"}} />
            <button disabled style={{ cursor: "default"}}><h5>Back to Dashboard</h5></button>
            <Link to="/Stamp">
               <button><h5> Stamp → </h5></button>
            </Link>
         </nav>
      </Footer>
   </span>
}

function ToggleAddMoreButton({showAddTasks, setShowAddTasks}) {
   const dark = useMedia("(prefers-color-scheme: dark)")
   return <button id="ToggleAddMoreButton"
   style={{
      width: "100%",
      maxWidth: "1000px",
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 0,
      marginRight: 0,
      background: showAddTasks &&
         (dark ? "var(--no-toil-green-dark)" : "var(--no-toil-green)"),
      border: showAddTasks && "2px solid green",
   }}
   onClick={() => setShowAddTasks(!showAddTasks)}>
      <h5>
         {showAddTasks ? "Hide Add Tasks" : "Add Tasks"}
      </h5>
   </button>
}

function AddMore({ showAddTasks }) {
   const [ rows, setRows ] = React.useState(5)
   const ref = React.useRef()
   const mobile = useMedia("(max-width: 600px)")

   const onSubmit = event => {
      try {
         let submitted = false
         event.preventDefault()

         if (mobile) {
            toast("mobile")
         }

         else {
            ref.current.querySelectorAll("tbody > tr").forEach(tableRow => {
               const obj = { Status: 0 }

               tableRow.querySelectorAll("td").forEach(cell => {
                  const inputElement = cell.querySelector("input")
                  const key = cell.className

                  switch (inputElement.type) {
                     case "number":
                        obj[key] = parseInt(inputElement.value)
                        break
                     case "checkbox":
                        obj[key] = inputElement.checked
                        break
                     default:
                        obj[key] = inputElement.value
                        break
                  }
               })

               if ((obj["Title"] && obj["Title"] == '') || isNaN(obj["Sets"])) 
                  throw "Missing Title and/or quantity, skipping row"

               post("tasks", { ...obj, Status: 0, Quantity: obj["Sets"] * 18 })
               submitted = true
            })
         }

         // reset the input fields after finished submitting
         if (!submitted) toast("nothing was submitted")
      }
      catch {}
   }

   const reset = event => {
      event.preventDefault()
   }

   return <ErrorBoundary fallback={<>Error rendering AddMore</>}>
   { showAddTasks && <form onSubmit={onSubmit} ref={ref} id="AddMore">
      { mobile ?
         <>
            { range(rows).map(i => <>
               <div style={{
                  marginTop: "1em",
                  marginBottom: "1em",
                  paddingBottom: "1em",
                  borderBottom: "1px solid gray"
               }}>
                  <span><h5>Title: </h5><input /></span>
                  <span><h5>Quantity: </h5><input /></span>
               </div>
            </>) }
         </> :
         <table id="AddMore">
            <thead>
               <tr>
                  <td className="Title">        <h4> Title </h4>       </td>
                  <td className="Sets">         <h4> Sets </h4>        </td>
                  <td className="HighPriority"> <h4> ! </h4>           </td>
                  <td className="Oil">          <h4> Oil </h4>         </td>
                  <td className="Description">  <h4> Description </h4> </td>
               </tr>
            </thead>

            <tbody>
               { range(rows).map(i => <tr key={i}>
                  <td className="Title">       <input />                </td>
                  <td className="Sets">        <input type="number" />  </td>
                  <td className="HighPriority"><input type="checkbox" /></td>
                  <td className="Oil">         <input type="checkbox" /></td>
                  <td className="Description"> <input />                </td>
               </tr>) }
            </tbody>
         </table>
      }

      <span style={{ gridTemplateRows: "repeat(3, 1fr)", gap: "1em" }}>
         <span>
            <button style={{
               background: "#CCFFCC80",
               border: "1px solid green"
            }}
            onClick={onSubmit}>
               <h5>Submit</h5>
            </button>

            <button style={{marginLeft: "1em"}}
            onClick={reset}>
               <h5>Reset</h5>
            </button>
         </span>

         <button onClick={importFromCSV}>
            <h5>Import .csv</h5>
         </button>

         <button onClick={event => {
            event.preventDefault()
            setRows(rows + 5)
         }}><h5>Add 5 Extra Rows</h5></button>
      </span>
   </form>}
   </ErrorBoundary>
}

// helper functions
function range(end) {
   const start = 0
   return Array.from({ length: end - start }, (_, i) => i)
}

// event handlers
function exportToCSV(event) {
   event.preventDefault()
   toast("export to csv")
}

function importFromCSV(event) {
   event.preventDefault()
   toast("import from csv")
}
