export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  cars: Car[];
}

export interface Car {
  id: string;
  year: string;
  make: string;
  model: string;
  price: string;
  personId: string;
}

export interface NewPersonInput {
  firstName: string;
  lastName: string;
}

export interface NewCarInput {
  year: string;
  make: string;
  model: string;
  price: string;
  personId: string;
}
