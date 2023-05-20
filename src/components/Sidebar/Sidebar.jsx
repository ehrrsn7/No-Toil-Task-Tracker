import React from "react"
import { Link } from "react-router-dom"
import {
   Sidebar as SidebarComponent,
   SidebarContext, separateCamelCase
} from "ehrrsn7-components"
import "./Sidebar.css"

export function Sidebar() {
   const { showSidebar } = React.useContext(SidebarContext)

   return <SidebarComponent closeButton style={{
      boxShadow: !showSidebar && "none",
      padding: "1em", width: 200,
   }}>
      <Link to="/">
         <h2>No Toil<br />Task Tracker</h2><br />
      </Link>

      {[ "Spray", "Check", "Oil", "Bag",
         "CompletedParts", "DiscardedParts",
      ].map(name => <SidebarLink to={name} key={name}>
         {separateCamelCase(name)}
      </SidebarLink>)}

      <Link id="FirestoreSidebarLink" to="https://console.firebase.google.com/u/0/project/no-toil-task-tracker/firestore/data/~2Ftasks~2FIEhcOWeXzlTjtsBtL80P" target="_blank" rel="noreferrer">
         <h3>Firestore Link (Admin)</h3>
      </Link>

   </SidebarComponent>
}

const SidebarLink = ({ to, children }) => to ? <div 
className="SidebarLink" style={{ marginBottom: "1em" }}>
   <Link to={to}>
      <button>
         <h4> {children} </h4>
      </button>
   </Link>
</div> :
<div>Invalid Link 'to' ({to})</div>

export const sum = (a, b) => a + b

export default Sidebar
