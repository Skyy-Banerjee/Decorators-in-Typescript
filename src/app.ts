// function WithTemplate(template: string, hookId: string){
//     console.log(`WithTemplate factory..!🛠️`); 
//     return function<T extends {new (...args:any[]):{name:string}}>(originalConstructor: T){
//         console.log(`Logging @WithTemplate decorator..`);
//         //! Returning (and changing) in a Class Decorator
//         return class extends originalConstructor {
//             constructor(..._:any[]){
//             super();
//             console.log(`Rendering template..`);
//             const hookEl = document.getElementById(hookId);
//             if(hookEl){
//                 hookEl.innerHTML = template;
//                 hookEl.querySelector('h1')!.textContent = this.name;
//               }
//             }
//         };
//     }
// }

// function Logger(logStr: string){
//     console.log(`Logger factory..!🛠️`);
    
//     return function(constructor: Function){
//         console.log(logStr);
//         console.log(constructor);
//     }   
// }
// @WithTemplate('<h1>More Useful Decorators 👨🏻‍💻</h1>','app')
// @Logger(`Logging @Logger decorator..`)

// class Person {
//     name = 'Skyy👦🏻';
//     constructor(){
//         console.log(`Creating a person object/ attaching a decorator...`);
        
//     }
// }

// const skyy = new Person();

// //Diving into other decorators (apart from Classes)
// function Log(target:any, propertyName: string | Symbol){
//     console.log(`Property Decorator - factory!`);
//     console.log(target, propertyName);   
// }

// function Log2(target: any, name: string, descriptor: PropertyDescriptor){
//     console.log(`Accessor decorator..`);
//     console.log(target);
//     console.log(name);
//     console.log(descriptor);
// }

// function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor){
//     console.log(`Method decorator..`);
//     console.log(target);
//     console.log(name);
//     console.log(descriptor);
// }

// function Log4(target: any, name: string | Symbol, position: number){
//     console.log(`Parameter decorator..`);
//     console.log(target);
//     console.log(name);
//     console.log(position);
// }

// class Product{
//     @Log
//     title: string;
//     private _price: number;

//     @Log2
//     setPrice(val:number){
//         if(val>0){
//             this._price = val;
//         }else {
//             throw new Error('Invalid price - should be positive!');
//         }
        
//     }

//     constructor(t:string,p:number){
//         this.title = t;
//         this._price = p;
//     }
//     @Log3
//     getPriceWithTax(@Log4 tax:number){
//         return this._price * (1+tax);
//     }
// }

//todo: Creating an "Autobind" decorator
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
    
    @Autobind
    showMessage(){
        console.log(this.message);
    }
}

const p = new Printer();

const btn = document.querySelector("button")!;
//btn.addEventListener("click", p.showMessage); //undefined
btn.addEventListener("click", p.showMessage.bind(p)); //Vanilla JS Soln. - This works!

//todo: Validation with Decorators
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


