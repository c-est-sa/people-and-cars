import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import { CREATE_CAR, GET_PEOPLE } from "../apollo";

interface CarInput {
  year: string;
  make: string;
  model: string;
  price: string;
  personId: string;
}

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

interface AddCarFormProps {
  people: Person[];
}

const AddCarForm = ({ people }: AddCarFormProps) => {
  const [formData, setFormData] = useState<CarInput>({
    year: "",
    make: "",
    model: "",
    price: "",
    personId: "",
  });

  const [createCar] = useMutation(CREATE_CAR, {
    update(cache, { data: { createCar } }) {
      const existingData = cache.readQuery<{ people: any[] }>({
        query: GET_PEOPLE,
      });
      if (existingData) {
        const updatedPeople = existingData.people.map((person) => {
          if (person.id === createCar.personId) {
            return {
              ...person,
              cars: [...person.cars, createCar],
            };
          }
          return person;
        });

        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            people: updatedPeople,
          },
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCar({
      variables: {
        input: {
          ...formData,
          price: formData.price.replace(/[^0-9.]/g, ""),
        },
      },
      optimisticResponse: {
        createCar: {
          __typename: "Car",
          id: "temp-id",
          ...formData,
        },
      },
    });
    setFormData({
      year: "",
      make: "",
      model: "",
      price: "",
      personId: "",
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, price: value });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="stretch"
      >
        <TextField
          fullWidth
          required
          label="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        />
        <TextField
          fullWidth
          required
          label="Make"
          value={formData.make}
          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
        />
        <TextField
          fullWidth
          required
          label="Model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        />
        <TextField
          fullWidth
          required
          label="Price"
          value={formData.price}
          onChange={handlePriceChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          select
          fullWidth
          required
          label="Person"
          value={formData.personId}
          onChange={(e) =>
            setFormData({ ...formData, personId: e.target.value })
          }
        >
          {people.map((person) => (
            <MenuItem key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          sx={{
            height: { xs: "40px", sm: "56px" },
            minWidth: { sm: "200px" },
          }}
        >
          Add Car
        </Button>
      </Stack>
    </form>
  );
};

export default AddCarForm;
