import React from "react"
import { toast } from "react-toastify"
import { ErrorBoundary, useMedia } from "ehrrsn7-components"
import { range, csvToArr } from "@utils"
import { post } from "../../firebase"
import "./AddMore.css"

export function ToggleAddMoreButton({showAddTasks, setShowAddTasks}) {
   return <button id="ToggleAddMoreButton"
   style={{
      width: "100%",
      maxWidth: "1000px",
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 0,
      marginRight: 0,
      background: showAddTasks && "rgba(204, 255, 204, 0.5)",
      border: showAddTasks && "1px solid green",
   }}
   onClick={() => setShowAddTasks(!showAddTasks)}>
      <h5>
         {showAddTasks ? "Hide Add Tasks" : "Add Tasks"}
      </h5>
   </button>
}

export function AddMore({ showAddTasks, showImportCsv }) {
   const ref = React.useRef()
   const fileRef = React.useRef()
   const mobile = useMedia("(max-width: 600px)")
   const [ rows, setRows ] = React.useState(5)

   const onSubmit = event => {
      try {
         event.preventDefault()

         const tasksToSubmit = []

         ref.current.querySelectorAll("tbody > tr").forEach(tableRow => {
            try {
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

               tasksToSubmit.push({
                  ...obj, Status: 0, Quantity: obj["Sets"] * 18
               })
            }
            catch { }
         })

         tasksToSubmit.forEach(newTask => {
            post("tasks", newTask)
               .catch(err => console.warn(err))
         })

         toast.success("successfully submitted")
         ref.current.reset()
      }
      catch { }
   }

   const onFileChange = async () => {
      const file = fileRef?.current.files[0]
      if (file == undefined) throw ""
      file.text()
         .then(result => {
            const arr = csvToArr(result)

            // get number of rows, change rows hook to match
            setRows(arr.length)

            setTimeout(() => {
               // ... populate the rows in table#AddMore
               document.querySelectorAll("table#AddMore > tbody > tr").forEach((tr, index) => {
                  const elements = {
                     Title: tr.querySelector("td.Title > input"),
                     Sets: tr.querySelector("td.Sets > input"),
                     HighPriority: tr.querySelector("td.HighPriority > input"),
                     Oil: tr.querySelector("td.Oil > input"),
                     Description: tr.querySelector("td.Description > input"),
                  }

                  elements.Title.value = arr[index].Title
                  elements.Sets.value = arr[index].Quantity / 18
                  elements.HighPriority.value = arr[index].HighPriority
                  elements.Oil.value = arr[index].Oil
                  elements.Description.value = arr[index].Description
               })
            }, 10)
         })
         // .catch(err => toast.error("error getting text from .csv", err))
   }

   return <ErrorBoundary fallback={<>Error rendering AddMore</>}>
   { showAddTasks && <form onSubmit={onSubmit} ref={ref} id="AddMore">
      <>
         { showImportCsv && <input type="file" name="file" accept=".csv"
         style={{
            margin: "2em auto", padding: "1em",
            border: "1px solid lightgray", borderRadius: ".5em",
            background: "#fcfcfc",
            display: "flex", flexDirection: "row", placeContent: "center"
         }}
         ref={fileRef} onChange={onFileChange} /> }
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
               { range({end: rows}).map(i => <tr key={i}>
                  <td className="Title">       <input />                </td>
                  <td className="Sets">        <input type="number" />  </td>
                  <td className="HighPriority"><input type="checkbox" /></td>
                  <td className="Oil">         <input type="checkbox" /></td>
                  <td className="Description"> <input />                </td>
               </tr>) }
            </tbody>
         </table>
      </>

      <span style={{ width: "calc(100% - 2em)", padding: "1em 0", gridTemplateRows: "repeat(3, 1fr)", gap: "1em" }}>
         <span>
            <button style={{
               background: "#CCFFCC80",
               border: "1px solid green"
            }}
            onClick={onSubmit}>
               <h5>Submit</h5>
            </button>

            <button style={{marginLeft: "1em"}}
            onClick={event => {
               event.preventDefault()
               ref.current?.reset()
            }}>
               <h5>Reset</h5>
            </button>
         </span>

         <button onClick={event => {
            event.preventDefault()
            setRows(rows + 5)
         }}><h5>Add 5 Extra Rows</h5></button>
      </span>
   </form>}
   </ErrorBoundary>
}
