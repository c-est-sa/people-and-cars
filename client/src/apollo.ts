import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
        personId
      }
    }
  }
`;

export const GET_PERSON = gql`
  query GetPerson($personId: ID!) {
    person(id: $personId) {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
        personId
      }
    }
  }
`;

export const CREATE_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      lastName
      id
      firstName
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($updatePersonId: ID!, $updates: UpdatePersonInput!) {
    updatePerson(id: $updatePersonId, updates: $updates) {
      id
      firstName
      lastName
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($deletePersonId: ID!) {
    deletePerson(id: $deletePersonId)
  }
`;

export const CREATE_CAR = gql`
  mutation AddCar($car: CarInput!) {
    addCar(car: $car) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const UPDATE_CAR = gql`
  mutation UpdateCar($updateCarId: ID!, $updates: UpdateCarInput!) {
    updateCar(id: $updateCarId, updates: $updates) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const DELETE_CAR = gql`
  mutation DeleteCar($deleteCarId: ID!) {
    deleteCar(id: $deleteCarId)
  }
`;
