// src/pages/HomePage.tsx
import React from "react";
import { useQuery } from "@apollo/client";
import { styled } from "@mui/material/styles";
import { Container, Typography, Box } from "@mui/material";

import { GET_PEOPLE } from "../apollo";
import PersonCard from "../components/PersonCard";
import AddPersonForm from "../components/AddPersonForm";
import AddCarForm from "../components/AddCarForm";

const PageContainer = styled(Container)(({ theme }) => ({
  maxWidth: "64rem",
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

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <PageContainer>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ mb: 6, fontWeight: "bold" }}
      >
        PEOPLE AND THEIR CARS
      </Typography>

      <Section>
        <SectionTitle variant="h5">Add Person</SectionTitle>
        <AddPersonForm />
      </Section>

      {data.people.length > 0 && (
        <Section>
          <SectionTitle variant="h5">Add Car</SectionTitle>
          <AddCarForm people={data.people} />
        </Section>
      )}

      <Section>
        <SectionTitle variant="h5">Records</SectionTitle>
        <CardsContainer>
          {data.people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </CardsContainer>
      </Section>
    </PageContainer>
  );
};

export default HomePage;
