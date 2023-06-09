import React from "react"
import { useMedia } from "react-use"
import {
   SidebarContext, ToggleSidebarButton,
   Header as HeaderComponent, useInitializer
} from "ehrrsn7-components"
import { Context } from "@contexts"
import "./Header.css"

export function Header({children, style}) {
   const mobile = useMedia("(max-width: 450px)")

   return <HeaderComponent style={style}>
      { mobile ?
         <components.Mobile>{children}</components.Mobile> :
         <components.NotMobile>{children}</components.NotMobile>
      }
   </HeaderComponent>
}

const components = {
   Mobile: ({children}) => {
      const { showSidebar } = React.useContext(SidebarContext)

      return <div style={{width: "100%"}}>
         <span style={{padding: "1em 1em 0 1em", placeItems: "center"}}>
            <ToggleSidebarButton style={{
               opacity: showSidebar ? 0 : 1,
               transition: "opacity 0.3s ease-in-out",
            }} />

            <Status />

            {/* login */}
         </span>
         <span style={{ width: "100%", placeContent: "center" }}>
            <h2 id="Title" className="squishy-letters"
            style={{textAlign: "center", marginTop: ".3em"}}>
               {children}
            </h2>
         </span>
      </div>
   },

   NotMobile: ({ children }) => {
      const { showSidebar } = React.useContext(SidebarContext)
      // const tablet = useMedia("(max-width: 650px)")
      const dark = useMedia("(prefers-color-scheme: dark)")

      return <span style={{flexWrap: "nowrap", width: "100%"}}>
         <ToggleSidebarButton style={{ 
            opacity: showSidebar ? 0 : 1,
            position: "absolute",
            top: "1.2em",
            left: "1em"
         }} /> 
         <h2 id="Title" className="squishy-letters" style={{
            marginLeft: showSidebar ? "1em" : "2.5em",
            marginTop: "auto",
            marginBottom: "auto",
            transition: "margin 0.3s ease-in-out",
            textAlign: "left"
         }}>
            {children}
         </h2>
         <span style={{
            placeContent: "end",
            placeItems: "center",
            flexWrap: "nowrap",
            color: dark ? "white" : "#505050"
         }}>
            { <Status style={{ padding: "1em" }} /> }
            <div style={{gap: 10, padding: 10}}>
               {/* login */}
            </div>
         </span>
      </span>
   },
}

export function Time() {
   const [ time, setTime ] = React.useState(new Date())

   const handleTime = () => { setInterval(() => setTime(new Date()), 1100) }

   useInitializer(handleTime)

   return <div id="Time">
      <h5 style={{padding: "unset"}}>{ time.toDateString() }</h5>
      <h5 style={{padding: "unset"}}>{ time.toLocaleTimeString() }</h5>
   </div>
}

export function Connected() {
   const { connected } = React.useContext(Context)

   if (connected == null)
      return <h4 id="Connected" style={{color: "gray"}}
      className="Connecting hide-on-print squishy-letters">
         Connecting...
      </h4>

   else if (!connected)
      return <h4 id="Connected" style={{color: "red"}}
      className="NotConnected hide-on-print squishy-letters">
         Not Connected
      </h4>

   else // connected
      return <h4 id="Connected" style={{color: "green"}}
      className="hide-on-print squishy-letters">
         Connected
      </h4>
}

export function Status({ style }) {
   return <div id="Status" style={{
      fontSize: "11px", marginTop: "auto", marginBottom: "auto",
      ...style
   }}>
      <Time />
      <Connected />
   </div>
}

export default Header
