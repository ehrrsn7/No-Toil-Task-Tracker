import React from "react"
import ResponsivePagination from "react-responsive-pagination"
import { useInitializer, ErrorBoundary } from "ehrrsn7-components"
import { Context } from "@contexts"
import "react-responsive-pagination/themes/classic.css"
import "./Paginator.css"

export function Paginator(props) {
   // hooks
   const {
      paginated, setPaginated,
      paginationRange, setPaginationRange,
      paginationOffset, setPaginationOffset,
      currentPage, setCurrentPage, tasksLength,
   } = React.useContext(Context)

   // constants
   const rangeEnd = paginationOffset + paginationRange
   const showingEnd = rangeEnd > tasksLength ? tasksLength : rangeEnd
   const totalPages = Math.ceil(tasksLength / paginationRange)

   // handlers
   const handlePaginationOffset = () => {
      try {
         const newPaginationOffset = (currentPage - 1) * paginationRange
         setPaginationOffset(newPaginationOffset)
      }
      catch (err) {
         console.error(err)
      }
   }

   // events
   useInitializer(() => setPaginationRange(20))
   React.useEffect(handlePaginationOffset, [
      currentPage, setPaginationOffset, paginationRange
   ])

   // component
   return totalPages > 1 && <div className="Paginator">
      {  paginated && <ResponsivePagination
         props={props}
         id="TaskTablePaginate"
         current={currentPage}
         total={totalPages}
         onPageChange={setCurrentPage}
         previousLabel={"Previous"}
         nextLabel={"Next"}
      /> }

      { tasksLength > 0 && <>
         { paginated && <h5 style={{
            color: "GrayText", margin: "1em 0", letterSpacing: ".1em",
         }}>
            showing {paginationOffset + 1} to {showingEnd} of {tasksLength}
         </h5> }
         { paginated ?
            <button
            style={{padding: "0 1em", margin: 0}}
            onClick={() => setPaginated(false)}>
               See all
            </button> :
            <button
            style={{padding: "0 1em", margin: 0}}
            onClick={() => setPaginated(true)}>
               See less
            </button>
         }
         </>
      }
   </div>
}

export function SearchAndNavigateBar({ navigate, search }) {
   const { searchState, setSearchState } = React.useContext(Context)
   const { currentPage, setCurrentPage } = React.useContext(Context)
   const { paginated } = React.useContext(Context)
   const { paginationRange } = React.useContext(Context)
   const { tasksLength } = React.useContext(Context)
   const [ upperPageBound, setUpperPageBound ] = React.useState(1)

   const lowerPageBound = 1

   const buttonStyling = {
      padding: "2px 8px"
   }

   const isValidPage = newCurrentPage => {
      try {
         if (tasksLength <= 1)
            throw "no range to find"
         if (newCurrentPage < lowerPageBound || newCurrentPage > upperPageBound)
            throw "out of range"
         return true
      }
      catch {
         return false
      }
   }

   const updateUpperPageBound = () => {
      try {
         /************************************************************
          * The upper bound can change when filters are applied.
          * Handle the page being out of range.
          ************************************************************/
         if (paginationRange <= 1)
            throw `invalid pagination range: ${paginationRange}`
         const maxPage = Math.ceil(tasksLength / paginationRange)
         if (maxPage <= 0)
            throw `invalid new max page value: ${maxPage}`
         setUpperPageBound(maxPage)
      }
      catch {
         setUpperPageBound(1) // new range: {1 ... 1}
      }
   }

   const handleUpperPageBound = () => {
      if (currentPage > upperPageBound) setCurrentPage(upperPageBound)
   }

   React.useEffect(updateUpperPageBound, [
      tasksLength, paginationRange, setUpperPageBound
   ])
   React.useEffect(handleUpperPageBound, [
      upperPageBound, setUpperPageBound, currentPage, setCurrentPage
   ])

   return <ErrorBoundary
   fallback={<>Error loading SearchAndNavigateBar component.</>}>
      <span id="SearchAndNavigateBar" style={{
         maxWidth: "1000px",
         marginBottom: "1em"
      }}>
         { paginated ? (upperPageBound <= 1 && navigate? <div /> :
            <span style={{placeItems: "center"}}>
               <button style={{...buttonStyling}}
               disabled={!isValidPage(currentPage - 1)}
               onClick={() => setCurrentPage(currentPage - 1)}>
                  <h5>{"<"}</h5>
               </button>

               <h5 style={{minWidth: "25px", textAlign: "center"}}>{currentPage}</h5>

               <button style={{...buttonStyling}}
               disabled={!isValidPage(currentPage + 1)}
               onClick={() => setCurrentPage(currentPage + 1)}>
                  <h5>{">"}</h5>
               </button>
            </span>
         ) : <div />}

         { search && <input
            type="search"
            placeholder="search"
            value={searchState}
            onChange={event => setSearchState(event.target.value)}
         /> }
      </span>
   </ErrorBoundary>
}

export default Paginator
