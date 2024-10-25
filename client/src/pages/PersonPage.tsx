// src/pages/PersonPage.tsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { GET_PERSON_WITH_CARS, UPDATE_CAR, DELETE_CAR } from "../apollo";

const PageContainer = styled(Container)(({ theme }) => ({
  maxWidth: "64rem",
  width: "64rem",
  margin: "0 auto",
  padding: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  textAlign: "center",
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(8),
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
}));

const formatPrice = (price: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
};

const PersonPage = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { personWithCarsId: id },
  });
  // const { personWithCars: person } = data;

  const [isEditingCar, setIsEditingCar] = useState(false);
  const [carFormData, setCarFormData] = useState({
    id: "",
    year: "",
    make: "",
    model: "",
    price: "",
    personId: "",
  });

  const [updateCar] = useMutation(UPDATE_CAR);
  const [deleteCar] = useMutation(DELETE_CAR);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  if (!data?.personWithCars) return <Typography>Person not found</Typography>;

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

  return (
    <PageContainer>
      {data && (
        <>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: "bold" }}
          >
            {data.personWithCars.firstName} {data.personWithCars.lastName}
          </Typography>

          <Section>
            <SectionTitle variant="h5">Cars Owned:</SectionTitle>
            <CardsContainer>
              {data.personWithCars.cars.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {data.personWithCars.cars.map((car) => (
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
                            onClick={() =>
                              deleteCar({ variables: { id: car.id } })
                            }
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
            </CardsContainer>
          </Section>
        </>
      )}

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
    </PageContainer>
  );
};

export default PersonPage;
