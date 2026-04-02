const nameValue = "Dharmveer Singh";
// nameValue = "Raj".   this cannot be changed error
let variableValue = "This can be changed";
variableValue = "Changed";
console.log(variableValue);
// to run first convert typescript to javasciprt tsc filenem.ts and then run -> node filenem.js
const b; // this you have to initialize and type declaration is needed
b = 21;
let a;
a = 20;
// VARIABLES 
let course = 'this is string ';
console.log(course);
let nameVal = "Rah singh";
let description = nameVal + 'is best ';
console.log(description);
// array 
let users = ["a", "b", "c"];
let users2 = ['a', 'b', '3']; // or (string | number )[]
let marks = ['a', '1', '3'];
console.log(users[1], users2[0], marks);
function sayHello() {
    console.log("askdlfn");
}
sayHello();
const sayhello2 = () => {
    console.log("this is also way of declaration of functions");
};
sayhello2();
const multiple = (a, b) => {
    return a * b;
};
console.log(multiple(3, 4));
export {};
