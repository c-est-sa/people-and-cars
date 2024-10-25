import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { TextField, Button, Stack } from "@mui/material";

import { CREATE_PERSON, GET_PEOPLE } from "../apollo";

interface PersonInput {
  firstName: string;
  lastName: string;
}

const AddPersonForm = () => {
  const [formData, setFormData] = useState<PersonInput>({
    firstName: "",
    lastName: "",
  });

  const [createPerson] = useMutation(CREATE_PERSON, {
    update(cache, { data: { createPerson } }) {
      const existingData = cache.readQuery<{ people: any[] }>({
        query: GET_PEOPLE,
      });
      if (existingData) {
        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            people: [...existingData.people, createPerson],
          },
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPerson({
      variables: { input: formData },
      optimisticResponse: {
        createPerson: {
          __typename: "Person",
          id: "temp-id",
          ...formData,
        },
      },
    });
    setFormData({ firstName: "", lastName: "" });
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
