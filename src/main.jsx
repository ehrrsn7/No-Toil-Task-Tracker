import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { SidebarContextProvider } from "ehrrsn7-components"
import { ContextProvider } from "@contexts/context.jsx"
import { FirebaseUIContextProvider } from "./firebase/firebaseUI"
import App from "./App"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <BrowserRouter>
      <ContextProvider>
      <SidebarContextProvider>
      <FirebaseUIContextProvider>
         <App />
      </FirebaseUIContextProvider>
      </SidebarContextProvider>
      </ContextProvider>
      </BrowserRouter>
   </React.StrictMode>,
)
