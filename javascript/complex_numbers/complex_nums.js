
function complex(real,imag) {
    this.real = Number(real);
    this.imag = Number(imag);
    this.getValue = function() {return [this.real , this.imag];}
    this.toString = function() {
        if (isNumber(this.real) && isNumber(this.imag)) {
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
        else {
            return NaN;
            }
        }
    }

function complexAdd(x,y) {
    var addResult = new complex(x.real + y.real,x.imag + y.imag);
    return addResult;
    }

function complexSub(x,y) {
    var subResult = new complex(x.real - y.real,x.imag - y.imag);
    return subResult;
    }

function complexMult(x,y) {
    var multResult = new complex((x.real * y.real) - (x.imag * y.imag),
    (x.imag * y.real) + (x.real * y.imag));
    return multResult;
    }
    
function complexDiv(x,y) {
    var divResult = new complex(((x.real * y.real) + (x.imag * y.imag)) / 
    ((y.real * y.real) + (y.imag * y.imag)),((x.imag * y.real) - (x.real * y.imag)) / 
    ((y.real * y.real) + (y.imag * y.imag)));
    return divResult;
    }
    
function isInArray(val,arr) {
	return (arr.indexOf(val) > -1)
    }

function isNumber(val) {
    return (val >= 0 || val < 0) 
}

window.onload = function() {
    var input = prompt("Please enter 2 complex numbers like a b c d");
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
                if (isNumber(c)) {
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
            var answer1 = complexAdd(a,b);
            var answer2 = complexSub(a,b);
            var answer3 = complexMult(a,b);
            var answer4 = complexDiv(a,b);
            var text1 = "(" + a.getValue() + ") + (" +
            b.getValue() + ") = (" + answer1.getValue() + ")";
            var text2 = a + " + " +
            b + " = " + answer1;
            var text3 = "(" + a.getValue() + ") - (" +
            b.getValue() + ") = (" + answer2.getValue() + ")";
            var text4 = a + " - " +
            b + " = " + answer2;
            var text5 = "(" + a.getValue() + ") * (" +
            b.getValue() + ") = (" + answer3.getValue() + ")";
            var text6 = a + " * " +
            b + " = " + answer3;
            var text7 = "(" + a.getValue() + ") / (" +
            b.getValue() + ") = (" + answer4.getValue() + ")";
            var text8 = a + " / " +
            b + " = " + answer4;
            var p1 = document.createElement("p");
            var p2 = document.createElement("p");
            var p3 = document.createElement("p");
            var p4 = document.createElement("p");
            var p5 = document.createElement("p");
            var p6 = document.createElement("p");
            var p7 = document.createElement("p");
            var p8 = document.createElement("p");
            var node1 = document.createTextNode(text1);
            var node2 = document.createTextNode(text2);
            var node3 = document.createTextNode(text3);
            var node4 = document.createTextNode(text4);
            var node5 = document.createTextNode(text5);
            var node6 = document.createTextNode(text6);
            var node7 = document.createTextNode(text7);
            var node8 = document.createTextNode(text8);
            p1.appendChild(node1);
            p2.appendChild(node2);
            p3.appendChild(node3);
            p4.appendChild(node4);
            p5.appendChild(node5);
            p6.appendChild(node6);
            p7.appendChild(node7);
            p8.appendChild(node8);
            var parent = document.getElementById("answer");
            parent.appendChild(p1);
            parent.appendChild(p2);
            parent.appendChild(p3);
            parent.appendChild(p4);
            parent.appendChild(p5);
            parent.appendChild(p6);
            parent.appendChild(p7);
            parent.appendChild(p8);
            p1.style.color = "lightblue";
            p2.style.color = "lightblue";
            p3.style.color = "lightgreen";
            p4.style.color = "lightgreen";
            p5.style.color = "cyan";
            p6.style.color = "cyan";
            p7.style.color = "pink";
            p8.style.color = "pink";
        }
        else {
            var p1 = document.createElement("p");
            var node = document.createTextNode(
            "Please write 4 numbers that are separeted by comma or space."
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
