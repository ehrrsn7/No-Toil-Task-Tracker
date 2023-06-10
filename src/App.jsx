import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { SidebarContext, useInitializer } from "ehrrsn7-components"
import { Sidebar } from "@components"
import Pages from "@pages"
import { authorizeFirebaseUI } from "./firebase/firebaseUI"
import "./App.css"

export function App() {
   const { sidebarMarginLeft } = React.useContext(SidebarContext)
   const { setShowSidebar } = React.useContext(SidebarContext)

   const handleCloseSidebarOnPageClick = () => closeSidebarOnPageClick(setShowSidebar)

   useInitializer(handleCloseSidebarOnPageClick)
   useInitializer(authorizeFirebaseUI)

   return <div id="App"
   style={{ marginLeft: sidebarMarginLeft }}>
      <Routes>
			<Route path="/" element={<Pages.Dashboard />} />
			<Route path="/Dashboard" element={
            <Navigate to="/" />
         } />
			<Route path="/Stamp" element={<Pages.Stamp />} />
			<Route path="/Spray" element={<Pages.Spray />} />
			<Route path="/Check" element={<Pages.Check />} />
			<Route path="/Oil" element={<Pages.Oil />} />
			<Route path="/Bag" element={<Pages.Bag />} />
			<Route path="/HighPriority" element={<Pages.HighPriority />} />
			<Route path="/CompletedParts" element={
            <Pages.CompletedParts />
         } />
			<Route path="/DiscardedParts" element={
            <Pages.DiscardedParts />
         } />
		</Routes>

      {/* Absolute Content */}
      <Sidebar />
      <ToastContainer />
   </div>
}

// helper functions
function closeSidebarOnPageClick(setShowSidebar) {
   const handler = () => setShowSidebar(false)
   const pageElement = document.querySelector("#Content")
   pageElement?.addEventListener("click", handler)
   return (() => { pageElement?.removeEventListener("click", handler) })
}

export default App
