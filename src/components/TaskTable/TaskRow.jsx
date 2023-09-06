import React from "react"
import { Link, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { separateCamelCase, ErrorBoundary, useMedia } from "ehrrsn7-components"
import { Context } from "@contexts"
import { statusMapNumberToName, setSortedByCallback } from "@utils"
import { update as updateFirebase } from "../../firebase"
import "./TaskRow.css"

const tinyQuery = "(max-width: 350px)"
const mobileQuery = "(max-width: 450px)"
const tabletQuery = "(max-width: 750px)"

export const TaskRow = {
   Head: function({
      setsOrQuantity,
      showLastModified,
      showStatus,
      showHighPriority,
      setUpdateExpanded,
      showUpdate,
   }) {
      const { updateExpanded } = React.useContext(Context)
      const tiny = useMedia(tinyQuery)
      const mobile = useMedia(mobileQuery)
      const tablet = useMedia(tabletQuery)

      return <tr>
         <TableHead id="Title" style={{
            textAlign: "left",
            placeContent: "left"
         }}>
            Title
         </TableHead>

         {
            <TableHead id="Quantity" style={{
               minWidth: 90
            }}>
               Quantity
               {setsOrQuantity}
            </TableHead>
         }

         { !tablet && showLastModified &&
            <TableHead id="LastModified" style={{
               minWidth: 140
            }}>
               Last Modified
            </TableHead>
         }

         { !tiny && showStatus &&
            <TableHead id="Status" style={{ minWidth: 90 }} >
               Status
            </TableHead>
         }

         { !tablet && showHighPriority &&
            <TableHead id="HighPriority" style={{ minWidth: 25 }}>
               !
            </TableHead>
         }

         { !mobile && (showUpdate && ((updateExpanded != '') ?
            <td id="Update">
               <button style={{padding: "0 15px", height: 25, marginTop: "2px"}}
               onClick={() => setUpdateExpanded('')}>
                  <h4>—</h4>
               </button>
            </td> :
            <td id="Update">
               <h4>Update</h4>
            </td>))
         }
      </tr>
   },

   Body: function({
      row,
      updateExpanded,
      setUpdateExpanded,
      showUpdate,
      setsOrQuantity,
      showLastModified,
      showStatus,
      showHighPriority
   }) {
      const location = useLocation()

      return <tr initial="hidden" animate="show" 
      id={row.id == updateExpanded ? "updateExpanded" : ''}
      className={`TaskTableRow ${row.id}`}
      onClick={event => {
         const ignoreMe = [
            "Status", "Update"
         ].includes(event.target.offsetParent.className)

         if (showUpdate && !ignoreMe)
            setUpdateExpanded(row.id == updateExpanded ? '' : row.id)
      }}>
         <td style={{
            maxWidth: "200px",
            wordWrap: "break-word",
         }}><p>{row.Title}</p></td>

         <Quantity
         setsOrQuantity={setsOrQuantity}
         status={row.Status}>
            {row.Quantity}
         </Quantity>

         <LastModified
         showLastModified={showLastModified} >
            {row.getDateString()}
         </LastModified>

         <Status
         showStatus={showStatus}>
            {row.Status}
         </Status>

         <HighPriority
         showHighPriority={showHighPriority}>
            {row.HighPriority ?
               <Link to="HighPriority"
               disabled={location.pathname == "/HighPriority"}>
                  <button disabled={location.pathname == "/HighPriority"}>
                     !
                  </button>
               </Link> :
               ''
            }
         </HighPriority>

         <Update row={row} showUpdate={showUpdate} />
      </tr>
   }
}

/************************************************************
 * Columns
 ************************************************************/
export function TableHead({ children, style, id }) {
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
}

export const Title = ({children}) => <td><p>{children}</p></td>

export function Quantity({ children, status, setsOrQuantity }) {
   const quantity = children
   const divisible = quantity % 18 == 0
   const isStampSprayStatus = status >= 0 && status <= 2
   const showSets = setsOrQuantity == undefined ?
      isStampSprayStatus && divisible : setsOrQuantity && divisible
   return <td className="Quantity" style={{paddingLeft: ".75em"}}>
      { showSets ? quantity / 18 : quantity }
      {" "}
      { showSets ?
         ((quantity / 18) == 1 ? "set" : "sets") :
         "each"
      }
   </td>
}

export function LastModified({ children, showLastModified }) {
   const tablet = useMedia(tabletQuery)

   return !tablet && showLastModified && <td className="LastModified" style={{
      minWidth: 150
   }}>
      <p>{children}</p>
   </td>
}

export function Status({ children, showStatus }) {
   const tiny = useMedia(tinyQuery)
   const mobile = useMedia(mobileQuery)
   const name = statusMapNumberToName(children)
   const disabled = name == "Unknown"

   return !tiny && showStatus && <ErrorBoundary
   fallback={<button disabled> <h5>Unknown</h5> </button>}>
   <td className="Status" style={{placeContent: "center", placeItems: "center"}}>
      <Link to={disabled ? '#' : name}>
         <button style={{
            width: "calc(100% - 1em)",
            margin: ".2em .5em",
         }}
         disabled={disabled}
         >
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

export function HighPriority({ children, showHighPriority }) {
   const tablet = useMedia(tabletQuery)

   return !tablet && showHighPriority && <td className="HighPriority">
      <p>{children}</p>
   </td>
}

export function Update({ row, showUpdate }) {
   const { updateExpanded } = React.useContext(Context)
   const { setUpdateExpanded } = React.useContext(Context)
   const mobile = useMedia(mobileQuery)

   const update = () => {
      try {
         const newStatus = row.Status + 1

         // quick exit, we only "update" to valid statuses
         if (newStatus < 0 || newStatus >= 6)
            throw `Invalid new Status: '${newStatus}'`

         updateFirebase({ ...row, Status: newStatus })
            .catch(err => { throw err })
      }
      catch (err) {
         toast.error(err)
         return
      }
   }

   const rotate = () => {
      setUpdateExpanded(row.id == updateExpanded ? '' : row.id)
   }

   return !mobile && showUpdate && <td className="Update">
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

export default TaskRow
