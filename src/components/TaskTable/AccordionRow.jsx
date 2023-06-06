import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useMedia } from "react-use"
import { toast } from "react-toastify"
import {
   MasonryLayout, MasonryCard, ErrorBoundary
} from "ehrrsn7-components"
import { setCSSProperty, statusMapNumberToName } from "@utils"
import { Context } from "@contexts"
import { update } from "../../firebase"
import "./AccordionRow.css"

export function AccordionRow({ row }) {
   const desktop = useMedia("(min-width: 850px)")
   const dark = useMedia("(prefers-color-scheme: dark)")
   const [ cardCount, setCardCount ] = React.useState(1)

   const handleCardCSS = () => {
      setCSSProperty(
         document.querySelector(".MasonryLayout"),
         "--card-count",
         cardCount
      )
   }

   const handleCardCount = () => {
      if (desktop) setCardCount(2)
      else setCardCount(1)
   }

   React.useEffect(handleCardCSS, [ cardCount ])
   React.useEffect(handleCardCount, [ desktop ])

   if (!row) return <div>'row' is undefined.</div>

   return <motion.tr className="AccordionRow">
      <td colSpan="100%" style={{ padding: 0, background: dark && "var(--background-dark-secondary)" }}>
         <MasonryLayout style={{ padding: "1em" }}>
            <MoreInfo row={row} />
            <GoToStatusButton row={row} />
            <Update row={row} />
            <UpdateButton row={row} />
            <Discard row={row} />
            <DiscardButton row={row} />
         </MasonryLayout>
      </td>
   </motion.tr>
}

export function Card({style, children, id}) {
   const dark = useMedia("(prefers-color-scheme: dark)")

   return <ErrorBoundary fallback={<>Error rendering Card</>}>
   <MasonryCard id={id} style={{
      background: dark ? "var(--background-dark)" : "white",
      boxShadow: "0 0 3px 3px #05050505",
      margin: 0, padding: "1em",
      ...style
   }}>
      {children}
   </MasonryCard>
   </ErrorBoundary>
}

export function GoToStatusButton({ row }) {
   const ref = React.useRef()

   const { setUpdateExpanded } = React.useContext(Context)

   return <Card style={{
      padding: 0
   }}>
      <Link to={statusMapNumberToName(row?.Status)} onClick={() => setUpdateExpanded(-1)}>
         <button ref={ref} style={{ background: "unset", width: "100%" }} >
            <h3>
               Go to '{statusMapNumberToName(row?.Status)}'
            </h3>
         </button>
      </Link>
   </Card>
}

export function MoreInfo({ row }) {
   if (!row)
      throw "In MoreInfo(row): row is undefined."

   return <Card>
      <div id="MoreInfo">
         <h2>
            More Info
         </h2>

         <h4>
         <table>
            <tbody>
               <tr>
                  <td>id</td>
                  <td>{row.id}</td>
               </tr>
               <tr>
                  <td>title</td>
                  <td>{row.Title}</td>
               </tr>
               <tr>
                  <td>quantity</td>
                  <td>{row.Quantity} each</td>
               </tr>
               <tr>
                  <td>status</td>
                  <td>{row.Status} — {statusMapNumberToName(row.Status)}</td>
               </tr>
               <tr>
                  <td>description</td>
                  <td>{row.Description}</td>
               </tr>
               <tr>
                  <td>last modified</td>
                  <td>
                     {row.LastModified?.toDateString("en-us")}<br />
                     {row.LastModified?.toLocaleTimeString("en-us")}
                  </td>
               </tr>
               <tr>
                  <td>oil</td>
                  <td>{row.Oil ? "✅" : "✖️"}</td>
               </tr>
               <tr>
                  <td>High Priority</td>
                  <td>{row.HighPriority ? "✅" : "✖️"}</td>
               </tr>
               <tr>
                  <td>Discarded</td>
                  <td>{row.Discarded ? "✅" : "✖️"}</td>
               </tr>
            </tbody>
         </table>
         </h4>
      </div>
   </Card>
}

export function DiscardButton({row}) {
   const ref = React.useRef()

   const onClick = () => {
      const toastPromise = new Promise(resolve => resolve(
         update({ ...row, Discarded: true })
      ))

      toast.promise(toastPromise, {
         pending: {
            render() {
               return <h5>Discarding task...</h5>
            },
            icon: false,
         },

         success: {
            render() {
               return <h5>Successfully Discarded Task: {row.Title}</h5>
            },
            icon: false,
         },

         error: {
            render({data}) {
               console.error(data)
               return data
            },
            icon: false,
         }
      })
   }

   return <Card style={{
      padding: 0
   }}>
      <button ref={ref} onClick={onClick} style={{background: "unset"}}>
         <h3>
            Discard Task
         </h3>
      </button>
   </Card>
}

export function Discard({ row }) {
   const [ quantity, setQuantity ] = React.useState(0)

   if (!row)
      throw "In Update(row): row is undefined."

   return <Card>
      <h3 style={{padding: "0.5em"}}>
         Discard Parts
      </h3>
      <span style={{
         placeContent: "space-between"
      }}>
         <button style={{
            margin: ".5em",
            padding: ".5em",
            width: "2.5em",
            height: "2.5em",
            transition: ".3s ease-in-out",
         }} onClick={() => setQuantity(quantity - 1)}>
            -
         </button>

         <div style={{
            padding: "1em",
            placeContent: "center",
            placeItems: "space-between",
            textAlign: "center",
         }}>
            <h2 style={{
               textAlign: "center",
               padding: 0,
               margin: 0,
            }}>
               {quantity}
            </h2>
            <h4 style={{
               padding: 0,
               margin: 0,
            }}>
               Sets
            </h4>
         </div>

         <button style={{
            margin: ".5em",
            padding: ".5em",
            width: "2.5em",
            height: "2.5em",
            transition: ".3s ease-in-out",
            borderRadius: "18px",
         }}
         onClick={() => setQuantity(
            quantity <= row.Quantity ? quantity + 1 : quantity
         )}>
            +
         </button>
      </span>
      <button>
         <h5>
            Discard Parts
         </h5>
      </button>
   </Card>
}

export function UpdateButton({row}) {
   const ref = React.useRef()

   const onClick = () => {
      const toastPromise = new Promise(resolve => resolve(
         // ...
      ))

      toast.promise(toastPromise, {
         pending: {
            render() {
               return <h5>Updating task...</h5>
            },
            icon: false,
         },

         success: {
            render() {
               return <h5>Successfully Updated Task: {row.Title}</h5>
            },
            icon: false,
         },

         error: {
            render({data}) {
               console.error(data)
               return data
            },
            icon: false,
         }
      })
   }

   return <Card style={{
      padding: 0
   }}>
      <button ref={ref} onClick={onClick} style={{background: "unset"}}>
         <h3>
            Update Task
         </h3>
      </button>
   </Card>
}


export function Update({ row }) {
   const [ quantity, setQuantity ] = React.useState(0)

   if (!row)
      throw "In Update(row): row is undefined."

   return <Card>
      <h3 style={{padding: "0.5em"}}>
         Update '{row.Title}'
      </h3>
      <span style={{
         placeContent: "space-between"
      }}>
         <button style={{
            margin: ".5em",
            padding: ".5em",
            width: "2.5em",
            height: "2.5em",
            transition: ".3s ease-in-out",
         }} onClick={() => setQuantity(quantity - 1)}>
            -
         </button>

         <div style={{
            padding: "1em",
            placeContent: "center",
            placeItems: "space-between",
            textAlign: "center",
         }}>
            <h2 style={{
               textAlign: "center",
               padding: 0,
               margin: 0,
            }}>
               {quantity}
            </h2>
            <h4 style={{
               padding: 0,
               margin: 0,
            }}>
               Sets
            </h4>
         </div>

         <button style={{
            margin: ".5em",
            padding: ".5em",
            width: "2.5em",
            height: "2.5em",
            transition: ".3s all ease-in-out",
         }} onClick={() => setQuantity(
            quantity <= row.Quantity ? quantity + 1 : quantity
         )}>
            +
         </button>
      </span>
      <button style={{
         transition: ".3s all ease-in-out",
         border: "1px solid rgb(0,0,0,0.05)",
         padding: "0.5em",
         borderRadius: "15px",
      }}>
         <h5>
            Update Parts
         </h5>
      </button>
   </Card>
}

export default AccordionRow
