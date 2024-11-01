import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { Car, Database, Person } from "../types/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "data", "peopleCarsScheme.js");

export const readData = async (): Promise<Database> => {
  try {
    // const rawData = await fs.readFile(DB_PATH, "utf-8");

    // const jsonData = rawData
    //   .replace("const people = ", '"people":')
    //   .replace("const cars = ", '"cars":')
    //   .replace(/;/g, ",");

    // return JSON.parse(`{${jsonData}}`);

    const content = await fs.readFile(DB_PATH, "utf-8");

    // Extract the array contents using regex
    const peopleMatch = content.match(/const people = (\[[\s\S]*?\]);/);
    const carsMatch = content.match(/const cars = (\[[\s\S]*?\]);/);

    if (!peopleMatch || !carsMatch) {
      throw new Error("Could not find people or cars data");
    }

    // Parse the arrays
    const people = eval(peopleMatch[1]) as Person[];
    const cars = eval(carsMatch[1]) as Car[];

    return { people, cars };
  } catch (error) {
    console.error("Error reading data", error);
    throw error;
  }
};

export const writeData = async (data: Database): Promise<void> => {
  try {
    console.log("Writing data", data);
    const content = `const people = ${JSON.stringify(
      data.people,
      null,
      2
    )};\n\nconst cars = ${JSON.stringify(data.cars, null, 2)};\n`;

    await fs.writeFile(DB_PATH, content, "utf-8");
  } catch (error) {
    console.error("Error writing data", error);
    throw error;
  }
};

export const addPerson = async (
  person: Omit<Person, "id">
): Promise<Person> => {
  const data = await readData();

  const maxId = Math.max(...data.people.map((person) => parseInt(person.id)));
  const newPerson: Person = {
    id: String(maxId + 1),
    ...person,
  };
  data.people.push(newPerson);

  await writeData(data);
  return newPerson;
};

export const updatePerson = async (
  id: string,
  updates: Partial<Person>
): Promise<Person | null> => {
  const data = await readData();

  const personIndex = data.people.findIndex((person) => person.id === id);
  if (personIndex === -1) return null;

  data.people[personIndex] = { ...data.people[personIndex], ...updates };

  await writeData(data);
  return data.people[personIndex];
};

export const deletePerson = async (id: string): Promise<boolean | null> => {
  const data = await readData();

  const personIndex = data.people.findIndex((person) => person.id === id);
  if (personIndex === -1) return null;

  const initialLength = data.people.length;
  data.people = data.people.filter((person) => person.id !== id);
  data.cars = data.cars.filter((car) => car.personId !== id);

  await writeData(data);
  return data.people.length < initialLength;
};

export const addCar = async (car: Omit<Car, "id">): Promise<Car> => {
  const data = await readData();

  const maxId = Math.max(...data.cars.map((car) => parseInt(car.id)));
  const newCar: Car = {
    id: String(maxId + 1),
    ...car,
  };
  data.cars.push(newCar);

  await writeData(data);
  return newCar;
};

export const updateCar = async (
  id: string,
  updates: Partial<Car>
): Promise<Car | null> => {
  const data = await readData();

  const carIndex = data.cars.findIndex((car) => car.id === id);
  if (carIndex === -1) return null;

  data.cars[carIndex] = { ...data.cars[carIndex], ...updates };

  await writeData(data);
  return data.cars[carIndex];
};

export const deleteCar = async (id: string): Promise<boolean | null> => {
  const data = await readData();

  const initialLength = data.cars.length;
  data.cars = data.cars.filter((car) => car.id !== id);

  await writeData(data);
  return data.cars.length < initialLength;
};
