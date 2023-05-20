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

      return <span>
         <ToggleSidebarButton style={{
            opacity: showSidebar ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
            margin: "1em",
            position: "absolute"
         }} />
         <h2 id="Title" className="squishy-letters" style={{marginLeft: showSidebar ? "1em" : "2.5em"}}>
            {children}
         </h2>
      </span>
   },

   NotMobile: ({ children }) => {
      const { showSidebar } = React.useContext(SidebarContext)
      const tablet = useMedia("(max-width: 650px)")
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
            { !tablet && <Status style={{ padding: "1em" }} /> }
         </span>
      </span>
   },
}

export function Time() {
   const [ time, setTime ] = React.useState(new Date())
   useInitializer(() => {
      const interval = setInterval(() => setTime(new Date()), 1000)
      return () => clearInterval(interval)
   })
   return <>
      { time.toDateString() }<br />
      { time.toLocaleTimeString() }<br />
   </>
}

export function Status({ style }) {
   const { connected } = React.useContext(Context)
   const h4Style = {
      margin: 0, padding: 0, color: "green", transform: "scaleX(115%)"
   }
   return <div style={{
      fontSize: "11px", marginTop: "auto", marginBottom: "auto",
      ...style
   }}>
      <Time />
      { connected ?
         <h4 className="squishy-letters" style={h4Style}>
            Connected
         </h4> :
         <h4 className="squishy-letters" style={h4Style}>
            Not Connected
         </h4>
      }
   </div>
}

export default Header
