export const peopleTypeDefs = `
  type Person {
    id: String
    firstName: String
    lastName: String
    cars: [Car]
  }

  input PersonInput {
    firstName: String
    lastName: String
  }

  input UpdatePersonInput {
    firstName: String
    lastName: String
  }
`;

export const carsTypeDefs = `
  type Car {
    id: String
    year: String
    make: String
    model: String
    price: String
    personId: String
  }

  input CarInput {
    year: String
    make: String
    model: String
    price: String
    personId: String
  }

  input UpdateCarInput {
    year: String
    make: String
    model: String
    price: String
    personId: String
  }
`;

export const baseTypeDefs = `#graphql
  type Query {
    people: [Person]
    person(id: String): Person
    personWithCars(id: String): Person
    cars: [Car]
    car(id: String): Car
    personCars(personId: String): [Car]
  }

  type Mutation {
    createPerson(input: PersonInput): Person
    updatePerson(id: String, input: UpdatePersonInput): Person
    deletePerson(id: String): Person
    
    createCar(input: CarInput): Car
    updateCar(id: String, input: UpdateCarInput): Car
    deleteCar(id: String): Car
  }
`;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
