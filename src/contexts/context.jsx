import React from "react"
import { fetchTasks } from "../firebase"

export const Context = React.createContext()

export function ContextProvider({ children }) {
   const [ tasks, setTasks ] = React.useState({})
   const [ sortedBy, setSortedBy ] = React.useState('')
   const [ connected, setConnected ] = React.useState(false)
   const [ updateExpanded, setUpdateExpanded ] = React.useState('')
   const [ filterFunction, setFilterFunction ] = React.useState(() => () => {})

   useInitializer(() => {
      try {
         fetchTasks({tasks, setTasks})
         setConnected(true)
      }
      catch (err) {
         setConnected(false)
         console.warn(err)
      }
   })

   const value = {
      tasks, setTasks,
      sortedBy, setSortedBy,
      connected, setConnected,
      updateExpanded, setUpdateExpanded,
      filterFunction, setFilterFunction,
   }
 
   return <Context.Provider value={value}>
      {children}
   </Context.Provider>
}

export function useInitializer(callback) {
   const mounted = React.useRef(false)

   React.useEffect(() => {
      try {
         if (!mounted.current) {
            mounted.current = true
            return callback()
         }
      }
      catch (err) {
         console.warn(err)
      }
   }, [])

   return mounted
}
