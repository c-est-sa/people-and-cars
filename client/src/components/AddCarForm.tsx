import React, { FC, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import { CREATE_CAR, GET_PEOPLE } from "../apollo";
import { NewCarInput, Person } from "../types/types";

interface AddCarFormProps {
  people: Person[];
}

const AddCarForm: FC<AddCarFormProps> = (props) => {
  const { people } = props;

  const [formData, setFormData] = useState<NewCarInput>({
    year: "",
    make: "",
    model: "",
    price: "",
    personId: "",
  });

  const [createCar] = useMutation(CREATE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }],
    awaitRefetchQueries: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCar({
      variables: {
        car: {
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
          {people.map((personObj) => (
            <MenuItem key={personObj.id} value={personObj.id}>
              {personObj.firstName} {personObj.lastName}
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
