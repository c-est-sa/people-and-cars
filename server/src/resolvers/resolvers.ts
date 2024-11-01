import {
  addCar,
  addPerson,
  deleteCar,
  deletePerson,
  readData,
  updateCar,
  updatePerson,
} from "../data/databaseOperations.js";
import { Person, Car } from "../types/types.js";

export const resolvers = {
  Query: {
    people: async () => {
      const data = await readData();
      return data.people;
    },

    person: async (_: unknown, { id }: { id: string }) => {
      const data = await readData();
      return data.people.find((person) => person.id === id);
    },

    cars: async () => {
      const data = await readData();
      return data.cars;
    },

    car: async (_: unknown, { id }: { id: string }) => {
      const data = await readData();
      return data.cars.find((car) => car.id === id);
    },
    // personCars: (_: unknown, { personId }: { personId: string }) =>
    //   cars.filter((car) => car.personId === personId),
    // personWithCars: (
    //   _: unknown,
    //   { id }: { id: string }
    // ): Person | undefined => {
    //   const person = people.find((person) => person.id === id);
    //   if (!person) return undefined;
    //   return person;
    // },
  },

  Mutation: {
    addPerson: async (
      _: unknown,
      { firstName, lastName }: Omit<Person, "id">
    ) => {
      return await addPerson({ firstName, lastName });
    },

    updatePerson: async (
      _: unknown,
      { id, updates }: { id: string; updates: Partial<Person> }
    ) => {
      return await updatePerson(id, { ...updates });
    },

    deletePerson: async (_: unknown, { id }: { id: string }) => {
      return await deletePerson(id);
    },

    addCar: async (_: unknown, { car }: { car: Omit<Car, "id"> }) => {
      return await addCar(car);
    },

    updateCar: async (
      _: unknown,
      { id, updates }: { id: string; updates: Partial<Car> }
    ) => {
      return await updateCar(id, { ...updates });
    },

    deleteCar: async (_: unknown, { id }: { id: string }) => {
      return await deleteCar(id);
    },
  },

  Person: {
    cars: async (parent: Person) => {
      const data = await readData();
      return data.cars.filter((car) => car.personId === parent.id);
    },
  },

  Car: {
    person: async (parent: Car) => {
      const data = await readData();
      return data.people.find((person) => person.id === parent.personId);
    },
  },
};

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     books: () => books,
//   },
// };
