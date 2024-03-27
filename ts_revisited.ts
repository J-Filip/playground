/**
 * ___________________
 * Test utilities
 * ___________________
 */

const addNumbers = (a: number, b: number): number => {
  return a + b;
};

addNumbers(3, 9);

// ? we dont have to specify return type void here ?
const logItems = (items: number[]): void => {
  console.log(items);
};

logItems([0, 3]);

// union types

type Id = number | string;

const swapIdType = (id: Id) => {
  // type guard example
  if (typeof id === "string") {
    parseInt(id);
  } else {
    // TS knows that id is number here and shows code completion for type number
    console.log(id);
  }
};

/**
 *  Narrowing - discriminated unions
 */
// ? https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions

interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
  // if shape.kind === 'square'
  //    do something else...
}

/**
 *  function signatures
 */

type Signature = (name: string, lastName: string) => string;

function formalSignature(name: string, lastName: string) {
  return `mr. ${name} ${lastName}`;
}

function signatureID(id: number) {
  return id;
}

let signatures: Signature[] = [];
signatures.push(formalSignature);
// signatures.push(signatureID) // does not conform to signature interface

/**
 *  function signatures on interfaces
 */

interface IUser {
  id: string;
  talk?: (text: string) => void;
}

const Admin: IUser = {
  id: "32",
  talk: () => console.log("aaaa"),
};

/**
 *  extending interfaces
 */

interface ITeacher extends IUser {
  currentlyEmployed: boolean;
  yearsOfService?: number;
}

const MrJack: ITeacher = {
  id: "2",
  currentlyEmployed: true,
  yearsOfService: 12,
};

let logID = (value: IUser) => {
  console.log(value.id);
};

// both work even though MrJack has interface ITeacher
logID(Admin);
logID(MrJack);

/**
 * extending type aliases
 */

type Person = {
  id: string;
  firstName: string;
};

type Criminal = Person & {
  sentence?: string;
  typeOfOffense?: string;
};

const convict1: Criminal = {
  id: "1",
  firstName: "Jim",
  sentence: "12 years Azkaban",
  typeOfOffense: "drug offense",
};

const cop1 = {
  id: "1",
  firstName: "John",
  race: "alien",
};

let printCriminal = (criminal: Criminal) => {
  console.log(criminal.firstName, criminal.sentence);
};

printCriminal(convict1);
// printCriminal(cop1) // does not have property sentence

/**
 *  classes:
 *      - inheritance
 *      - classes with interfaces
 */

interface IToGO {
  packToGo(): void;
}

abstract class MenuItem implements IToGO {
  constructor(private title: string, private price: number) {}

  get details(): string {
    return this.title;
  }

  abstract packToGo(): void;
}

type Base = "classic" | "thick" | "garlic";

class Pizza extends MenuItem {
  constructor(title: string, price: number) {
    super(title, price);
  }

  private base: Base = "classic";
  private toppings: string[] = [];

  // we can override the details funcitons
  get details(): string {
    return this.base + this.toppings;
  }

  addTopping(topping: string): void {
    this.toppings.push(topping);
  }
  removeTopping(topping: string): void {
    this.toppings = this.toppings.filter((t: string) => t !== topping);
  }

  packToGo(): void {
    console.log(`Place inside a carton box. Base selected: ${this.base}`);

    // toppings

    if (this.toppings.length < 1) {
      console.log("no toppings");
    }
    console.log(`Toppings selected: ${this.toppings.join(", ")}`);
  }
}

const housePizza = new Pizza("gigi special", 12.5);
housePizza.details;

housePizza.addTopping("cream");
housePizza.addTopping("egg");
housePizza.addTopping("tomato");
housePizza.removeTopping("cream");
housePizza.removeTopping("egg");

const printDetails = (item: MenuItem) => {
  console.log(item.details);
};
// printDetails(housePizza)

const makeToGo = (item: IToGO) => {
  item.packToGo();
};

makeToGo(housePizza);
/**
 *  ! generics
 */

interface IHasId {
  id: string;
}

function increaseSize<T>(val: T): T {
  return val;
}

const test1 = increaseSize<number>(1);
const test2 = increaseSize<string>("dadaa");

// another example

// generic constraint
function getRandomArrayValue<T extends IHasId>(val: T[]): T {
  console.log(val[0].id);

  return val[Math.floor(Math.random() * val.length)];
}
function getArrayNumber<T>(val: T[]): number {
  return Math.floor(Math.random() * val.length);
}

const test4 = getArrayNumber([2, 343, 0.43]);
console.log(test4);

const Players: Criminal[] = [
  { id: "1", firstName: "Pero" },
  { id: "32", firstName: "Joua" },
];

const randomUser = getRandomArrayValue(Players);
console.log(randomUser);

const randomNumber = getArrayNumber(Players);
console.log(randomNumber);

// generic interface

interface ICollection<T> {
  data: T[];
  name: string;
}

const books: ICollection<string> = {
  data: ["saa", "dd"],
  name: "my books",
};

const crims2: ICollection<Criminal> = {
  data: [
    {
      id: "1",
      firstName: "Boobosa",
    },
    {
      id: "4",
      firstName: "Django",
    },
  ],
  name: "jamrock criminials",
};

function randomCollectionItem<T>(collection: ICollection<T>): T {
  const index = Math.floor(Math.random() * collection.data.length);
  return collection.data[index];
}

const randomCrim = randomCollectionItem<Criminal>(crims2);
const randomBook = randomCollectionItem<string>(books);

console.log(randomBook);
console.log(randomCrim);
