// firebase
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import {
   getFirestore,
   onSnapshot,
   doc,
   setDoc,
   addDoc,
   collection,
   query,
   Timestamp,
   deleteDoc
} from "firebase/firestore"
import { toast } from "react-toastify"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebaseConfig from "../private/firebaseConfig.json"
import { sortFunctions } from "@utils"

/**********************************************************************
 * Firestore
 **********************************************************************/
// Initialize Firebase (pass to FirebaseContext.Provider value)
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const analytics = getAnalytics(app)
export const db = getFirestore(app)

// set ('post')
export async function post(collectionName="tasks", obj={}) {
   try {
      if (obj.constructor.name == "Task") obj = obj.toObj()
      await addDoc(collection(db, collectionName), {
         ...obj,
         LastModified: Timestamp.fromDate(new Date()),
      })
         .then(() => {
            console.log("doc uploaded")
         })
         .catch(err => { throw err })
   } catch (err) {
      console.error(err)
   }
}

// get ('sync')
export async function onFirestoreSnapshot(collectionName="tasks", callback=()=>{}) {
   const ref = collection(db, collectionName)
   const q = query(ref)
   onSnapshot(q, callback)
}

export async function update(obj={}, collectionName="tasks") {
   console.log(obj)
   if (new Task(obj).id == "Unknown id") throw `unknown id: ${obj.id}`
   const ref = doc(db, collectionName, obj.id)
   await setDoc(ref, obj)
}

/**********************************************************************
 * Tasks
 **********************************************************************/
export async function fetchTasks({ tasks, setTasks, setConnected }) {
   onFirestoreSnapshot("tasks", snapshot => {
      const newTasks = {...tasks}
      snapshot.forEach(doc => {
         newTasks[doc.id] = new Task({
            ...doc.data(),
            id: doc.id,
            LastModified: doc.data().LastModified?.toDate(),
         })
      })
      // snapshot.docChanges().forEach(change => { console.log(change.type) })
      setTasks(newTasks)
   })
      .then(() => {
         setTimeout(() => setConnected(true), 500)
      })
      .catch(err => {
         setTimeout(() => setConnected(false), 500)
         toast.error(<>
            <h5>Error connecting to Firestore.</h5>
            <p>{err}</p>
         </>)
      })
}

export async function deleteTask(id="") {
   try {
      await deleteDoc(doc(db, "tasks", id))
         .catch(err => { throw err })
   }
   catch (err) {
      console.warn(err)
   }
}

export async function deleteAllDiscardedTasks(discardedTasks=[]) {
   if (!Array.isArray(discardedTasks))
      throw "discardedTasks is not an array"
   if (discardedTasks.length <= 0)
      throw "discardedTasks[] is empty"
   discardedTasks.forEach(task => {
      deleteTask(task.id)
   })
}

export async function deleteTasks(tasks=[]) {
   if (!Array.isArray(tasks))
      throw "tasks is not an array"
   if (tasks.length <= 0)
      throw "tasks[] is empty"
   tasks.forEach(task => {
      deleteTask(task.id)
   })
}

export class Task {
   constructor(props={}) {
      // validate incoming objects with new Task({...}) constructor call
      this.id = props.id                     || "Unknown id"
      this.Title = props.Title               || "Unknown Title"
      this.Quantity = props.Quantity         || -1
      this.Status = (props.Status != undefined) ? props.Status : -1
      this.Description = props.Description   || ''
      this.Oil = props.Oil                   || false
      this.Discarded = props.Discarded       || false
      this.HighPriority = props.HighPriority || false
      this.LastModified = props.LastModified
   }

   getDateString() {
      return this.LastModified ? this.LastModified.toDateString() : "Invalid Date Object"
   }

   getTimeString() {
      return this.LastModified ? this.LastModified.toLocaleTimeString() : "Invalid Time Object"
   }

   toObj() {
      return {
         id: this.id,
         Title: this.Title,
         Quantity: this.Quantity,
         Status: this.Status,
         Description: this.Description,
         Oil: this.Oil,
         HighPriority: this.HighPriority,
         Discarded: this.Discarded,
         LastModified: this.LastModified,
      }
   }
}
