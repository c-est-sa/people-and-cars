import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export const GET_PEOPLE = gql`
  query GetPeople {
    people {
      cars {
        id
        make
        model
        personId
        price
        year
      }
      firstName
      id
      lastName
    }
  }
`;

export const GET_PERSON_WITH_CARS = gql`
  query GetPersonWithCars($personWithCarsId: String) {
    personWithCars(id: $personWithCarsId) {
      cars {
        id
        year
        make
        model
        price
        personId
      }
      firstName
      id
      lastName
    }
  }
`;

export const CREATE_PERSON = gql`
  mutation CreatePerson($input: PersonInput!) {
    createPerson(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $input: UpdatePersonInput!) {
    updatePerson(id: $id, input: $input) {
      id
      firstName
      lastName
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($deletePersonId: String) {
    deletePerson(id: $deletePersonId) {
      cars {
        id
        year
        make
        model
        price
        personId
      }
      firstName
      id
      lastName
    }
  }
`;

export const CREATE_CAR = gql`
  mutation CreateCar($input: CarInput!) {
    createCar(input: $input) {
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
  mutation UpdateCar($id: ID!, $input: UpdateCarInput!) {
    updateCar(id: $id, input: $input) {
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
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
    }
  }
`;
