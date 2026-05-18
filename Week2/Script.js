let balance = 10000;
let pin = "1234";

function checkBalance() {
    document.getElementById("result").innerHTML =
        "Current Balance: Rs. " + balance;
}

function withdrawMoney() {

    let amount = parseInt(prompt("Enter amount to withdraw:"));

    if (amount <= 0) {
        alert("Invalid amount!");
    }
    else if (amount > balance) {
        alert("Insufficient Balance!");
    }
    else {
        balance = balance - amount;

        alert("Withdrawal Successful!");

        document.getElementById("result").innerHTML =
            "Remaining Balance: Rs. " + balance;
    }
}

function depositMoney() {

    let enteredPin = prompt("Enter PIN:");

    if (enteredPin === pin) {

        let amount = parseInt(prompt("Enter amount to deposit:"));

        if (amount <= 0) {
            alert("Invalid amount!");
        }
        else {

            balance = balance + amount;

            alert("Deposit Successful!");

            document.getElementById("result").innerHTML =
                "Updated Balance: Rs. " + balance;
        }

    } else {
        alert("Incorrect PIN!");
    }
}