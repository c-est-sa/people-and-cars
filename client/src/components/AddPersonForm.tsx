import React, { FC, useState } from "react";
import { useMutation } from "@apollo/client";
import { TextField, Button, Stack } from "@mui/material";

import { CREATE_PERSON, GET_PEOPLE } from "../apollo";
import { NewPersonInput } from "../types/types";

const AddPersonForm: FC = () => {
  const [formData, setFormData] = useState<NewPersonInput>({
    firstName: "",
    lastName: "",
  });

  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
    awaitRefetchQueries: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createPerson({
        variables: { ...formData },
        optimisticResponse: {
          createPerson: {
            __typename: "Person",
            id: "temp-id",
            ...formData,
            cars: [],
          },
        },
      });
      setFormData({ firstName: "", lastName: "" });
    } catch (error) {
      console.error("Error creating person:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          fullWidth
          required
          label="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />
        <TextField
          fullWidth
          required
          label="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            height: { xs: "40px", sm: "56px" },
            minWidth: { sm: "200px" },
          }}
        >
          Add Person
        </Button>
      </Stack>
    </form>
  );
};

export default AddPersonForm;
