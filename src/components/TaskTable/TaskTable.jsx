import React from "react"
import { useInitializer, ErrorBoundary } from "ehrrsn7-components"
import { Context } from "@contexts"
import { objToArray, getSortFunction, filterFunctions } from "@utils"
import { SearchAndNavigateBar, AccordionRow, TaskRow } from "."
import "./TaskTable.css"

export function TaskTable({
   setsOrQuantity, showStatus, showLastModified, showHighPriority, showUpdate, isPaginated, paginationRangeOverride, search, navigate, discarded
}) {
   const { tasks } = React.useContext(Context)
   const { tasksLength } = React.useContext(Context)
   const { setFilterDiscarded } = React.useContext(Context)
   const { updateExpanded, setUpdateExpanded } = React.useContext(Context)
   const { sortedBy } = React.useContext(Context)
   const { searchState } = React.useContext(Context)
   const { filterFunction } = React.useContext(Context)
   const { filterDiscarded } = React.useContext(Context)
   const { paginated, setPaginated } = React.useContext(Context)
   const { paginationOffset } = React.useContext(Context)
   const { paginationRange, setPaginationRange } = React.useContext(Context)

   // helper functions
   const getTasks = () => {
      const discardedFilter = filterDiscarded ?
         filterFunctions.discardedPartsStatus :
         filterFunctions.notDiscardedPartsStatus
      const searchStateFilter = row =>
         row.Title.toLowerCase().includes(searchState.toLowerCase()) ||
         row.id.toLowerCase().includes(searchState.toLowerCase())
      const get = () => objToArray(tasks)
         .filter(filterFunction)
         .filter(searchStateFilter)
         .filter(discardedFilter)
         .sort(getSortFunction(sortedBy))
      if (paginated)
         return get()
            .slice(paginationOffset, paginationOffset + paginationRange)
      return get()
   }

   // handlers
   const handleDiscarded = () => {
      const newDiscarded = discarded || false
      setFilterDiscarded(newDiscarded)
   }

   const handlePaginationRangeOverride = () => {
      if (paginationRangeOverride)
         setPaginationRange(paginationRangeOverride)
   }

   // on change
   useInitializer(() => setPaginated(isPaginated))
   useInitializer(handlePaginationRangeOverride)
   useInitializer(handleDiscarded)
   useInitializer(handlePaginationRangeOverride)
   useInitializer(handleDiscarded)

   // component
   return <ErrorBoundary fallback={<div>
      Error loading TaskTable component.
   </div>}>
      <SearchAndNavigateBar navigate={navigate} search={search} />
   <table id="TaskTable">
      <thead>
         <TaskRow.Head
            setsOrQuantity={setsOrQuantity}
            showLastModified={showLastModified}
            showStatus={showStatus}
            showHighPriority={showHighPriority}
            setUpdateExpanded={setUpdateExpanded}
            showUpdate={showUpdate}
         />
      </thead>
      <tbody>
         {/* No Tasks */}
         { tasksLength <= 0 && 
            <tr className="NoTasks">
               <td colSpan="100%">
                  <span>
                     <p>
                        <em>No Tasks</em>
                     </p>
                  </span>
               </td>
            </tr>
         }

         {/* Tasks */}
         { getTasks()
            .map(row => <React.Fragment key={row.id}>
            <TaskRow.Body row={row}
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
         </React.Fragment>) }

         <tr className="filler-row" />
      </tbody>
   </table>
   </ErrorBoundary>
}

export default TaskTable
