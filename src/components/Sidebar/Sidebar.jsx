import React from "react"
import { Link, useLocation } from "react-router-dom"
import {
   Sidebar as SidebarComponent,
   SidebarContext, separateCamelCase
} from "ehrrsn7-components"
import { statusMapNameToNumber } from "@utils"
import "./Sidebar.css"

export function Sidebar() {
   const { showSidebar } = React.useContext(SidebarContext)
   const currentPage = useLocation()

   const isCurrentStatus = name => {
      const currentPageStatus =
         statusMapNameToNumber(currentPage.pathname.replace('/', ''))
      const status =
         statusMapNameToNumber(name)
      return status == currentPageStatus
   }

   console.log({currentPage: statusMapNameToNumber(currentPage.pathname.replace('/', ''))})

   return <SidebarComponent closeButton style={{
      boxShadow: !showSidebar && "none"
   }}>
      <Link to="/">
         <h2>No Toil<br />Task Tracker</h2><br />
      </Link>

      {[ "Stamp", "Spray", "Check", "Oil", "Bag",
         "CompletedParts", "DiscardedParts",
      ].map(name =>
         <SidebarLink to={name} key={name} id={`SidebarLink-${name}`}
         className={isCurrentStatus(name) && "Selected"}>
            {separateCamelCase(name)}
         </SidebarLink>)
      }

      <Link id="FirestoreSidebarLink" to="https://console.firebase.google.com/u/0/project/no-toil-task-tracker/firestore/data/~2Ftasks~2FIEhcOWeXzlTjtsBtL80P" target="_blank" rel="noreferrer">
         <h3>Firestore Link (Admin)</h3>
      </Link>

   </SidebarComponent>
}

const SidebarLink = ({ to, children, id, className }) => {
   const newClassName = `SidebarLink${className ? '-' + className : ''}`
   return to ?
   <div id={id} className={newClassName} style={{ marginBottom: "1em" }}>
      <Link to={to}>
         <button>
            <h4> {children} </h4>
         </button>
      </Link>
   </div> :
   <div>Invalid Link 'to' ({to})</div>
}

export default Sidebar
