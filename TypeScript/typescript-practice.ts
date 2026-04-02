const nameValue: string = "Dharmveer Singh";
// nameValue = "Raj".   this cannot be changed error


let variableValue: string = "This can be changed"
variableValue = "Changed"
console.log(variableValue)


// to run first convert typescript to javasciprt tsc filenem.ts and then run -> node filenem.js

const b: number // this you have to initialize and type declaration is needed
b = 21

let a
a = 20


// VARIABLES 
let course: string = 'this is string '
console.log(course)

let nameVal: string = "Rah singh"
let description: string = nameVal + 'is best '
console.log(description)


// array 
let users: string[] = ["a", "b", "c"]
let users2: Array<string | number> = ['a', 'b', '3']    // or (string | number )[]
let marks: any[] = ['a', '1', '3']
console.log(users[1], users2[0], marks)



function sayHello() : void{
    console.log("askdlfn")
}


sayHello()

const sayhello2 = () : void => {
    console.log("this is also way of declaration of functions")
}

sayhello2();


const multiple = (a: number, b: number): number=>{
    return a*b; 
}
console.log(multiple(3, 4));

const mul2 = (a: number, b:number): number => a*b;


function createUser(name: string, age: string) : {name: string, age: string} {
    return { 
        name, 
        age
    };
}

const createUser2 = (name: string, age: string): {name: string, age: string}=>{
    return {name, age};
}

 



































export {};
