import { people, cars } from "../data/peopleCarsScheme.js";
import {
  Person,
  Car,
  PersonInput,
  UpdatePersonInput,
  CarInput,
  UpdateCarInput,
} from "../types/types.js";

export const resolvers = {
  Query: {
    people: () => people,
    person: (_: unknown, { id }: { id: string }) =>
      people.find((person) => person.id === id),
    cars: () => cars,
    car: (_: unknown, { id }: { id: string }) =>
      cars.find((car) => car.id === id),
    personCars: (_: unknown, { personId }: { personId: string }) =>
      cars.filter((car) => car.personId === personId),
    personWithCars: (
      _: unknown,
      { id }: { id: string }
    ): Person | undefined => {
      const person = people.find((person) => person.id === id);
      if (!person) return undefined;
      return person;
    },
  },

  Mutation: {
    createPerson: (_: unknown, { input }: { input: PersonInput }) => {
      const maxId = Math.max(...people.map((person) => parseInt(person.id)));
      const newPerson = {
        id: String(maxId + 1),
        ...input,
      };
      people.push(newPerson);
      return newPerson;
    },

    updatePerson: (
      _: unknown,
      { id, input }: { id: string; input: UpdatePersonInput }
    ) => {
      const personIndex = people.findIndex((person) => person.id === id);
      if (personIndex === -1) throw new Error("Person not found");

      const updatedPerson = {
        ...people[personIndex],
        ...input,
      };
      people[personIndex] = updatedPerson;
      return updatedPerson;
    },

    deletePerson: (_: unknown, { id }: { id: string }) => {
      const personIndex = people.findIndex((person) => person.id === id);
      if (personIndex === -1) throw new Error("Person not found");

      const deletedPerson = people[personIndex];
      people.splice(personIndex, 1);
      return deletedPerson;
    },

    createCar: (_: unknown, { input }: { input: CarInput }) => {
      const newCar = {
        id: String(cars.length + 1),
        ...input,
      };
      cars.push(newCar);
      return newCar;
    },

    updateCar: (
      _: unknown,
      { id, input }: { id: string; input: UpdateCarInput }
    ) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) throw new Error("Car not found");

      const updatedCar = {
        ...cars[carIndex],
        ...input,
      };
      cars[carIndex] = updatedCar;
      return updatedCar;
    },

    deleteCar: (_: unknown, { id }: { id: string }) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) throw new Error("Car not found");

      const deletedCar = cars[carIndex];
      cars.splice(carIndex, 1);
      return deletedCar;
    },
  },

  // Field resolvers for relationships
  Person: {
    cars: (person: Person): Car[] =>
      cars.filter((car) => car.personId === person.id),
  },

  // Car: {
  //   owner: (car: Car) => people.find((person) => person.id === car.personId),
  // },
};

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     books: () => books,
//   },
// };
