// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js"


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
const db = getDatabase(app)

console.log(db)

// Function to write user data to Firebase Realtime Database
// Function to write user data with unique ID
function writeUserData(userId, name, email, address, number, field, year, gender, nickname, dob) {
  // Create a reference to 'users' collection
  const usersRef = ref(db, 'users/' + userId);

  // push() generates a unique key for the new child
  //const newUserRef = push(usersRef);

  // set() stores the data at that unique location
  set(usersRef, {
    name: name,
    email: email,
    address: address,
    number: number,
    field: field,
    year: year,
    gender: gender,
    nickname: nickname,
    dob: dob
  })
    .then(() => {
      console.log("User added successfully with ID:", userId);
    })
    .catch((error) => {
      console.error("Error adding user:", error);
    });
}

// Expose the function to the global scope so it can be accessed from HTML (e.g., via button click)
window.writeUserData = writeUserData;


// ref(db, 'users') points to the users path.
// get(userRef) gets the data at that path.
// snapshot.forEach(...) loops over each child node (each user).
// childsnapshot.val() gives the actual data (name and email), which is printed.
function readUser() {
  const userRef = ref(db, 'users')
  get(userRef).then((snapshot) => {
    snapshot.forEach((childsnapshot) => {
      console.log(childsnapshot.val());
    })
  })
}
//readUser()
window.readUser = readUser;


// Read a single user by ID and show the result on the page.
function readUserById(userId) {
  const userRef = ref(db, 'users/' + userId);
  get(userRef).then((snapshot) => {
    const user = snapshot.val();
    console.log("User found:", user);
    document.getElementById('read-result').textContent =
      "Name: " + user.name + " | " + "Email: " + user.email;
  });
}
window.readUserById = readUserById;



// Fetch an existing user by ID and load their data into the update input fields,
// so the values can be edited and then saved with updateUserData().
function fetchUserForUpdate(userId) {
  const userRef = ref(db, 'users/' + userId);
  get(userRef).then((snapshot) => {
    const user = snapshot.val();
    document.getElementById('update-name').value = user.name;
    document.getElementById('update-email').value = user.email;
    document.getElementById('update-number').value = user.number;
    document.getElementById('update-address').value = user.address;
    document.getElementById('update-field').value = user.field;
    document.getElementById('update-year').value = user.year;
    document.getElementById('update-gender').value = user.gender;
    document.getElementById('update-nickname').value = user.nickname;
    document.getElementById('update-dob').value = user.dob;
    console.log("Loaded user into form:", user);
  });
}
window.fetchUserForUpdate = fetchUserForUpdate;


function updateUserData(userId, updatedData) {
  const userRef = ref(db, 'users/' + userId);
  update(userRef, updatedData)
    .then(() => {
      console.log("User updated successfully");
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
}

// Example usage:
//updateUserData();
window.updateUserData = updateUserData;



function deleteUserData(userId) {
  const userRef = ref(db, 'users/' + userId);
  remove(userRef)
    .then(() => {
      console.log("User deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
}

// Example usage:
//deleteUserData(2);
window.deleteUserData = deleteUserData;