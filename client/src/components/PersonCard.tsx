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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { DELETE_PERSON, UPDATE_PERSON, GET_PEOPLE } from "../apollo";
import { Person } from "../types/types";
import CarCard from "./CarCard";

interface PersonCardProps {
  key: string;
  person: Person;
}

const PersonCard: FC<PersonCardProps> = (props) => {
  const { key, person } = props;

  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [personFormData, setPersonFormData] = useState({
    firstName: person.firstName,
    lastName: person.lastName,
  });

  const [updatePerson] = useMutation(UPDATE_PERSON);
  const [deletePerson] = useMutation(DELETE_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
    awaitRefetchQueries: true,
  });

  const handlePersonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updatePerson({
        variables: {
          updatePersonId: person.id,
          updates: personFormData,
        },
      });
      setIsEditingPerson(false);
    } catch (error) {
      console.error("Error updating person:", error);
    }
  };

  const handleDeletePerson = (personId: string) => {
    try {
      deletePerson({
        variables: { deletePersonId: personId },
        optimisticResponse: {
          deletePerson: true,
        },
        update(cache) {
          const existingData = cache.readQuery<{ people: Person[] }>({
            query: GET_PEOPLE,
          });

          if (existingData) {
            cache.writeQuery({
              query: GET_PEOPLE,
              data: {
                people: existingData.people.filter(
                  (person) => person.id !== personId
                ),
              },
            });
          }
        },
      });
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  return (
    <>
      <Card sx={{ mb: 2 }} key={key}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderBottomWidth: 1,
              borderBottomColor: "#E0E0E0",
              borderBottomStyle: "solid",
            }}
          >
            {isEditingPerson ? (
              <>
                <TextField
                  label="First Name"
                  value={personFormData.firstName}
                  onChange={(e) =>
                    setPersonFormData({
                      ...personFormData,
                      firstName: e.target.value,
                    })
                  }
                  fullWidth
                  required
                />
                <TextField
                  label="Last Name"
                  value={personFormData.lastName}
                  onChange={(e) =>
                    setPersonFormData({
                      ...personFormData,
                      lastName: e.target.value,
                    })
                  }
                  fullWidth
                  required
                />
              </>
            ) : (
              <Typography variant="h6">
                {person.firstName} {person.lastName}
              </Typography>
            )}
          </Box>

          {person.cars.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {person.cars.map((car) => (
                <CarCard car={car} />
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
          {isEditingPerson ? (
            <>
              <IconButton
                onClick={handlePersonSubmit}
                size="small"
                sx={{ flex: 1, textAlign: "center", borderRadius: 0 }}
              >
                <CheckIcon />
                <Typography variant="body1">Update</Typography>
              </IconButton>
              <IconButton
                onClick={() => setIsEditingPerson(false)}
                size="small"
                sx={{ flex: 1, textAlign: "center", borderRadius: 0 }}
              >
                <CloseIcon />
                <Typography variant="body1">Exit Update Mode</Typography>
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                onClick={() => setIsEditingPerson(true)}
                size="small"
                sx={{ flex: 1, textAlign: "center", borderRadius: 0 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDeletePerson(person.id)}
                size="small"
                sx={{ flex: 1, textAlign: "center", borderRadius: 0 }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Card>

      {/* I personally prefer modal style to input update info. I leave modal code to use it later. */}

      {/* edit car modal */}
      {/* <Dialog
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
      </Dialog> */}

      {/* edit person modal */}
      {/* <Dialog
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
                value={personFormData.firstName}
                onChange={(e) =>
                  setPersonFormData({ ...personFormData, firstName: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={personFormData.lastName}
                onChange={(e) =>
                  setPersonFormData({ ...personFormData, lastName: e.target.value })
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
      </Dialog> */}
    </>
  );
};

export default PersonCard;
