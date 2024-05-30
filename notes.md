## Intro:
- Decorators are used for meta-programming.
- Meta-programming? - Programming features not directly related to output/end-user, but helps other developers in writing code.
- In tsconfig.js - "experimentalDecorators": true, /* Enables experimental support for ES7 decorators. */
- A decorator at the end of the day is a function that is applied to something(for ex. a class) in a certain way.
- There are different packages and frameworks to use DECORATORs
## A First Class Decorator
- Decorators are all about classes, but this time, we'll add them to a class.
```ts
//A First Class Decorator
function Logger(constructor: Function){
    console.log(`Logging...`);
    console.log(constructor);  
}
//! Decorators run when our class is defined, not when class is instantiated.
@Logger

/* O/P =>
Logging...
app.ts:5 class Person {
    constructor() {
        this.name = 'Skyy';
        console.log(`Creating a person object...`);
    }
}
*/
class Person {
    name = 'Skyy';
    constructor(){
        console.log(`Creating a person object...`);
        
    }
}

const person1 = new Person();
console.log(person1); //Creating a person object... //Person {name: 'Skyy'}
```
## Decorator Factories
- We can define a decorator factory which returns a decorator fx() and allows us to configure it when we use it with something else.
```ts
function Logger(logStr: string){
    return function(constructor: Function){
        console.log(logStr);
        console.log(constructor);
    }   
}

/*
LOGGING - PERSON, decorator factories 
app.ts:4 class Person {
    constructor() {
        this.name = 'Skyy';
        console.log(`Creating a person object...`);
    }
}
*/

@Logger(`LOGGING - PERSON, decorator factories `) //custom log-string acc. to our wish

class Person {
    name = 'Skyy';
    constructor(){
        console.log(`Creating a person object...`);
        
    }
}

const person1 = new Person(); //Creating a person object...
console.log(person1); //Person {name: 'Skyy'}
```
## Building more useful DECORATORS
```ts
function WithTemplate(template: string, hookId: string){
    return function(constructor: any){
        const hookEl = document.getElementById(hookId);
        const p = new constructor();
        if(hookEl){
            hookEl.innerHTML = template;
            hookEl.querySelector('h1')!.textContent = p.name;
        }
    }
}
@WithTemplate('<h1>More Useful Decorators 👨🏻‍💻</h1>','app')

class Person {
    name = 'Skyy👦🏻';
    constructor(){
        console.log(`Creating a person object...`);
        
    }
}
//OP (on the browser, as a <H1>) -> Skyy👦🏻
```
```html
<body>
  <h2>Decorators in TS</h2>
  <h1></h1>
  <div id="app">
  </div> 
</body>
```
## Adding Multiple Decorators
- 🔴 IMP! Decprator fxs() are executed bottom-up⬇️! Not top to bottom✍🏻
- 🟡 IMP! The facttories are executed top-to-bottom⬆️! Like regular JS fxs()✍🏻
```ts
function WithTemplate(template: string, hookId: string){
    console.log(`WithTemplate factory..!🛠️`);
    
    return function(constructor: any){
        console.log(`Logging @WithTemplate decorator..`);
        
        const hookEl = document.getElementById(hookId);
        const p = new constructor();
        if(hookEl){
            hookEl.innerHTML = template;
            hookEl.querySelector('h1')!.textContent = p.name;
        }
    }
}

function Logger(logStr: string){
    console.log(`Logger factory..!🛠️`);
    
    return function(constructor: Function){
        console.log(logStr);
        console.log(constructor);
    }   
}
@WithTemplate('<h1>More Useful Decorators 👨🏻‍💻</h1>','app')
@Logger(`Logging @Logger decorator..`)

class Person {
    name = 'Skyy👦🏻';
    constructor(){
        console.log(`Creating a person object/ attaching a decorator...`);
        
    }
}

/*
O/P => 💻
WithTemplate factory..!🛠️
app.ts:17 Logger factory..!🛠️
app.ts:20 Logging @Logger decorator..
app.ts:21 class Person {
    constructor() {
        this.name = 'Skyy👦🏻';
        console.log(`Creating a person object/ attaching a decorator...`);
    }
}
app.ts:5 Logging @WithTemplate decorator..
app.ts:30 Creating a person object/ attaching a decorator...
*/
```
## PropertyName..?
In TypeScript, a `PropertyDescriptor` is an object that describes the attributes of a property on an object. It is used primarily in the context of object property manipulation, especially with methods like `Object.defineProperty` and `Object.getOwnPropertyDescriptor`.

### Attributes of a PropertyDescriptor
A `PropertyDescriptor` can have several attributes, but they are generally divided into two categories:

1. **Data Descriptor**
   - **value**: The value associated with the property.
   - **writable**: A boolean indicating if the property value can be changed.
   
2. **Accessor Descriptor**
   - **get**: A function that serves as a getter for the property, or `undefined` if there is no getter.
   - **set**: A function that serves as a setter for the property, or `undefined` if there is no setter.
   
Additionally, both types of descriptors can have the following attributes:
   - **configurable**: A boolean indicating if the type of this property descriptor can be changed and if the property can be deleted from the object.
   - **enumerable**: A boolean indicating if the property shows up during enumeration of the properties on the corresponding object.

### Usage

#### Example: Defining a Property
Here’s an example of how we can use `Object.defineProperty` with a `PropertyDescriptor`:
```typescript
const person = {};

Object.defineProperty(person, 'name', {
    value: 'Alice',
    writable: true,
    enumerable: true,
    configurable: true
});

console.log(person.name); // Alice

person.name = 'Bob';
console.log(person.name); // Bob
```

#### Example: Using Accessor Descriptors
We can also use a `PropertyDescriptor` to define getter and setter functions:
```typescript
const person = {};
let ageValue = 30;

Object.defineProperty(person, 'age', {
    get() {
        return ageValue;
    },
    set(newValue) {
        if (newValue >= 0) {
            ageValue = newValue;
        } else {
            console.error('Age must be a non-negative number');
        }
    },
    enumerable: true,
    configurable: true
});

console.log(person.age); // 30

person.age = 35;
console.log(person.age); // 35

person.age = -5; // Age must be a non-negative number
console.log(person.age); // 35
```
### PropertyDescriptor in TypeScript

TypeScript provides type definitions for `PropertyDescriptor`:

- **`PropertyDescriptor`**: A general descriptor that can describe either a data or an accessor property.
- **`TypedPropertyDescriptor<T>`**: A generic version that specifies the type of the property value.

#### Example: Typed Property Descriptor

```typescript
function logProperty(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        console.log(`Calling ${propertyKey} with arguments`, args);
        const result = originalMethod.apply(this, args);
        console.log(`${propertyKey} returned`, result);
        return result;
    };

    return descriptor;
}

class Calculator {
    @logProperty
    add(a: number, b: number) {
        return a + b;
    }
}

const calculator = new Calculator();
calculator.add(2, 3); // Logs: Calling add with arguments [2, 3] and add returned 5
```
### Summary

- **`PropertyDescriptor`** is an object describing attributes of a property.
- It is used with `Object.defineProperty` and `Object.getOwnPropertyDescriptor`.
- It can describe data properties (with `value` and `writable`) or accessor properties (with `get` and `set`).
- Attributes like `configurable` and `enumerable` are common to both.
- TypeScript provides type definitions to help enforce correct usage of property descriptors, such as `PropertyDescriptor` and `TypedPropertyDescriptor<T>`.
## Diving into property decorators
- We can also use decorators on other stuff apart from classes (ex- properties)
```ts
function Log(target:any, propertyName: string | Symbol){
    console.log(`Property Decorator - factory!`);
    console.log(target, propertyName);   
}

class Product{
    @Log
    title: string;
    private _price: number;

    setPrice(val:number){
        if(val>0){
            this._price = val;
        }else {
            throw new Error('Invalid price - should be positive!');
        }
        
    }

    constructor(t:string,p:number){
        this.title = t;
        this._price = p;
    }
    getPriceWithTax(tax:number){
        return this._price * (1+tax);
    }
}

//O/P -
/*
> Property Decorator - factory!
> {setPrice: ƒ, getPriceWithTax: ƒ}constructor: class ProductgetPriceWithTax: ƒ getPriceWithTax(tax)setPrice: ƒ setPrice(val)[[Prototype]]: Object 'title'
*/
```
## Accessor & Parameter decorators
```ts
function Log(target:any, propertyName: string | Symbol){
    console.log(`Property Decorator - factory!`);
    console.log(target, propertyName);   
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor){
    console.log(`Accessor decorator..`);
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor){
    console.log(`Method decorator..`);
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number){
    console.log(`Parameter decorator..`);
    console.log(target);
    console.log(name);
    console.log(position);
}

class Product{
    @Log
    title: string;
    private _price: number;

    @Log2
    setPrice(val:number){
        if(val>0){
            this._price = val;
        }else {
            throw new Error('Invalid price - should be positive!');
        }
        
    }

    constructor(t:string,p:number){
        this.title = t;
        this._price = p;
    }
    @Log3
    getPriceWithTax(@Log4 tax:number){
        return this._price * (1+tax);
    }
}

/*
Total O/P =>
WithTemplate factory..!🛠️
app.ts:17 Logger factory..!🛠️
app.ts:20 Logging @Logger decorator..
app.ts:21 class Person {
    constructor() {
        this.name = 'Skyy👦🏻';
        console.log(`Creating a person object/ attaching a decorator...`);
    }
}
app.ts:5 Logging @WithTemplate decorator..
app.ts:30 Creating a person object/ attaching a decorator...
app.ts:37 Property Decorator - factory!
app.ts:38 {setPrice: ƒ, getPriceWithTax: ƒ} 'title'
app.ts:42 Accessor decorator..
app.ts:43 {setPrice: ƒ, getPriceWithTax: ƒ}
app.ts:44 setPrice
app.ts:45 {writable: true, enumerable: false, configurable: true, value: ƒ}
app.ts:56 Parameter decorator..
app.ts:57 {setPrice: ƒ, getPriceWithTax: ƒ}constructor: class ProductgetPriceWithTax: ƒ getPriceWithTax(tax)setPrice: ƒ setPrice(val)[[Prototype]]: Object
app.ts:58 getPriceWithTax
app.ts:59 0
app.ts:49 Method decorator..
app.ts:50 {setPrice: ƒ, getPriceWithTax: ƒ}
app.ts:51 getPriceWithTax
app.ts:52 {writable: true, enumerable: false, configurable: true, value: ƒ}
*/
```
## Returning (and changing) in a Class Decorator
- Here, the decorator executes ONLY WHEN when class is instantiated, not when it's defined.
```ts
function WithTemplate(template: string, hookId: string){
    console.log(`WithTemplate factory..!🛠️`); 
    return function<T extends {new (...args:any[]):{name:string}}>(originalConstructor: T){
        console.log(`Logging @WithTemplate decorator..`);
        //! Returning (and changing) in a Class Decorator
        return class extends originalConstructor {
            constructor(..._:any[]){
            super();
            console.log(`Rendering template..`);
            const hookEl = document.getElementById(hookId);
            if(hookEl){
                hookEl.innerHTML = template;
                hookEl.querySelector('h1')!.textContent = this.name;
              }
            }
        };
    }
}

@WithTemplate('<h1>More Useful Decorators 👨🏻‍💻</h1>','app')

class Person {
    name = 'Skyy👦🏻';
    constructor(){
        console.log(`Creating a person object/ attaching a decorator...`);
        
    }
}

const skyy = new Person(); //Skyy👦🏻 (on browser as <H1>)
```
- Other Decorator Return Types
- Only with certain type of decorators, return values are supported/respected by TS (Ex- Methods, Accessors etc.)

## Creating an "Autobind" decorator
```ts
function Autobind(_:any, _2:string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor:PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFx = originalMethod.bind(this);
            return boundFx;
        }
    };
    return adjDescriptor;
}

class Printer{
    message= "This works!";
    
    @Autobind //This works
    showMessage(){
        console.log(this.message);
    }
}

const p = new Printer();

const btn = document.querySelector("button")!;
//btn.addEventListener("click", p.showMessage); //undefined
//Also works with this:
btn.addEventListener("click", p.showMessage.bind(p)); //Vanilla JS Soln. - This works!

//Upside - No need to call bind() seperately all the time.
```
## Validation with Decorators
```ts
interface ValidatorConfig{
    [property: string]:{
        [validatAbleprop:string] : string[] //['required', 'positive',]
    }
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string){
        registeredValidators[target.constructor.name] = {
           ...registeredValidators[target.constructor.name],
            [propName]: ['required']
    }
}
function PositiveNum(target: any, propName: string){
        registeredValidators[target.constructor.name] = {
            [propName]: ['positive']
    }
}
function validate(obj: any){
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if(!objValidatorConfig){
        return true;
    }
    let isValid = true;
    for(const prop in objValidatorConfig){
        //console.log(prop);  
        for (const validator of objValidatorConfig[prop]){
            switch(validator){
                case'required':
                isValid = isValid && !!obj[prop];
                break;
                case 'positive':
                isValid = isValid && obj[prop] > 0;
                break;
            }
        }
    }
    return isValid;
}

class Course {
    @Required   
    title: string;

    @PositiveNum
    price: number;

    constructor(t:string,p:number){
        this.title = t;
        this.price = p;
    }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener("submit",evt =>{
    evt.preventDefault();

    const titleEl = document.getElementById("title") as HTMLInputElement;
    const priceEl = document.getElementById("price") as HTMLInputElement;

    const title = titleEl.value;
    const price = +priceEl.value;

    const createdCourse = new Course(title,price);
    if(!validate(createdCourse)){
        alert("Invalid Input - Please try again");
    }
    console.log(createdCourse);
});
```


