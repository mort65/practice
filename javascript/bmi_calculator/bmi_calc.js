var isImperial = true;
var resultColor = "green";
var BMI = 0;
var translateLine = 0;
var resultText ="";

function setUnits(units) {
    var heightText = document.getElementById("heightLabel");
    var weightText = document.getElementById("weightLabel");
    if (units == "imperial") {
        isImperial = true;
        weightText.innerHTML ="Weight (lb)";
        heightText.innerHTML ="Height (in)";
    }
    else {
        isImperial = false;
        weightText.innerHTML ="Weight (kg)";
        heightText.innerHTML ="Height (cm)";
    }
}

function isNumber(val) {
    return (val >= 0 || val < 0);
}

function calcBMI(h,w) {
    if (isImperial)
    {
        var height = Number(h) * 0.0254;
        var weight = Number(w) * 0.453592;    
    }
    else {
        var height = Number(h) / 100;
        var weight = Number(w); 
    }
    result = (weight / (height * height)).toFixed(2);
    if (isNumber(result)) {
        if (result > 35)
        {
            resultColor = "rgb(216,0,0)";
            resultText = "Severely obese";
        }
        else if (result > 30)
        {
            resultColor = "rgb(206,101,41)";
            resultText = "Moderately obese";
        }
        else if (result > 25)
        {
            resultColor = "rgb(168,157,5)";
            resultText = "Overweight";
        }
        else if (result > 18.5)
        {
            resultColor = "rgb(82,168,45)";
            resultText = "Healthy weight";
        }
        else if (result > 16)
        {
            resultColor = "rgb(42,71,150)";
            resultText = "Underweight";
        }
        else
        {
            resultColor = "rgb(91,115,122)";
            resultText = "Severely underweight";
        }
    }
    return result;
}

window.onload = function() {
    var unitsCheckBox = document.getElementsByName("unit");
    for (var i = 0; i < unitsCheckBox.length; i++) {
        if (unitsCheckBox[i].checked) {
            setUnits(unitsCheckBox[i].value);
            if (unitsCheckBox[i].value == "imperial")
            {
                isImperial = true;
            }
            else {
                isImperial = false;
            }
        }
        unitsCheckBox[i].addEventListener('change', function() {setUnits(this.value)});
    }
    var calcButton = document.getElementById("calcButton");
    calcButton.onclick = function() {
    var bmiDiv = document.getElementById("bmi");
    var heightInput = document.getElementById("height");
    var weightInput = document.getElementById("weight");
    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    BMI = calcBMI(heightInput.value,weightInput.value);
    var node1 = document.createTextNode(BMI);
    var node2 = document.createTextNode(resultText);
    var line = document.getElementById("line");
    if (isNumber(BMI)) {
        line.style.display = "block";
        translateLine = 0;
        if (BMI > 40 ) {
            translateLine = 600;
            }
        else if (BMI < 15) {
                translateLine = 3;
            }
        else {
            translateLine = ((BMI - 15) * 24);
            if (translateLine < 3) {
                translateLine = 3;
            }
        }
        line.style.transform = "translate(" + translateLine + "px)";
        line.style.webkitTransform = "translate(" + translateLine + "px)";
    }
    else {
        line.style.display = "none";
    }
    p1.style.marginTop="50px";
    p1.style.fontWeight="bold";
    p2.style.fontWeight="bold";
    p2.style.color = resultColor;
    p1.appendChild(node1);
    p2.appendChild(node2);
    bmiDiv.innerHTML = "";
    bmiDiv.appendChild(p1);
    bmiDiv.appendChild(p2);
    }
}