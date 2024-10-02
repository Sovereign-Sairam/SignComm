// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBUwgD1kdv90WC6070TDH11o76LUyQFUCE",
    authDomain: "authentication-app-e2f1a.firebaseapp.com",
    databaseURL: "https://authentication-app-e2f1a-default-rtdb.firebaseio.com",
    projectId: "authentication-app-e2f1a",
    storageBucket: "authentication-app-e2f1a.appspot.com",
    messagingSenderId: "968225166144",
    appId: "1:968225166144:web:c84ea253f85deada8ea0a5",
    measurementId: "G-TQWMQ2DE5R"
};

// Initialize Firebase
const loginForm = document.querySelector('#login-form');
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const user = auth.currentUser;
const statusBox = document.querySelector(".login-status");
const signInWithGoogle = document.querySelector('#signInWithGoogle')
const signInWithFacebook = document.querySelector('#signInWithFacebook');

const setDB = async (user, username, email) => {
    await set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email,
    });
}

// signInWithGoogle.addEventListener('click', (e) => {
//     e.preventDefault();
//     signInWithPopup(auth, new GoogleAuthProvider())
//         .then((result) => {
//             // This gives you a Google Access Token. You can use it to access the Google API.
//             const credential = GoogleAuthProvider.credentialFromResult(result);
//             const token = credential.accessToken;
//             // The signed-in user info.
//             const user = result.user;
//             // IdP data available using getAdditionalUserInfo(result)
//             // ...
//             setDB(user, user.email, user.displayName);
//             alert(user.displayName + "signed in successfuly")
//         }).catch((error) => {
//             // Handle Errors here.
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // The email of the user's account used.
//             const email = error.customData.email;
//             // The AuthCredential type that was used.
//             const credential = GoogleAuthProvider.credentialFromError(error);
//             alert(error)
//             // ...
//         });
// });
signInWithGoogle.addEventListener('click', (e) => {
    e.preventDefault();
    signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            statusBox.classList.add("login-success");
            statusBox.classList.remove("login-failed");
            setDB(user, user.email, user.displayName);
            alert(user.displayName + " signed in successfuly")
            statusBox.innerHTML = `<p>Congratulations You have successfully registered!</p>`
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            statusBox.classList.remove("login-success");
            statusBox.classList.add("login-failed");
            let errorThatIwannaShow = '';
            if (error.code === "auth/popup-closed-by-user") {
                errorThatIwannaShow = 'Authentication cancelled. Please try again.';
            } 
            else  if (error.code === "auth/email-already-in-use") {
                errorThatIwannaShow = 'The email address you provided is already registered';
            } 
            else{
                errorThatIwannaShow = 'An error occurred during authentication '
            }
            statusBox.innerHTML = `<p>Not able to login: ${errorThatIwannaShow || error}</p>`
            // ...
        });
});

signInWithFacebook.addEventListener('click', (e) => {
    e.preventDefault();
    signInWithPopup(auth, new FacebookAuthProvider())
        .then((result) => {
            // The signed-in user info.
            const user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            statusBox.classList.add("login-success");
            statusBox.classList.remove("login-failed");
            // IdP data available using getAdditionalUserInfo(result)
            setDB(user, user.email, user.displayName);
            alert(user.displayName + " signed in successfuly")
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);
            console.log(error)
            // ...
        });
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        //     // Signed in 
        //     const user = userCredential.user;

        //     const dt = new Date();
        //     update(ref(database, 'users/' + user.uid), {
        //         last_login: dt.getUTCDate(),
        //     });
        //     statusBox.classList.remove("login-failed");
        //     statusBox.classList.add("login-success");
        //     statusBox.innerHTML = `<p>Logged in as: ${user.email}</p>`
        //     // location.href='/vhuggvyg.html'
        //     // ...
        // })
        const user = userCredential.user;

        const dt = new Date();
        update(ref(database, 'users/' + user.uid), {
          last_login: dt.getUTCDate(),
        });
        const username = email.split('@')[0]; // Extract username from email
        statusBox.classList.remove("login-failed");
        statusBox.classList.add("login-success");
        statusBox.innerHTML = `<p>Logged in as: ${username}</p>`; // Display username
        // location.href='/vhuggvyg.html'
        // ...
      })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            statusBox.classList.remove("login-success");
            statusBox.classList.add("login-failed");
            let errorThatIwannaShow = '';
            if (error.code === "auth/user-not-found") {
                errorThatIwannaShow = 'User Not Found!!';
            } else if (error.code === 'auth/wrong-password') {
                errorThatIwannaShow = 'Incorrect Password';
            } else if (error.code === "auth/invalid-email") {
                errorThatIwannaShow = 'Invalid Email';
            }
            statusBox.innerHTML = `<p>Not able to login: ${errorThatIwannaShow || error}</p>`
        });

});




onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        // location.href = "somepage.html"
    } else {

    }
});