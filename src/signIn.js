import { auth } from "./firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
const signInBttn = document.getElementById('signIn');

function signIn() {
    signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        
        localStorage.setItem("email", JSON.stringify(user.email));
        
        window.location = "index.html";
    }).catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error("Error signing in:", errorMessage);
        console.error("Error code:", errorCode);
        console.error("Email:", email);
    });
}

signInBttn.addEventListener("click", signIn);
