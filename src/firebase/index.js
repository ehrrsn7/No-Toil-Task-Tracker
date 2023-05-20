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
} from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebaseConfig from "../private/firebaseConfig.json"

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
      await addDoc(collection(db, collectionName), {
         ...obj,
         LastModified: Timestamp.fromDate(new Date()),
      })
      .then(() => {
         console.log("doc uploaded")
      })
   } catch (err) {
      console.error(err)
   }
}

// get ('sync')
export async function onFirestoreSnapshot(
   collectionName="tasks", callback=()=>{}
) {
   const ref = collection(db, collectionName)
   const q = query(ref)
   onSnapshot(q, callback, error => {throw error})
}

export async function update(collectionName="tasks", obj={}) {
   if (new Task(obj).id == "Unknown id") throw "unknown id"
   const ref = doc(db, collectionName, obj.id)
   await setDoc(ref, obj)
}

/**********************************************************************
 * Tasks
 **********************************************************************/
export async function fetchTasks({ tasks, setTasks }) {
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
}

export class Task {
   constructor(props={}) {
      // validate incoming objects with new Task({...}) constructor call
      this.id = props.id                     || "Unknown id"
      this.Title = props.Title               || "Unknown Title"
      this.Quantity = props.Quantity         || -1
      this.Status = (props.Status != undefined) ? props.Status : -1
      this.Description = props.Description   || "Unknown Description"
      this.Oil = props.Oil                   || false
      this.HighPriority = props.Discarded    || false
      this.Discarded = props.HighPriority    || false
      this.LastModified = props.LastModified
   }

   getDateString() {
      return this.LastModified ? this.LastModified.toDateString() : "Invalid Date Object"
   }

   getTimeString() {
      return this.LastModified ? this.LastModified.toLocaleTimeString() : "Invalid Time Object"
   }
}
