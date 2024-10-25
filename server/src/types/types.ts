export interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Car {
  id: string;
  year: string;
  make: string;
  model: string;
  price: string;
  personId: string;
}

export interface PersonInput {
  firstName: string;
  lastName: string;
}

export interface UpdatePersonInput {
  firstName?: string;
  lastName?: string;
}

export interface CarInput {
  year: string;
  make: string;
  model: string;
  price: string;
  personId: string;
}

export interface UpdateCarInput {
  year?: string;
  make?: string;
  model?: string;
  price?: string;
  personId?: string;
}
