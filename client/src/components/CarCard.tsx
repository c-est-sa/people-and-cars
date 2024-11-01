import React, { FC, useState } from "react";
import { Typography, TextField, Box } from "@mui/material";

import { Car, Person } from "../types/types";
import { useMutation } from "@apollo/client";
import { DELETE_CAR, GET_PEOPLE, UPDATE_CAR } from "../apollo";
import CardButtons from "./CardButtons";

interface CarCardProps {
  car: Car;
}

const CarCard: FC<CarCardProps> = (props) => {
  const { car } = props;

  const [isEditingCar, setIsEditingCar] = useState(false);
  const [carFormData, setCarFormData] = useState({
    id: car.id,
    year: car.year,
    make: car.make,
    model: car.model,
    price: car.price,
    personId: car.personId,
  });

  const [updateCar] = useMutation(UPDATE_CAR);
  const [deleteCar] = useMutation(DELETE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }],
    awaitRefetchQueries: true,
  });

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateCar({
        variables: {
          updateCarId: car.id,
          updates: {
            year: carFormData.year,
            make: carFormData.make,
            model: carFormData.model,
            price: carFormData.price,
            personId: carFormData.personId,
          },
        },
      });
      setIsEditingCar(false);
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  const handleDeleteCar = (carId: string) => {
    try {
      deleteCar({
        variables: { deleteCarId: carId },
        optimisticResponse: {
          deleteCar: true,
        },
        update(cache) {
          const existingData = cache.readQuery<{ people: Person[] }>({
            query: GET_PEOPLE,
          });

          if (existingData) {
            const updatedPeople = existingData.people.map((person) => {
              if (person.id === car.personId) {
                return {
                  ...person,
                  cars: person.cars.filter((car) => car.id !== carId),
                };
              }
              return person;
            });

            cache.writeQuery({
              query: GET_PEOPLE,
              data: { people: updatedPeople },
            });
          }
        },
      });
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  return (
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
      <Box
        sx={{
          p: 2,
          bgcolor: "#E0E0E0",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {isEditingCar ? (
          <>
            <TextField
              fullWidth
              required
              label="Year"
              value={carFormData.year}
              onChange={(e) =>
                setCarFormData({
                  ...carFormData,
                  year: e.target.value,
                })
              }
            />
            <TextField
              label="Make"
              value={carFormData.make}
              onChange={(e) =>
                setCarFormData({
                  ...carFormData,
                  make: e.target.value,
                })
              }
              fullWidth
              required
            />
            <TextField
              label="Model"
              value={carFormData.model}
              onChange={(e) =>
                setCarFormData({
                  ...carFormData,
                  model: e.target.value,
                })
              }
              fullWidth
              required
            />
            <TextField
              label="Price"
              value={carFormData.price}
              onChange={(e) =>
                setCarFormData({
                  ...carFormData,
                  price: e.target.value,
                })
              }
              fullWidth
              required
              type="text"
              InputProps={{
                startAdornment: <span>$</span>,
              }}
            />
          </>
        ) : (
          <Typography variant="body2">
            {`${car.year} ${car.make} ${car.model} ->  
                      ${new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(car.price))}`}
          </Typography>
        )}
      </Box>

      <CardButtons
        isEditMode={isEditingCar}
        onClickEdit={() => setIsEditingCar(true)}
        onClickDelete={() => handleDeleteCar(car.id)}
        onClickCheck={handleCarSubmit}
        onClickClose={() => setIsEditingCar(false)}
      />
    </Box>
  );
};

export default CarCard;
