import React, { FC } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import { GET_PERSON } from "../apollo";
import CarCard from "../components/CarCard";
import { Car } from "../types/types";

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

const PersonPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_PERSON, {
    variables: { personId: id },
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  if (!data?.person) return <Typography>Person not found</Typography>;

  return (
    <PageContainer maxWidth={false}>
      <Link
        to={"/"}
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ArrowBack />
        <Button>Go Back</Button>
      </Link>

      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ mb: 6, fontWeight: "bold" }}
      >
        {data.person.firstName} {data.person.lastName}
      </Typography>

      <Section>
        <SectionTitle variant="h5">Cars Owned:</SectionTitle>
        <CardsContainer>
          {data.person.cars.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {data.person.cars.map((car: Car) => (
                <CarCard car={car} />
              ))}
            </Box>
          ) : (
            <Typography variant="body1" align="center">
              No cars owned
            </Typography>
          )}
        </CardsContainer>
      </Section>

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
    </PageContainer>
  );
};

export default PersonPage;
