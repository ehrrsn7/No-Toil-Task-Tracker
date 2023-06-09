import React from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useMedia } from "react-use"
import { toast } from "react-toastify"
import {
   MasonryLayout, MasonryCard, ErrorBoundary, useInitializer
} from "ehrrsn7-components"
import {
   setCSSProperty, statusMapNumberToName, statusMapNameToNumber
} from "@utils"
import { Context } from "@contexts"
import { deleteTask, post, update } from "../../firebase"
import "./AccordionRow.css"
import { isObject } from "url/util"

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
            <Discard row={row} />
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
   const { setUpdateExpanded } = React.useContext(Context)
   const location = useLocation()

   const disabled = row.Status == statusMapNameToNumber(location.pathname.replace('/', ''))

   const to = !disabled && statusMapNumberToName(row?.Status)

   const onClick = () => {
      if (disabled) return
      setUpdateExpanded(-1)
   }

   return <Card style={{
      padding: 0
   }}>
      <Link className="GoToStatusButton" to={to} onClick={onClick}>
         <button disabled={disabled}>
            <h3>
               Go to '{statusMapNumberToName(row?.Status)}'
            </h3>
         </button>
      </Link>
   </Card>
}

export function MoreInfo({ row }) {
   const [ editEnabled, setEditEnabled ] = React.useState(false)
   const [ id, setid ] = React.useState(row.id)
   const [ Title, setTitle ] = React.useState(row.Title)
   const [ Quantity, setQuantity ] = React.useState(row.Quantity)
   const [ Status, setStatus ] = React.useState(row.Status)
   const [ Description, setDescription ] = React.useState(row.Description)
   const [ LastModified, setLastModified ] = React.useState(row.LastModified)
   const [ Oil, setOil ] = React.useState(row.Oil)
   const [ HighPriority, setHighPriority ] = React.useState(row.HighPriority)
   const [ Discarded, setDiscarded ] = React.useState(row.Discarded)
   const tablet = useMedia("(max-width: 550px)")

   const handleDelete = () => {
      const toastID = toast.loading({
         render: `Deleting task '${row.Title}'`,
         autoClose: 3000
      })
      console.log("before promise", {toastID})
      deleteTask(row.id)
         .then(() => {
            console.log("after promise", {toastID})
            toast.update(toastID, {
               render: `Successfully deleted task '${row.Title}'`,
               type: "error",
               isLoading: false,
               icon: false
            })
         })
         .catch(() => {
            console.log("error in promise", {toastID})
            toast.update(toastID, {
               render: `Error pushing changes to tasks['${row.Title}']`,
               type: "error",
               isLoading: false
            })
         })
   }

   const handleDone = () => {
      const toastID = toast.loading({
         render: `Pushing changes to tasks['${row.Title}']`,
         autoClose: 3000
      })

      // update task here
      update({id, Title, Quantity, Status,
         Description, LastModified,
         Oil, HighPriority, Discarded
      }).then(() => {
            console.log("after promise", {toastID})
            toast.update(toastID, {
               render: `Successfully pushed changes to tasks['${row.Title}']`,
               type: "success",
               isLoading: false
            })
            setEditEnabled(false)
         })
         .catch(() => {
            console.log("error in promise", {toastID})
            toast.update(toastID, {
               render: `Error pushing changes to tasks['${row.Title}']`,
               type: "error",
               isLoading: false
            })
         })
   }

   if (!row)
      throw "In MoreInfo(row): row is undefined."

   return <Card>
      <div id="MoreInfo" style={{marginBottom: "2em", paddingBottom: !editEnabled && "1.2em"}}>
         <span style={{
            margin: "0 0 1em 0",
            flexDirection: tablet && "column",
            placeContent: tablet && "center",
            placeItems: tablet && "center",
            gap: "1em",
         }}>
            <h1 className="squishy-letters"> More Info </h1>

            <span style={{margin: tablet ? "auto" : 0, placeContent: "center"}}>
               <button onClick={() => setEditEnabled(!editEnabled)}>
                  <h4> {editEnabled ? "Cancel" : "Edit"} </h4>
               </button>
            </span>
         </span>

         <table>
            <tbody>
               <tr>
                  <td><h4>id</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="id" value={id} setValue={setid}
                     type="text" disabled
                     /> :
                     <MoreInfoOutput
                     property="id"
                     type="text" value={id}
                     />
                  }
               </tr>
               <tr>
                  <td><h4>Title</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="Title" value={Title} setValue={setTitle}
                     type="text"
                     /> :
                     <MoreInfoOutput
                     property="Title"
                     type="text" value={Title}
                     />
                  }
               </tr>
               <tr>
                  <td><h4>Quantity</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="Quantity" value={Quantity} setValue={setQuantity}
                     type="number"
                     /> :
                     <MoreInfoOutput
                     property="Quantity"
                     type="number" value={Quantity}
                     />
                  }
               </tr>
               <tr>
                  <td><h4>Status</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="Status" value={Status} setValue={setStatus}
                     type="number" Oil={Oil}
                     /> :
                     <MoreInfoOutput
                     property="Status"
                     type="number" value={Status}
                     />
                  }
               </tr>
               <tr>
                  <td><h4>Description</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="Description" value={Description} setValue={setDescription}
                     type="text"
                     /> :
                     <MoreInfoOutput
                     property="Description"
                     type="text" value={Description}
                     />
                  }
               </tr>
               <tr>
                  <td><h4>Last Modified</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="LastModified" value={LastModified} setValue={setLastModified}
                     type="datetime-local"
                     /> :
                     <MoreInfoOutput
                     property="LastModified"
                     type="datetime-local" value={LastModified}
                     />
                  }
               </tr>
               <tr>
                  <td><h4>Oil</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="Oil" value={Oil} setValue={setOil}
                     type="checkbox"
                     /> :
                     <MoreInfoOutput
                     property="Oil"
                     type="checkbox" value={Oil}
                     />
                  }
               </tr>
               <tr>
                  <td><h4>High Priority</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="HighPriority" value={HighPriority} setValue={setHighPriority}
                     type="checkbox"
                     /> :
                     <MoreInfoOutput
                     property="HighPriority"
                     type="checkbox" value={HighPriority}
                     />
                  }
               </tr>
               <tr>
                  <td><h4>Discarded</h4></td>
                  { editEnabled ?
                     <MoreInfoInput
                     property="Discarded" value={Discarded} setValue={setDiscarded}
                     type="checkbox"
                     /> :
                     <MoreInfoOutput
                     property="Discarded"
                     type="checkbox" value={Discarded}
                     />
                  }
               </tr>
            </tbody>
         </table>
         { editEnabled && <span style={{placeContent: "space-around"}}>
            <button id="DeleteTask" onClick={handleDelete}>
               <h4>delete</h4>
            </button>
            <button id="TaskDone" onClick={handleDone}>
               <h4>Done</h4>
            </button>
         </span>}
      </div>
   </Card>
}

function MoreInfoOutput({ property, type, value, style, className, id }) {
   const handleOutput = () => {
      switch (type) {
         case "number":
            switch (property) {
               case "Status":
                  return <h4>{value} : {statusMapNumberToName(value)}</h4>
               case "Quantity":
                  return <h4>{value} each</h4>
               default: return <h4>{value}</h4>
            }

         case "datetime-local":
            if (!value || !(value instanceof Date))
            return <em><strong>Error: value is not a Date.</strong></em>
            return <h4>
               {value.toDateString("en-us")}<br />
               {value.toLocaleTimeString("en-us")}
            </h4>

         case "checkbox":
            return <h4>{value ? "✅" : "✖️"}</h4>

         default:
            if (isObject(value))
               return <em><strong>Error: value is an object.</strong></em>
            return <h4>{value}</h4>
      }
   }

   return <td id={id} className={className} style={style}>
      {handleOutput() }
   </td>
}

function MoreInfoInput({
   property, type, disabled,
   value, setValue, Oil,
   style, className, id
}) {
   const handleInput = () => {
      if (type == "number") {
         if (property == "Status") {
            return <select onChange={event => {
               const newValue = statusMapNameToNumber(
                  (event.target.value == "Complete") ?
                     "CompletedParts" :
                     event.target.value
               )
               setValue(newValue)
            }}>
               <option>Stamp</option>
               <option>Spray</option>
               <option>Check</option>
               <option disabled={!Oil}>Oil</option>
               <option>Bag</option>
               <option>Complete</option>
            </select>
         }
      }

      if (type == "checkbox") {
         return <label className="CheckboxContainer">
            <input type={type} checked={value} disabled={disabled} onChange={event => {
               const newValue = event.target.checked
               setValue(newValue)
            }} />
            <span className="Checkmark" />
         </label>
      }

      if (type == "datetime-local") {
         return <input
         type={type}
         value={value?.toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).replace(" ", "T")}
         disabled={disabled}
         pattern="\d{4}-\d{2}-\d{2}"
         onChange={event => {
            const newValue = new Date(event.target.value)
            setValue(newValue)
         }}
         />
      }

      const onChange = event => setValue(event.target.value)

      return <input type={type} value={value} disabled={disabled} onChange={onChange} />
   }

   return <td id={id} className={className} style={style}>
      {handleInput()}
   </td>
}

export function Update({ row }) {
   const [ Quantity, setQuantity ] = React.useState(row.Quantity)

   const onInputChange = event => {
      const newQuantity = event.target.value
      if (newQuantity > row.Quantity || newQuantity < 0) return
      setQuantity(newQuantity)
   }

   const onIncrementClick = () => {
      const newQuantity = parseInt(Quantity) + 1
      setQuantity(newQuantity)
   }

   const onDecrementClick = () => {
      const newQuantity = parseInt(Quantity) - 1
      setQuantity(newQuantity)
   }

   const onUpdateClick = () => {
      // don't update status past completed -- that's out of bounds
      if (row.Status == 5) return

      // nothing to update
      if (Quantity == 0) return

      // update the whole task
      else if (Quantity == row.Quantity)
         update({ ...row, Status: row.Status + 1 })

      // update certain Quantity:
      //    create new task with new quantity:
      //    row.Quantity - Quantity
      //    and leave it
      //    then update what's left
      else if (Quantity < row.Quantity) {
         const thisTask = {
            ...row,
            Status: row.Status + 1,
            Quantity: Quantity,
            LastModified: new Date(),
         }
         const leftOver = {
            ...row,
            id: null,
            Quantity: row.Quantity - Quantity,
            LastModified: new Date(),
         }
         post("tasks", leftOver)
         update(thisTask)
      }
      else if (Quantity > row.Quantity) {
         throw "error: new Quantity is somehow > row.Quantity"
      }
   }

   if (!row)
      throw "In Update(row): row is undefined."

   return <Card id="Update">
      <h2> Update Parts </h2>

      <span className="UpdateQuantity">
         <button className="DecrementButton"
         disabled={Quantity <= 0}
         onClick={onDecrementClick}>
            <h5> - </h5>
         </button>

         <span className="UpdateQuantityAmount">
            <input value={ Quantity } onChange={ onInputChange } />
            <h3> each </h3>
         </span>

         <button className="IncrementButton"
         disabled={Quantity >= row.Quantity}
         onClick={onIncrementClick}>
            <h5> + </h5>
         </button>
      </span >
      <button id="UpdateButton" disabled={Quantity == 0 || row.Status == 5} onClick={onUpdateClick}>
         <h5> Update Parts </h5>
      </button>
   </Card>
}

export function Discard({ row }) {
   const [ Quantity, setQuantity ] = React.useState(row.Quantity)

   const onInputChange = event => {
      const newQuantity = event.target.value
      if (newQuantity > row.Quantity || newQuantity < 0) return
      setQuantity(newQuantity)
   }

   const onIncrementClick = () => {
      const newQuantity = Quantity + 1
      setQuantity(newQuantity)
   }

   const onDecrementClick = () => {
      const newQuantity = Quantity - 1
      setQuantity(newQuantity)
   }

   const onDiscardClick = () => {
      // nothing to discard
      if (Quantity == 0) return

      // discard the whole task
      else if (Quantity == row.Quantity)
         update({ ...row, Discarded: true })

      // discard certain Quantity:
      //    create new task with new quantity:
      //    row.Quantity - Quantity
      //    and leave it
      //    then update what's left
      else if (Quantity < row.Quantity) {
         const thisTask = {
            ...row,
            Discarded: true,
            Quantity: Quantity,
            LastModified: new Date(),
         }
         const leftOver = {
            ...row,
            id: null,
            Quantity: row.Quantity - Quantity,
            LastModified: new Date(),
         }
         post("tasks", leftOver)
         update(thisTask)
      }
      else if (Quantity > row.Quantity) {
         throw "error: new Quantity is somehow > row.Quantity"
      }
   }

   if (!row)
      throw "In Update(row): row is undefined."

   return <Card id="Discard">
      <h2> Discard Parts </h2>

      <span className="UpdateQuantity">
         <button className="DecrementButton"
         disabled={Quantity <= 0}
         onClick={onDecrementClick}>
            <h5>-</h5>
         </button>

         <span className="UpdateQuantityAmount">
            <input value={ Quantity } onChange={onInputChange} />
            <h3> each </h3>
         </span>

         <button className="IncrementButton"
         disabled={Quantity >= row.Quantity}
         onClick={onIncrementClick}>
            <h5> + </h5>
         </button>
      </span >
      <button id="DiscardPartsButton"
      disabled={Quantity == 0}
      onClick={onDiscardClick}>
         <h5> Discard Parts </h5>
      </button>
   </Card>
}

export default AccordionRow
