// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDS2YJ96vMPmEJJMwD32JWMo0cmkKLcm_g",
    authDomain: "adhibhoo-ccfff.firebaseapp.com",
    databaseURL: "https://adhibhoo-ccfff-default-rtdb.firebaseio.com",
    projectId: "adhibhoo-ccfff",
    storageBucket: "adhibhoo-ccfff.firebasestorage.app",
    messagingSenderId: "756446093223",
    appId: "1:756446093223:web:6b9e1b7f8dc589c6786082",
    measurementId: "G-TRE1E393EL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase database initialized:", db);


function readUser() {
    const userRef = ref(db, "users");

    get(userRef)
        .then((snapshot) => {
            if (!snapshot.exists()) {
                console.log("No users found");
                return;
            }

            snapshot.forEach((childSnapshot) => {
                console.log(childSnapshot.key, childSnapshot.val());
            });
        })
        .catch((error) => {
            console.error("Error reading users:", error);
        });
}


function updateUserData(userId, updatedData) {
    const userRef = ref(db, "users/" + userId);

    update(userRef, updatedData)
        .then(() => {
            console.log("User updated successfully");
        })
        .catch((error) => {
            console.error("Error updating user:", error);
        });
}

document.getElementById("readUsersBtn").addEventListener("click", readUser);

document.getElementById("updateUserBtn").addEventListener("click", () => {
    updateUserData(1, {
        firstname: "ADHIBHOO",
        lastname: "PANDEY",
        email: "PANDEYADHIBHOO@gmail.com"
    });
});
