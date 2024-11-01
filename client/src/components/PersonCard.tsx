import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import {
  UPDATE_CAR,
  DELETE_CAR,
  DELETE_PERSON,
  UPDATE_PERSON,
} from "../apollo";
import { Person } from "../types/types";

interface PersonCardProps {
  key: string;
  person: Person;
}

const PersonCard: FC<PersonCardProps> = (props) => {
  const { key, person } = props;

  const [isEditingCar, setIsEditingCar] = useState(false);
  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [carFormData, setCarFormData] = useState({
    id: "",
    year: "",
    make: "",
    model: "",
    price: "",
    personId: person.id,
  });
  const [formData, setFormData] = useState({
    firstName: person.firstName,
    lastName: person.lastName,
  });

  const [updateCar] = useMutation(UPDATE_CAR);
  const [deleteCar] = useMutation(DELETE_CAR);
  const [updatePerson] = useMutation(UPDATE_PERSON);
  const [deletePerson] = useMutation(DELETE_PERSON);

  const handleEditCar = (car) => {
    setCarFormData({
      id: car.id,
      year: car.year,
      make: car.make,
      model: car.model,
      price: car.price,
      personId: car.personId,
    });
    setIsEditingCar(true);
  };

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCar({
      variables: {
        id: carFormData.id,
        input: {
          year: carFormData.year,
          make: carFormData.make,
          model: carFormData.model,
          price: carFormData.price,
          personId: carFormData.personId,
        },
      },
    });
    setIsEditingCar(false);
  };

  const handlePersonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePerson({
      variables: {
        id: person.id,
        input: formData,
      },
    });
    setIsEditingPerson(false);
  };

  return (
    <>
      <Card sx={{ mb: 2 }} key={key}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#E0E0E0",
              borderBottomStyle: "solid",
            }}
          >
            <Typography variant="h6">
              {person.firstName} {person.lastName}
            </Typography>
          </Box>

          {person.cars.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {person.cars.map((car) => (
                <Box
                  key={car.id}
                  sx={{
                    mb: 1,
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    borderStyle: "solid",
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ p: 2, bgcolor: "#E0E0E0" }}>
                    <Typography variant="body2">
                      {`${car.year} ${car.make} ${car.model} ->  
                      ${new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(car.price))}`}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <IconButton
                        onClick={() => handleEditCar(car)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <IconButton
                        onClick={() => deleteCar({ variables: { id: car.id } })}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Link to={`/people/${person.id}`} style={{ textDecoration: "none" }}>
            <Button>Learn More</Button>
          </Link>
        </CardActions>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <IconButton onClick={() => setIsEditingPerson(true)} size="small">
              <EditIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <IconButton
              onClick={() =>
                deletePerson({ variables: { deletePersonId: person.id } })
              }
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>

      {/* edit car modal */}
      <Dialog
        open={isEditingCar}
        onClose={() => setIsEditingCar(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleCarSubmit}>
          <DialogTitle>Edit Car</DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                required
                label="Year"
                value={carFormData.year}
                onChange={(e) =>
                  setCarFormData({ ...carFormData, year: e.target.value })
                }
              />
              <TextField
                label="Make"
                value={carFormData.make}
                onChange={(e) =>
                  setCarFormData({ ...carFormData, make: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Model"
                value={carFormData.model}
                onChange={(e) =>
                  setCarFormData({ ...carFormData, model: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Price"
                value={carFormData.price}
                // onChange={handleCarPriceChange}
                fullWidth
                required
                type="text"
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditingCar(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* edit person modal */}
      <Dialog
        open={isEditingPerson}
        onClose={() => setIsEditingPerson(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handlePersonSubmit}>
          <DialogTitle>Edit Person</DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                fullWidth
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditingPerson(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PersonCard;
