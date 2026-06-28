// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    get,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

// Firebase Config
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

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");

let selectedId = null;

// SAVE DATA
saveBtn.addEventListener("click", () => {

    const id = Date.now();

    set(ref(db, "contacts/" + id), {
        name: nameInput.value,
        email: emailInput.value
    })
        .then(() => {
            alert("Data Saved");
            clearInputs();
            loadData();
        })
        .catch(error => {
            alert(error);
        });
});

// LOAD DATA
function loadData() {

    get(ref(db, "contacts"))
        .then((snapshot) => {

            const list = document.getElementById("contactList");
            list.innerHTML = "";

            if (snapshot.exists()) {

                const data = snapshot.val();

                Object.keys(data).forEach(key => {

                    const item = data[key];

                    list.innerHTML += `
                    <div class="card">
                        <h4>${item.name}</h4>
                        <p>${item.email}</p>

                        <button onclick="editData('${key}','${item.name}','${item.email}')">
                            Edit
                        </button>

                        <button onclick="deleteData('${key}')">
                            Delete
                        </button>
                    </div>
                `;
                });
            }

        });
}

// EDIT DATA
window.editData = (id, name, email) => {

    selectedId = id;

    nameInput.value = name;
    emailInput.value = email;

    updateBtn.disabled = false;
};

// UPDATE DATA
updateBtn.addEventListener("click", () => {

    update(ref(db, "contacts/" + selectedId), {
        name: nameInput.value,
        email: emailInput.value
    })
        .then(() => {
            alert("Data Updated");

            clearInputs();
            updateBtn.disabled = true;
            selectedId = null;

            loadData();
        })
        .catch(error => {
            alert(error);
        });
});

// DELETE DATA
window.deleteData = (id) => {

    remove(ref(db, "contacts/" + id))
        .then(() => {
            alert("Data Deleted");
            loadData();
        })
        .catch(error => {
            alert(error);
        });
};

// CLEAR INPUTS
function clearInputs() {
    nameInput.value = "";
    emailInput.value = "";
}

// Initial Load
loadData();