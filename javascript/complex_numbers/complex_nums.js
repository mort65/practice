
function complex(real,imag) {
    this.real = real;
    this.imag = imag;
    this.getValue = function() {return [this.real , this.imag];}
    this.toString = function() {
        if (this.real == 0) {
            return this.imag + "i";
            }
        else {   
            if (this.imag >= 0) {
                return "(" + this.real + "+" + this.imag + "i" + ")";
                }
            else {
                    return "(" + this.real + this.imag + "i" + ")";
                    }
                }
            }
        }

function complexMult(x,y) {
    var result = new complex((x.real * y.real) - (x.imag * y.imag),
    (x.imag * y.real) + (x.real * y.imag));
    return result;
    }
    
function isInArray(val,arr) {
    for ( index = 0; index < arr.length; index++ ) {
        if (arr[index] == val) {
            return true
            }
        }
    return false
    }

function isDigit(val) {
    return (val >= 0 || val < 0) 
}

window.onload = function() {
    var input = prompt("Please enter 2 complex numbers like 1,2,3,4");
    if (input != null) {
        var values = new Array();
        var digits = new Array("1", "2", "3", "4","5", "6", "7", "8", "9", "0", ".", "-");
        var j = 0;
        var i = 0;
        var c = "";
        while (i < input.length) {
            if (isInArray(input[i],digits)) {
                c = "";
                while ((i < input.length) && isInArray(input[i],digits)) {
                    c += input[i];
                    i += 1;
                    }
                if (isDigit(c)) {
                    values[j] = c;
                    j += 1;
                    }
                }
            else {
                i += 1;
                }
            }
        var question = document.getElementById("question");
        question.style.visibility = "hidden";
        if (values.length == 4) {
            var a = new complex(values[0],values[1]);
            var b = new complex(values[2],values[3]);
            var answer = complexMult(a,b);
            var text1 = answer.getValue();
            var text2 = a.toString() + " * " +
            b.toString() + " = " + answer.toString();
            var p1 = document.createElement("p");
            var p2 = document.createElement("p");
            var node1 = document.createTextNode(text1);
            var node2 = document.createTextNode(text2);
            p1.appendChild(node1);
            p2.appendChild(node2);
            var parent = document.getElementById("answer");
            parent.appendChild(p1);
            parent.appendChild(p2);
            p1.style.color = "lightgreen";
            p2.style.color = "lightblue";
        }
        else {
            var p1 = document.createElement("p");
            var node = document.createTextNode(
            "Please write 4 integers that are separeted by comma or space."
            );
            p1.appendChild(node);
            p1.style.color = "#ea1c72";
            var parent = document.getElementById("answer");
            parent.appendChild(p1);
            console.log(values.length+ " number(s) entered instead of 4:");
            console.log(values);
            }
        }
    }
