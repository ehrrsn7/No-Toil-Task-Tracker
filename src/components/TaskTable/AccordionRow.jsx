import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useMedia } from "react-use"
import {
   MasonryLayout, MasonryCard, MasonryLayoutContext, ErrorBoundary
} from "ehrrsn7-components"
import { update } from "../../firebase"
import { statusMapNumberToName } from "./TaskTable"
import "./AccordionRow.css"

export const motionVariants = {
   // this solved my issue with jitter-y accordion div animations
   // https://www.framer.com/motion/transition/
   item: {
      hidden: { opacity: 0 },
      show: { opacity: 1 }
   }
}

export function AccordionRow({ row }) {
   if (!row) return <div>'row' is undefined.</div>
   const mobile = useMedia("(max-width: 368px)")

   return <motion.tr
   variants={motionVariants.item}
   className="AccordionRow">
      <td colSpan="100%" style={{padding: 0}}>
         <MasonryLayout cardWidth={mobile ? 200 : 300} 
         style={{
            placeContent: mobile && "center",
            padding: "1em"
         }}>
            <cards.GoToStatusButton row={row} />
            <cards.MoreInfo row={row} />
            <cards.Update row={row} />
            <cards.Discard row={row} />
            <cards.DiscardButton row={row} />
         </MasonryLayout>
      </td>
   </motion.tr>
}

export const cards = {
   Card: ({style, children, id}) => {
      const { setCardWidth } = React.useContext(MasonryLayoutContext)

      const dark = useMedia("(prefers-color-scheme: dark)")
      const mobile = useMedia("(max-width: 320px)")

      React.useEffect(() => {
         setCardWidth && setCardWidth(mobile ? 200 : 300)
      }, [mobile])

      return <ErrorBoundary fallback={<>Error rendering cards.Card</>}>
      <MasonryCard id={id} style={{
         background: dark ? "#303030" : "white",
         border: "1px solid #88888850",
         boxShadow: "0 0 3px 3px #05050505",
         margin: 0, padding: "1em",
         marginBottom: "-1em",
         ...style
      }}>
         {children}
      </MasonryCard>
      </ErrorBoundary>
   },

   GoToStatusButton: ({ row }) => {
      // if (!row.Status)
      //    throw "In cards.GoToStatusButton(row): row.Status is undefined."

      const ref = React.useRef()

      return <cards.Card id="GoToStatusButton">
         <Link to={statusMapNumberToName(row?.Status)}>
            <button ref={ref} >
               <h3>
                  Go to '{statusMapNumberToName(row?.Status)}'
               </h3>
            </button>
         </Link>
      </cards.Card>
   },

   DiscardButton: ({row}) => {
      const ref = React.useRef()
      const dark = useMedia("(prefers-color-scheme: dark)")

      const onClick = event => {
         update({ ...row, Discarded: true })
      }

      return <cards.Card>
         <button ref={ref} onClick={onClick} style={{
            background: dark ? "transparent" : "white",
            border: "1px solid #00000011",
            boxShadow: "0 0 3px 3px #00000005",
            filter: "brightness(1)",
            transition: "filter 0.3s ease-in-out",
         }}>
            <h3>
               Discard Task
            </h3>
         </button>
      </cards.Card>
   },

   MoreInfo: ({ row }) => {
      if (!row)
         throw "In cards.MoreInfo(row): row is undefined."

      const ListItem = ({prop, val}) => <li>
         <span>
            <h3>{prop}</h3> &emsp; <p>{val ? val : row[prop]}</p>
         </span>
      </li>

      return <cards.Card>
         <div>
            <h3 style={{textAlign: "center"}}>
               More Info
            </h3>

            <ul style={{
               listStyleType: "none",
               padding: 0
            }}>
               <ListItem prop="id" />
               <ListItem prop="Title" />
               <ListItem prop="Quantity" />
               <ListItem prop="Status" />
               <ListItem prop="Description" />
               <li>
                  <span>
                     <h3>Last Modified:</h3>
                     <div style={{textAlign: "right"}}>
                        <p>{row.LastModified?.toDateString("en-us")}</p>
                        <p>{row.LastModified?.toLocaleTimeString("en-us")}</p>
                     </div>
                  </span>
               </li>
               <ListItem prop="Oil" val={row.HighPriority ? "True" : "False"} />
               <ListItem prop="High Priority" val={row.HighPriority ? "True" : "False"} />
               <ListItem prop="Discarded" val={row.Discarded ? "True" : "False"} />
            </ul>
         </div>
      </cards.Card>
   },

   Discard: ({ row }) => {
      const [ quantity, setQuantity ] = React.useState(0)

      const dark = useMedia("(prefers-color-scheme: dark)")

      if (!row)
         throw "In cards.Update(row): row is undefined."

      return <cards.Card>
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
      </cards.Card>
   },

   Update: ({ row }) => {
      const [ quantity, setQuantity ] = React.useState(0)

      const dark = useMedia("(prefers-color-scheme: dark)")

      if (!row)
         throw "In cards.Update(row): row is undefined."

      return <cards.Card>
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
      </cards.Card>
   },
}
