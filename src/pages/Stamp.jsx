import React from "react"
import { Link } from "react-router-dom"
import { Footer, useInitializer } from "ehrrsn7-components"
import { Context } from "@contexts"
import { filterFunctions } from "@utils"
import { Header, TaskTable, Paginator } from "@components"
import "./Stamp.css"

export function Stamp() {
   const { setFilterFunction } = React.useContext(Context)

   const handleStatusFilter = () => {
      setFilterFunction(() => filterFunctions.stampStatus)
   }

   useInitializer(handleStatusFilter)

   return <div id="Stamp" className="Page">
      <Header>
         Stamp
      </Header>
      <main id="Content">
         <TaskTable
            showHighPriority
            showLastModified
            showUpdate 
            isPaginated
            search
            navigate
         />
      </main>
      <Footer>
         <Paginator />
         <nav id="StatusNavigation">
            <Link to="/">
               <button>
                  <h5 style={{whiteSpace: "nowrap"}}>
                     ←
                  </h5>
               </button>
            </Link>
            <Link to="/">
               <button>
                  <h5 style={{whiteSpace: "nowrap"}}>
                     Back to Dashboard
                  </h5>
               </button>
            </Link>
            <Link to="/Spray"><button><h5>Spray →</h5></button></Link>
         </nav>
      </Footer>
   </div>
}