import { Task } from "../firebase"
import { toast } from "react-toastify"

export function arrToCsv(data=[]) {
   try {
      if (!data || isEmptyArray(data)) throw ""

      const csvRows = []

      /**********************************************************************
       * Get headers as every csv data format has header
       * (head means column name) so objects key is nothing but
       * column name for csv data using Object.key() function.
       * We fetch key of object as column name for csv.
      **********************************************************************/
     const headers = Object.keys(data[0])

      /**********************************************************************
       * Using push() method we push fetched data into csvRows[] array 
       **********************************************************************/
      csvRows.push(headers.join(","))

      // Loop to get value of each objects key
      for (const row of data) {
         const values = headers.map(header => {
            const val = row[header]
            return `"${val}"`
         })

         // To add, separator between each value
         csvRows.push(values.join(","))
      }

      /**********************************************************************
       * To add new line for each objects values and this return statement
       * array csvRows to this function.
       **********************************************************************/
      return csvRows.join("\n")
   }
   catch (err) {
      return undefined
   }
}

export function csvToArr(csv) {
   try {
      if (!csv) throw "empty csv file"

      // initialize rows array
      const rows = []

      // get csv column header names
      const lines = csv.split(/\r\n|\n/)
      const headers = lines[0].split(',')

      // get csv data rows
      for (const line of lines.slice(1)) {
         if (line == "") break
         const obj = {}

         // get row cells (values)
         const data = line.split(',')

         if (data.length != headers.length)
            throw "invalid .csv formatting: headers mismatch"

         data.forEach((val, index) => {
            const key = headers[index] // save key from headers
            val = val.replaceAll('"', '') // trim unnecessary '"' characters

            function parseVal(key, val) {
               switch (key) {
                  case "LastModified":
                     return new Date(val)

                  case "Oil":
                  case "Discarded":
                  case "HighPriority":
                     return stringToBoolean(val)

                  case "Quantity":
                  case "Status":
                     return parseInt(val)

                  default:
                     return val
               }
            }

            obj[key] = parseVal(key, val)
         })

         rows.push(new Task(obj))
      }

      return rows
   }
   catch (err) {
      console.warn(err)
      return undefined
   }
}

export function downloadFile(filename, content) {
   // It works on all HTML5 Ready browsers as it uses the download attribute 
   // of the <a> element:
   const element = document.createElement("a")
 
   // A blob is a data type that can store binary data
   // "type" is a MIME type
   // It can have a different value, based on a file you want to save
   const blob = new Blob([content], { type: "plain/text" })
 
   // createObjectURL() static method creates a DOMString containing a
   // URL representing the object given in the parameter.
   const fileUrl = URL.createObjectURL(blob)
 
   // setAttribute() Sets the value of an attribute on the specified element.
   element.setAttribute("href", fileUrl) //file location
   element.setAttribute("download", filename) // file name
   element.style.display = "none"
 
   // use appendChild() method to move an element from one element to another
   document.body.appendChild(element)
   element.click()
 
   // The removeChild() method of the Node interface removes a child node
   // from the DOM and returns the removed node
   document.body.removeChild(element)
}

export function objToArray(obj={}) {
   try {
      return Object.keys(obj).map(key => new Task({...obj[key]}))
   }
   catch (err) {
      console.warn(err)
      return []
   }
}

export function range({start, end}) {
   if (!start) start = 0
   return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

export function stringToBoolean(stringValue) {
   switch(stringValue?.toLowerCase()?.trim()){
      case "true": 
      case "yes": 
      case "1": 
      return true;

      case "false": 
      case "no": 
      case "0": 
      case null: 
      case undefined:
      return false;

      default: 
      return JSON.parse(stringValue);
   }
}

export function isEmptyArray(arr) {
   try {
      return arr.length == 0
   }
   catch (err) {
      console.warn(err)
      return false
   }
}

export function setCSSProperty(element, property, newValue) {
   try {
      element.style.setProperty(property, newValue);
   }
   catch (err) {
      console.warn(err)
   }
}

export function statusMapNumberToName(number) {
   switch (number) {
      case 0: return "Stamp"
      case 1: return "Spray"
      case 2: return "Check"
      case 3: return "Oil"
      case 4: return "Bag"
      case 5: return "CompletedParts"
      case 6: return "DiscardedParts"
      default: return "Unknown"
   }
}

export function statusMapNameToNumber(name) {
   switch (name) {
      case "Stamp": return 0
      case "Spray": return 1
      case "Check": return 2
      case "Oil": return 3
      case "Bag": return 4
      case "CompletedParts": return 5
      case "DiscardedParts": return 6
      default: return -1
   }
}

export const setSortedByCallback = ({ sortedBy, setSortedBy }, by="") => {
   const getSortedBy = (sortedBy, by) => {
      if (sortedBy == `${by}-Ascending`)
         return `${by}-Descending`
      else if (sortedBy == `${by}-Descending`)
         return ''
      else
         return `${by}-Ascending`
   }

   setSortedBy(getSortedBy(sortedBy, by))
}

export const sortTasksBy = ({ tasks, setTasks }, by) => {
   try {

      // skip if nothing to sort (fixes some bugs)
      if (!objToArray(tasks).length) return

      // default: "id-Ascending"
      by = by == '' ? "id-Ascending" : by

      const sortFunction = {
         "id-Ascending":               sortFunctions.id.ascending,
         "id-Descending":              sortFunctions.id.descending,
         "Title-Ascending":            sortFunctions.Title.ascending,
         "Title-Descending":           sortFunctions.Title.descending,
         "Quantity-Ascending":         sortFunctions.Quantity.ascending,
         "Quantity-Descending":        sortFunctions.Quantity.descending,
         "Oil-Ascending":              sortFunctions.Oil.ascending,
         "Oil-Descending":             sortFunctions.Oil.descending,
         "HighPriority-Ascending":     sortFunctions.HighPriority.ascending,
         "HighPriority-Descending":    sortFunctions.HighPriority.descending,
         "Status-Ascending":           sortFunctions.Status.ascending,
         "Status-Descending":          sortFunctions.Status.descending,
         "Discarded-Ascending":        sortFunctions.Discarded.ascending,
         "Discarded-Descending":       sortFunctions.Discarded.descending,
         "LastModified-Ascending":     sortFunctions.LastModified.ascending,
         "LastModified-Descending":    sortFunctions.LastModified.descending,
      }[by]

      setTasks([... // spread operator is necessary to trigger re-render
         (Array.isArray(tasks) ? tasks : objToArray(tasks)).sort(sortFunction)
      ])
   }
   catch (err) {
      toast(<h5>{err}</h5>)
   }
}

export const sortFunctions = {
   id: {
      ascending:  (a, b) => alphaNumericSort(a, b, "id"),
      descending: (b, a) => alphaNumericSort(a, b, "id"),
   },
   Title: {
      ascending:  (a, b) => alphaSort(a, b, "Title"),
      descending: (b, a) => alphaSort(a, b, "Title"),
   },
   Quantity: {
      ascending:  (a, b) => numericSort(a, b, "Quantity"),
      descending: (b, a) => numericSort(a, b, "Quantity"),
   },
   Oil: {
      ascending:  (a, b) => booleanSort(a, b, "Oil"),
      descending: (b, a) => booleanSort(a, b, "Oil"),
   },
   HighPriority: {
      ascending:  (a, b) => booleanSort(a, b, "HighPriority"),
      descending: (b, a) => booleanSort(a, b, "HighPriority"),
   },
   Status: {
      ascending:  (a, b) => numericSort(a, b, "Status"),
      descending: (b, a) => numericSort(a, b, "Status"),
   },
   Discarded: {
      ascending:  (a, b) => booleanSort(a, b, "Discarded"),
      descending: (b, a) => booleanSort(a, b, "Discarded"),
   },
   LastModified: {
      ascending:  (a, b) => timeSort(a, b, "LastModified"),
      descending: (b, a) => timeSort(a, b, "LastModified"),
   },
}

export const filterFunctions = {
   stampStatus: row => row.Status == 0,
   sprayStatus: row => row.Status == 1,
   checkStatus: row => row.Status == 2,
   oilStatus: row => row.Status == 3,
   bagStatus: row => row.Status == 4,
   completedPartsStatus: row => row.Status == 5,
   discardedPartsStatus: row => (row.Discarded || row.Status == 6),
   notDiscardedPartsStatus: row => !(row.Discarded || row.Status == 6),
   unfiltered: row => row,
}

export const numericSort = (a, b, key) => a[key] - b[key]
export const booleanSort = numericSort
export const timeSort = numericSort
export const alphaNumericSort = (a, b, key) => a[key].localeCompare(b[key], "en", { numeric: true })
export const alphaSort = (a, b, key) => a[key].localeCompare(b[key], "en")

export const sum = (a, b) => a + b
