import React from "react"

export class ErrorBoundary extends React.Component {
	constructor(props) {
	  super(props)
	  this.state = { hasError: false }
	}
 
	static getDerivedStateFromError(error) {
	  // Update state so the next render will show the fallback UI.
	  return { hasError: true, error }
	}
 
	render() {
		if (this.state.hasError)
			return this.props.fallback
 
	  return this.props.children 
	}
}