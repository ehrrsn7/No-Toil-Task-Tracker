import React from "react"
import * as firebaseui from "firebaseui"
import {
   createUserWithEmailAndPassword,
   GoogleAuthProvider, signInWithPopup,
   onAuthStateChanged, getAdditionalUserInfo
} from "firebase/auth"
import GoogleOneTapLogin from "react-google-one-tap-login"
import { app as firebase, auth } from "."
import "firebaseui/dist/firebaseui.css"

export function FirebaseAuthPage() {
   return <div>
      firebase auth page
   </div>
}

export function FirebaseLoginButton() {
   return <button style={{fontSize: ".5em"}} onClick={signIn}>
      log in
      {/* - uses firebase, supporting login via:<br />
      -- Interaction with Identity Providers such as Google and Facebook
      -- Phone number based authentication<br />
      -- e-mail based authentication<br />
      - one-tap sign-up/prevents duplicate sign-up<br /> */}
   </button>
}
export function FirebaseSignUpButton() {
   return <button style={{fontSize: ".5em"}}>
      sign up
      {/* - uses firebase, supporting login via:<br />
      -- Interaction with Identity Providers such as Google and Facebook
      -- Phone number based authentication<br />
      -- e-mail based authentication<br />
      - one-tap sign-up/prevents duplicate sign-up<br /> */}
   </button>
}

export function OneTapLogin() {
   // return <div>hi</div>
   return  <GoogleOneTapLogin 
   onSuccess={(response) => console.success(response)}
   googleAccountConfigs={{
      client_id: "179906068066-6t04qk9nq1e28asb3gpi18pngaa70ug0.apps.googleusercontent.com" // Your google client id here !!!
   }}
   onError={error => console.error(error)}
   />

}

onAuthStateChanged(auth, user => {
   if (user) {
      const uid = user.uid
      console.log(
         "User is signed in, see docs for a list of available properties",
         "https://firebase.google.com/docs/reference/js/auth.user",
         {uid}
      )
      // ...
   } else {
      console.log("User is signed out")
      // ...
   }
})

export function createNewUser(email, password) {
   createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
         const user = userCredential.user
         console.log("Signed in", {user})
         // ...
      })
      .catch((error) => {
         const errorCode = error.code
         const errorMessage = error.message
         console.warn({errorCode, errorMessage})
         // ..
      })
}

export function signIn() {
   // const id_token = googleUser.getAuthResponse().id_token
   // const credential = GoogleAuthProvider.credential(id_token);

   const provider = new GoogleAuthProvider()
   signInWithPopup(auth, provider)
      .then((result) => {
         const credential = GoogleAuthProvider.credentialFromResult(result)
         const token = credential.accessToken
         console.log("This gives you a Google Access Token. You can use it to access the Google API.", {token})

         const user = result.user
         console.log("The signed-in user info.", {user})

         console.log("IdP data available using getAdditionalUserInfo(result)", {IdPData: getAdditionalUserInfo(result)})
         // ...
      }).catch((error) => {
         const errorCode = error.code
         const errorMessage = error.message
         console.warn("Handle errors here.", {errorCode, errorMessage})

         const email = error.customData.email
         console.warn("the email of the user's account used", {email})

         const credential = GoogleAuthProvider.credentialFromError(error)
         console.warn("The AuthCredential type that was used.", {credential})
         // ...
      })
}

export function authorizeFirebaseUI(firebase) {
   console.log({firebaseUIAuthContainer: document.querySelector("#firebaseui-auth-container")})
   if (!document.querySelector("#firebaseui-auth-container"))
      throw "missing #firebaseui-auth-container"

      // Initialize the FirebaseUI Widget using Firebase.
   const ui = new firebaseui.auth.AuthUI(auth)

   const urls = {
      success: "",
      // tosUrl and privacyPolicyUrl accept either url string or a callback function
      privacyPolicy: "<your-privacy-policy-url>",
      termsOfService: "<your-tos-url>",
   }

   // The start method will wait until the DOM is loaded.
   ui.start("#firebaseui-auth-container", {
      signInSuccessUrl: urls.success,
      signInOptions: [
         // Leave the lines as is for the providers you want to offer your users.
         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
         // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
         // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
         // firebase.auth.GithubAuthProvider.PROVIDER_ID,
         // firebase.auth.EmailAuthProvider.PROVIDER_ID,
         // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
         // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      tosUrl: urls.termsOfService,
      privacyPolicyUrl: () => {
         window.location.assign(urls.privacyPolicy)
      }
   })

   console.success("authorized firebase ui")
}

export const FirebaseUIContext = React.createContext()

export function FirebaseUIContextProvider({ children }) {
   const [ state, setState ] = React.useState({})
   const [ firebaseUI, setFirebaseUI ] = React.useState()

   // React.useEffect(function() {
   //    const newFirebaseUI = authorizeFirebaseUI(firebase)
   //    setFirebaseUI(newFirebaseUI)
   // }, [ firebase ])

   const value = {
      state, setState,
      firebaseUI, setFirebaseUI
   }
 
   return <FirebaseUIContext.Provider value={value}>
      {children}
   </FirebaseUIContext.Provider>
}
