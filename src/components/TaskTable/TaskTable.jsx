import React from "react"
import { Link } from "react-router-dom"
import { useMedia } from "react-use"
import { LayoutGroup, motion } from "framer-motion"
import { toast } from "react-toastify"
import { separateCamelCase } from "ehrrsn7-components"
import { Context } from "@contexts/context"
import { AccordionRow, motionVariants } from "./AccordionRow"
import { ErrorBoundary } from "../ErrorBoundary"
import { Task, update as updateFirebase } from "../../firebase"
import "./TaskTable.css"

export function TaskTable({
   setsOrQuantity, showStatus, showLastModified, showHighPriority, showUpdate
}) {
   const { tasks, setTasks } = React.useContext(Context)
   const { filterFunction } = React.useContext(Context)
   const { sortedBy } = React.useContext(Context)
   const { updateExpanded, setUpdateExpanded } = React.useContext(Context)

   React.useEffect(() => {
      if (tasks)
         sortTasksBy({ tasks, setTasks }, sortedBy)
      else
         console.log("tasks undefined")
   }, [ sortedBy ])

   return <ErrorBoundary fallback={<div>
      Error loading TaskTable component.
   </div>}>
   <table id="TaskTable">
      <thead>
         <tr>
            <columns.Title.Head />

            <columns.Quantity.Head 
            setsOrQuantity={setsOrQuantity} />

            <columns.LastModified.Head
            showLastModified={showLastModified}/>

            <columns.Status.Head
            showStatus={showStatus} />

            <columns.HighPriority.Head
            showHighPriority={showHighPriority} />

            <columns.Update.Head setUpdateExpanded={setUpdateExpanded} showUpdate={showUpdate} />
         </tr>
      </thead>
      <tbody>
         {/* No Tasks */}
         { objToArray(tasks).filter(filterFunction).length <= 0 && <motion.tr
         className="NoTasks">
            <td colSpan="100%">
               <span>
                  <p>
                     <em>No Tasks</em>
                  </p>
               </span>
            </td>
         </motion.tr>}

         {/* Tasks */}
         { objToArray(tasks).filter(filterFunction).map(row => 
         <React.Fragment key={row.id}>
         <LayoutGroup initial={false}>
         <TaskRow row={row}
         updateExpanded={updateExpanded}
         setUpdateExpanded={setUpdateExpanded}
         setsOrQuantity={setsOrQuantity}
         showLastModified={showLastModified}
         showStatus={showStatus}
         showHighPriority={showHighPriority}
         showUpdate={showUpdate}
         />

         {/* Accordion Row (in line with selected) */}
         { row.id == updateExpanded && <AccordionRow row={row} />}
         </LayoutGroup>
         </React.Fragment>) }
      </tbody>
   </table>
   </ErrorBoundary>
}

// subcomponents
function TaskRow({
   row, updateExpanded, setUpdateExpanded, showUpdate, setsOrQuantity,
   showLastModified, showStatus, showHighPriority
}) {
   return <motion.tr initial="hidden" animate="show" 
   id={row.id == updateExpanded ? "updateExpanded" : ''}
   className={`TaskTableRow-${row.id}`}
   variants={motionVariants.container}
   onClick={event => {
      const ignoreMe = [
         "Status", "Update"
      ].includes(event.target.offsetParent.className)

      if (showUpdate && !ignoreMe)
         setUpdateExpanded(row.id == updateExpanded ? '' : row.id)
   }}>
      <columns.Title.Body>
         {row.Title}
      </columns.Title.Body>

      <columns.Quantity.Body
      setsOrQuantity={setsOrQuantity}
      status={row.Status}>
         {row.Quantity}
      </columns.Quantity.Body>

      <columns.LastModified.Body
      showLastModified={showLastModified} >
         {row.getDateString()}
      </columns.LastModified.Body>

      <columns.Status.Body
      showStatus={showStatus}>
         {row.Status}
      </columns.Status.Body>

      <columns.HighPriority.Body
      showHighPriority={showHighPriority}>
         {row.HighPriority ? "!" : ''}
      </columns.HighPriority.Body>

      <columns.Update.Body row={row} showUpdate={showUpdate} />
   </motion.tr>
}

const columns = {
   TableHead: ({ children, style, id }) => {
      const { sortedBy, setSortedBy } = React.useContext(Context)
      const onClick = () => setSortedByCallback({ sortedBy, setSortedBy }, id)

      return <td id={id} onClick={onClick}
      className={sortedBy.includes(id) ? "sortedBy" : ""}>
         <span className="disable-text-selection" style={{
            placeContent: "space-between",
            placeItems: "space-between",
            verticalAlign: "middle",
            ...style
         }}>
            <h4 style={{
               margin: 0, padding: 0
            }}>{children}</h4>
            &ensp;
            { sortedBy.includes(id) && <p style={{
               margin: 0, padding: 0,
               height: 20, verticalAlign: "middle",
               fontSize: ".7em"
            }}>
               { sortedBy.includes("Ascending") ? "∨" : "∧" }
            </p> }
         </span>
      </td>
   },

   Title: {
      Head: () => <columns.TableHead id="Title" style={{
         textAlign: "left",
         placeContent: "left"
      }}>
         Title
      </columns.TableHead>,

      Body: ({children}) => <td>
         <p>{children}</p>
      </td>,
   },

   Quantity: {
      Head: ({ setsOrQuantity }) => {
         const mobile = useMedia("(max-width: 550px)")

         return !mobile && <columns.TableHead id="Quantity" style={{
            minWidth: 120
         }}>
            Quantity
            {setsOrQuantity}
         </columns.TableHead>
      },

      Body: ({ children, status, setsOrQuantity }) => {
         const mobile = useMedia("(max-width: 550px)")

         const quantity = children
         const divisible = quantity % 18 == 0
         const isStampSprayStatus = status >= 0 && status <= 2
         const showSets = setsOrQuantity == undefined ?
            isStampSprayStatus && divisible : setsOrQuantity && divisible
         return !mobile && <td className="Quantity" style={{paddingLeft: ".75em"}}>
            { showSets ? quantity / 18 : quantity }
            {" "}
            { showSets ? "sets" : "each"}
         </td>
      }
   },

   LastModified: {
      Head: ({ showLastModified }) => {
         const mobile = useMedia("(max-width: 750px)")

         return !mobile && showLastModified && <columns.TableHead id="LastModified" style={{
            minWidth: 140
         }}>
            Last Modified
         </columns.TableHead>
      },

      Body: ({ children, showLastModified }) => {
         const mobile = useMedia("(max-width: 750px)")

         return !mobile && showLastModified && <td className="LastModified" style={{
            minWidth: 150
         }}>
            <p>{children}</p>
         </td>
      }
   },

   Status: {
      Head: ({ showStatus }) => {
         return showStatus && <columns.TableHead
         id="Status"
         style={{ minWidth: 90 }}
         >
            Status
         </columns.TableHead>
      },

      Body: ({ children, showStatus }) => {
         const mobile = useMedia("(max-width: 550px)")

         return showStatus && <ErrorBoundary
         fallback={<button> <h5>Unknown</h5> </button>}>
         <td className="Status" style={{placeContent: "center", placeItems: "center"}}>
            <Link to={statusMapNumberToName(children)}>
               <button style={{
                  width: "calc(100% - 1em)",
                  marginLeft: ".5em", marginRight: ".5em",
               }}
               onClick={event => {
                  // only enable links to statuses that we recognize
                  if (statusMapNameToNumber(event.target.innerHTML) == -1)
                     event.preventDefault()
               }}>
                  <h5 style={{whiteSpace: !mobile && "nowrap"}}>
                     {separateCamelCase(
                        statusMapNumberToName(children)
                     )}
                  </h5>
               </button>
            </Link>
         </td>
         </ErrorBoundary>
      }
   },

   HighPriority: {
      Head: ({ showHighPriority }) => {
         const mobile = useMedia("(max-width: 650px)")

         return !mobile && showHighPriority && <columns.TableHead id="HighPriority" style={{
            minWidth: 45
         }}>
            !
         </columns.TableHead>
      },

      Body: ({ children, showHighPriority }) => {
         const mobile = useMedia("(max-width: 650px)")

         return !mobile && showHighPriority && <td className="HighPriority">
            <p>{children}</p>
         </td>
      }
   },

   Update: {
      Head: ({ showUpdate }) => {
         const { setUpdateExpanded } = React.useContext(Context)
         const onClick = () => setUpdateExpanded('')
         return showUpdate && <td id="Update" onClick={onClick}>
            <h4>Update</h4>
         </td>
      },

      Body: ({ row, showUpdate }) => {
         const { updateExpanded, setUpdateExpanded } = React.useContext(Context)

         const update = () => {
            try {
               // quick exit, we only "update" to valid statuses
               if (row.Status < 0 || row.Status >= 5) return
               const newStatus = row.Status + 1
               if (newStatus < 0 || newStatus >= 6)
                  throw `Invalid new Status: '${newStatus}'`
               updateFirebase("tasks", { ...row, Status: newStatus })
            }
            catch (err) {
               console.warn(err)
            }
         }

         const rotate = () => {
            setUpdateExpanded(row.id == updateExpanded ? '' : row.id)
         }

         return showUpdate && <td className="Update">
            <button onClick={update}>
               {"✓"}
            </button>
            <button onClick={rotate} style={{
               transform: (updateExpanded == row.id) ? "rotate(0)" : "rotate(90deg)",
            }}>
               {"∨"}
            </button>
         </td>
      }
   }
}

/**************************************************
 * ROWS
 **************************************************/
export const dummyRows = [
   {
      id: "a120",
      Title: "3117",
      Quantity: 54,
      Status: 3,
      Oil: true,
      HighPriority: true,
      Discarded: false,
   },
   {
      id: "a121",
      Title: "5555",
      Quantity: 36,
      Status: 2,
      Oil: true,
      HighPriority: false,
      Discarded: false,
   },
   {
      id: "a122",
      Title: "4444",
      Quantity: 18,
      Status: 5,
      Oil: true,
      HighPriority: false,
      Discarded: false,
   },
   {
      id: "a123",
      Title: "3333",
      Quantity: 36,
      Status: 3,
      Oil: true,
      HighPriority: true,
      Discarded: false,
   },
   {
      id: "a124",
      Title: "2222",
      Quantity: 36,
      Status: 3,
      Oil: true,
      HighPriority: false,
      Discarded: false,
   },
]

/**************************************************
 * Helper Functions
 **************************************************/
export function statusMapNameToNumber(name) {
   switch (name) {
      case "Stamp": return 0
      case "Spray": return 1
      case "Check": return 2
      case "Oil": return 3
      case "Bag": return 4
      case "CompletedParts": return 5
      case "DiscardedParts": return 6
      default: return -1
   }
}
export function statusMapNumberToName(number) {
   switch (number) {
      case 0: return "Stamp"
      case 1: return "Spray"
      case 2: return "Check"
      case 3: return "Oil"
      case 4: return "Bag"
      case 5: return "CompletedParts"
      case 6: return "DiscardedParts"
      default: return "Unknown"
   }
}

const setSortedByCallback = ({ sortedBy, setSortedBy }, by="") => {
   const getSortedBy = (sortedBy, by) => {
      if (sortedBy == `${by}-Ascending`)
         return `${by}-Descending`
      else if (sortedBy == `${by}-Descending`)
         return ''
      else
         return `${by}-Ascending`
   }

   setSortedBy(getSortedBy(sortedBy, by))
}

const numericSort = (a, b, key) => a[key] - b[key]
const booleanSort = numericSort
const timeSort = numericSort
const alphaNumericSort = (a, b, key) => a[key].localeCompare(b[key], "en", { numeric: true })

const sortFunctions = {
   id: {
      ascending:  (a, b) => alphaNumericSort(a, b, "id"),
      descending: (b, a) => alphaNumericSort(a, b, "id"),
   },
   Title: {
      ascending:  (a, b) => alphaNumericSort(a, b, "Title"),
      descending: (b, a) => alphaNumericSort(a, b, "Title"),
   },
   Quantity: {
      ascending:  (a, b) => numericSort(a, b, "Quantity"),
      descending: (b, a) => numericSort(a, b, "Quantity"),
   },
   Oil: {
      ascending:  (a, b) => booleanSort(a, b, "Oil"),
      descending: (b, a) => booleanSort(a, b, "Oil"),
   },
   HighPriority: {
      ascending:  (a, b) => booleanSort(a, b, "HighPriority"),
      descending: (b, a) => booleanSort(a, b, "HighPriority"),
   },
   Status: {
      ascending:  (a, b) => numericSort(a, b, "Status"),
      descending: (b, a) => numericSort(a, b, "Status"),
   },
   Discarded: {
      ascending:  (a, b) => booleanSort(a, b, "Discarded"),
      descending: (b, a) => booleanSort(a, b, "Discarded"),
   },
   LastModified: {
      ascending:  (a, b) => timeSort(a, b, "LastModified"),
      descending: (b, a) => timeSort(a, b, "LastModified"),
   },
}

export const filterFunctions = {
   stampStatus: row => row.Status == 0,
   sprayStatus: row => row.Status == 1,
   checkStatus: row => row.Status == 2,
   oilStatus: row => row.Status == 3,
   bagStatus: row => row.Status == 4,
   completedPartsStatus: row => row.Status == 5,
   discardedPartsStatus: row => row.Status == 6,
}

const sortTasksBy = ({ tasks, setTasks }, by) => {
   try {

      // skip if nothing to sort (fixes some bugs)
      if (!objToArray(tasks).length) return
   
      // default: "id-Ascending"
      by = by == '' ? "id-Ascending" : by
   
      const sortFunction = {
         "id-Ascending":               sortFunctions.id.ascending,
         "id-Descending":              sortFunctions.id.descending,
         "Title-Ascending":            sortFunctions.Title.ascending,
         "Title-Descending":           sortFunctions.Title.descending,
         "Quantity-Ascending":         sortFunctions.Quantity.ascending,
         "Quantity-Descending":        sortFunctions.Quantity.descending,
         "Oil-Ascending":              sortFunctions.Oil.ascending,
         "Oil-Descending":             sortFunctions.Oil.descending,
         "HighPriority-Ascending":     sortFunctions.HighPriority.ascending,
         "HighPriority-Descending":    sortFunctions.HighPriority.descending,
         "Status-Ascending":           sortFunctions.Status.ascending,
         "Status-Descending":          sortFunctions.Status.descending,
         "Discarded-Ascending":        sortFunctions.Discarded.ascending,
         "Discarded-Descending":       sortFunctions.Discarded.descending,
         "LastModified-Ascending":     sortFunctions.LastModified.ascending,
         "LastModified-Descending":    sortFunctions.LastModified.descending,
      }[by]

      setTasks([... // spread operator is necessary to trigger re-render
         (Array.isArray(tasks) ? tasks : objToArray(tasks)).sort(sortFunction)
      ])
   }
   catch (err) {
      toast(err)
   }
}

function objToArray(obj={}) {
   try {
      return Object.keys(obj).map(key => new Task({...obj[key]}))
   }
   catch (err) {
      console.warn(err)
      return []
   }
}
