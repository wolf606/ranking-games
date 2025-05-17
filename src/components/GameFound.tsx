import React from 'react';
import {
  Box,
  Typography,
  Modal,
  Stack,
  Button,
} from '@mui/material';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type GameData = {
  nombre: string;
  genero: string;
  plataforma: string;
  precio: number;
  stock: number;
  imagen: string;
};

export default function GameFoundModal({
  open,
  handleClose,
  game,
}: {
  open: boolean;
  handleClose: () => void;
  game: GameData | null;
}) {
  if (!game) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="game-modal-title"
      aria-describedby="game-modal-description"
    >
      <Box sx={style}>
        <Typography id="game-modal-title" variant="h6" gutterBottom>
          {game.nombre}
        </Typography>
        <Stack spacing={2}>
          <img
            src={game.imagen}
            alt={`Imagen de ${game.nombre}`}
            style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
          />
          <Typography><strong>Género:</strong> {game.genero}</Typography>
          <Typography><strong>Plataforma:</strong> {game.plataforma}</Typography>
          <Typography><strong>Precio:</strong> ${game.precio.toFixed(2)}</Typography>
          <Typography><strong>Stock:</strong> {game.stock}</Typography>

          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
