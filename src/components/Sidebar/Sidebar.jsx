import React from "react"
import { Link, useLocation } from "react-router-dom"
import { QRCodeCanvas } from "qrcode.react"
import {
   Sidebar as SidebarComponent,
   SidebarContext, separateCamelCase, useMedia
} from "ehrrsn7-components"
import { statusMapNameToNumber } from "@utils"
import "./Sidebar.css"

export function Sidebar() {
   const { showSidebar } = React.useContext(SidebarContext)
   const currentPage = useLocation()
   const dark = useMedia("(prefers-color-scheme: dark)")

   const isCurrentStatus = name => {
      const currentPageStatus =
         statusMapNameToNumber(currentPage.pathname.replace('/', ''))
      const status =
         statusMapNameToNumber(name)
      return status == currentPageStatus
   }

   return <SidebarComponent closeButton style={{
      boxShadow: !showSidebar && "none"
   }}>
      <Link to="/">
         <h2>No Toil<br />Task Tracker</h2><br />
      </Link>

      {[ "Stamp", "Spray", "Check", "Oil", "Bag",
         "CompletedParts", "DiscardedParts",
         "HighPriority"
      ].map(name =>
         <SidebarLink to={name} key={name} id={`SidebarLink-${name}`}
         className={isCurrentStatus(name) && "Selected"}>
            {separateCamelCase(name)}
         </SidebarLink>)
      }

      <QrCode style={{
         width: 225,
         margin: "1em 0",
         background: dark && "#F0F0F0",
         color: "black"
      }} />

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

const QrCode = ({style}) => { 
   return <QRCodeCanvas
      id="QrCode"
      value={`${window.location.protocol}//${window.location.hostname}:${window.location.port}`}
      size={style?.width || 150}
      color="white"
      bgColor={style?.background || "transparent"}
      level={"H"}
      style={style}
   />
}

export default Sidebar
