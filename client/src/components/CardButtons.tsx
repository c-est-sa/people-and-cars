import React, { FC } from "react";
import { Typography, IconButton, Box } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface CardButtonsProps {
  isEditMode: boolean;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickCheck: (e: React.FormEvent) => void;
  onClickClose: () => void;
}

const CardButtons: FC<CardButtonsProps> = (props) => {
  const { isEditMode, onClickEdit, onClickDelete, onClickCheck, onClickClose } =
    props;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <IconButton
        onClick={isEditMode ? onClickCheck : onClickEdit}
        size="small"
        sx={{ flex: 1, textAlign: "center", borderRadius: 0 }}
      >
        {isEditMode ? (
          <>
            <CheckIcon />
            <Typography variant="body1">Update</Typography>
          </>
        ) : (
          <EditIcon />
        )}
      </IconButton>

      <IconButton
        onClick={isEditMode ? onClickClose : onClickDelete}
        size="small"
        sx={{ flex: 1, textAlign: "center", borderRadius: 0 }}
      >
        {isEditMode ? (
          <>
            <CloseIcon />
            <Typography variant="body1">Exit Update Mode</Typography>
          </>
        ) : (
          <DeleteIcon />
        )}
      </IconButton>
    </Box>
  );
};

export default CardButtons;
