import { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  Stack,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material/Select';
import data from '../../server.json';
import { generos, plataformas } from '../enums/constants';

const BACKEND_URL = data.BACKEND_URL || 'http://localhost:3000';

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

export default function NewGameModal({
    open,
    handleClose,
    rows,
    setRows,
}: {
    open: boolean;
    handleClose: () => void;
    rows: GameData[];
    setRows: React.Dispatch<React.SetStateAction<GameData[]>>;
}) {
  const [form, setForm] = useState<FormState>({
    nombre: '',
    genero: '',
    plataforma: '',
    precio: '',
    stock: '',
    imagen: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});

  // Validate a single field
  const validateField = (name: keyof FormState, value: string) => {
    switch (name) {
      case 'nombre':
        return value ? '' : 'Nombre es requerido';
      case 'genero':
        return value ? '' : 'Género es requerido';
      case 'plataforma':
        return value ? '' : 'Plataforma es requerida';
      case 'precio':
        return !value || Number(value) <= 0
          ? 'Precio debe ser un número positivo'
          : '';
      case 'stock':
        return value === '' || Number(value) < 0
          ? 'Stock no puede ser negativo'
          : '';
      case 'imagen':
        return value ? '' : 'URL de imagen es requerida';
      default:
        return '';
    }
  };

  // Validate all fields
  const validate = (state: FormState) => {
    const newErrors: Partial<FormState> = {};
    (Object.keys(state) as (keyof FormState)[]).forEach((key) => {
      const error = validateField(key, state[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name as keyof FormState, value),
      }));
      return updated;
    });
  };

  const handleSelectChange = (
    e: SelectChangeEvent<string>,
    child?: React.ReactNode
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name as keyof FormState, value),
      }));
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate(form)) {
      console.log('Form submitted:', form);
      fetch(`${BACKEND_URL}/juegos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          precio: Number(form.precio),
          stock: Number(form.stock),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
            setRows((prev) => [...prev, data]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      handleClose();
      setForm({
        nombre: '',
        genero: '',
        plataforma: '',
        precio: '',
        stock: '',
        imagen: '',
      });
      setErrors({});
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" gutterBottom>
          Insertar nuevo juego
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth error={!!errors.nombre}>
            <InputLabel htmlFor="nombre">Nombre</InputLabel>
            <OutlinedInput
              id="nombre"
              name="nombre"
              label="Nombre"
              value={form.nombre}
              onChange={handleChange}
            />
            <FormHelperText>{errors.nombre}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.genero}>
            <InputLabel id="genero-label">Género</InputLabel>
            <Select
              labelId="genero-label"
              id="genero"
              name="genero"
              value={form.genero}
              label="Género"
              onChange={handleSelectChange}
              displayEmpty
            >
              {generos.map((genero) => (
                <MenuItem key={genero} value={genero}>
                  {genero}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.genero}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.plataforma}>
            <InputLabel id="plataforma-label">Plataforma</InputLabel>
            <Select
              labelId="plataforma-label"
              id="plataforma"
              name="plataforma"
              value={form.plataforma}
              label="Plataforma"
              onChange={handleSelectChange}
              displayEmpty
            >
              {plataformas.map((plataforma) => (
                <MenuItem key={plataforma} value={plataforma}>
                  {plataforma}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.plataforma}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.precio}>
            <InputLabel htmlFor="precio">Precio</InputLabel>
            <OutlinedInput
              id="precio"
              name="precio"
              label="Precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <FormHelperText>{errors.precio}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.stock}>
            <InputLabel htmlFor="stock">Stock</InputLabel>
            <OutlinedInput
              id="stock"
              name="stock"
              label="Stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <FormHelperText>{errors.stock}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.imagen}>
            <InputLabel htmlFor="imagen">Imagen URL</InputLabel>
            <OutlinedInput
              id="imagen"
              name="imagen"
              label="Imagen URL"
              value={form.imagen}
              onChange={handleChange}
            />
            <FormHelperText>{errors.imagen}</FormHelperText>
          </FormControl>

          <Button type="submit" variant="contained" color="primary">
            Insertar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}