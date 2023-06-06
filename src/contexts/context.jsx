import React from "react"
import { useInitializer } from "ehrrsn7-components"
import { filterFunctions, objToArray } from "@utils"
import { fetchTasks } from "../firebase"

export const Context = React.createContext()

export function ContextProvider({ children }) {
   // states
   const [ tasks, setTasks ] = React.useState({})
   const [ tasksLength, setTasksLength ] = React.useState(0)
   const [ sortedBy, setSortedBy ] = React.useState('')
   const [ connected, setConnected ] = React.useState(null)
   const [ updateExpanded, setUpdateExpanded ] = React.useState('')
   const [ paginationOffset, setPaginationOffset ] = React.useState(0)
   const [ paginationRange, setPaginationRange ] = React.useState(-1)
   const [ filterFunction, setFilterFunction ] = React.useState(() => row => row)
   const [ filterDiscarded, setFilterDiscarded ] = React.useState(false)
   const [ currentPage, setCurrentPage ] = React.useState(1)
   const [ searchState, setSearchState ] = React.useState("")

   // handlers
   const handleTasksLength = () => {
      try {
         const getTasks = () => {
            const discardedFilter = filterDiscarded ?
               filterFunctions.discardedPartsStatus :
               filterFunctions.notDiscardedPartsStatus
            return objToArray(tasks)
               .filter(filterFunction)
               .filter(discardedFilter)
               .filter(row => row.Title.includes(searchState))
         }

         const newTasksLength = getTasks().length
         setTasksLength(newTasksLength)
      }
      catch (err) {
         console.warn(err)
      }
   }

   const handleFetchTasks = () => {
      fetchTasks({tasks, setTasks, setConnected})
   }

   // initializer caller
   useInitializer(handleFetchTasks)

   // onChange callers
   React.useEffect(handleTasksLength, [ tasks, filterFunction, searchState ])

   // serve states
   const value = {
      tasks, setTasks,
      tasksLength, setTasksLength,
      sortedBy, setSortedBy,
      connected, setConnected,
      updateExpanded, setUpdateExpanded,
      paginationOffset, setPaginationOffset,
      paginationRange, setPaginationRange,
      filterFunction, setFilterFunction,
      currentPage, setCurrentPage,
      searchState, setSearchState,
      filterDiscarded, setFilterDiscarded,
   }
 
   return <Context.Provider value={value}>
      {children}
   </Context.Provider>
}
