
function calculate(operator) {

    let num1 = Number(document.getElementById('n1').value);
    let num2 = Number(document.getElementById('n2').value);
    let result = document.getElementById('result');
    if (operator == '+') {
        result = num1 + num2;
    } else if (operator == '-') {
        result = num1 - num2;
    } else if (operator == '*') {
        result = num1 * num2;
    } else if (operator == '/') {
        result = num1 / num2;
    }
    document.getElementById('result').innerText = "Result: " + result;

}