import React from "react"
import { Link } from "react-router-dom"
import { Footer } from "ehrrsn7-components"
import { Context } from "../contexts/context"
import { Header, TaskTable, filterFunctions } from "../components"
import "./Stamp.css"

export function Stamp() {
   const { setFilterFunction } = React.useContext(Context)

   React.useEffect(() => {
      setFilterFunction(() => filterFunctions.stampStatus)
   }, [])

   return <div id="Stamp" className="Page">
      <Header>
         Stamp
      </Header>
      <main id="Content">
         <TaskTable
         showHighPriority
         showLastModified
         showUpdate 
         />
      </main>
      <Footer>
         <nav style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
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