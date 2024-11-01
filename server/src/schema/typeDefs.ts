export const typeDefs = `
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]!
  }

  type Car {
    id: ID!
    year: String!
    make: String!
    model: String!
    price: String!
    personId: String!
    person: Person!
  }

  type Query {
    people: [Person]!

    person(id: ID!): Person
    
    cars: [Car]!
    
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person!

    updatePerson(id: ID!, updates: UpdatePersonInput!): Person

    deletePerson(id: ID!): Boolean!

    addCar(car: CarInput!): Car!

    updateCar(id: ID!, updates: UpdateCarInput!): Car

    deleteCar(id: ID!): Boolean!
  }

  input UpdatePersonInput {
    firstName: String
    lastName: String
  }

  input CarInput {
    year: String!
    make: String!
    model: String!
    price: String!
    personId: String!
  }

  input UpdateCarInput {
    year: String
    make: String
    model: String
    price: String
    personId: String
  }
`;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// export const typeDefs = `#graphql
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     title: String
//     author: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//   }
// `;
