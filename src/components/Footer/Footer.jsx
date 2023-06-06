import { Link } from "react-router-dom"
import { useMedia } from "react-use"
import { Footer as FooterComponent } from "ehrrsn7-components"
import logoLight from "@assets/no-toil-logo-light.png"
import logoDark from "@assets/no-toil-logo-dark.png"
import "./Footer.css"

export function Footer({children, style}) {
   return <FooterComponent style={style}>
      {children}
   </FooterComponent>
}

export function NoToilLogo({ style }) {
   const dark = useMedia("(prefers-color-scheme: dark)")
   return <Link style={style}
   to="https://notoil.com/"
   target="_blank" rel="noreferrer">
      <img src={dark ? logoDark : logoLight} 
      height={35} alt="no toil logo" />
   </Link>
}

export default Footer
