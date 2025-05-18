import { useState } from 'react';
import { Button, Typography, Switch, FormControlLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import GameFoundModal from './GameFound';
import { BACKEND_URL } from '../config';
import Stack from '@mui/material/Stack';

export default function SearchByName( { setRows }: { setRows: React.Dispatch<React.SetStateAction<GameData[]>> }) {
    const [searchName, setSearchName] = useState('');
    const [foundGame, setFoundGame] = useState<GameData | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const removeGameFromList = (id: string) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }

    const handleSearch = async () => {
        setSuccessMessage(null);
        setSearchError(null);
        setFoundGame(null);

        if (!searchName.trim()) return;
        try {
            let response;
            if (deleteMode) {
                response = await fetch(
                    `${BACKEND_URL}/juegos/eliminar?nombre=${encodeURIComponent(searchName)}`,
                    { method: 'DELETE' }
                );
            } else {
                response = await fetch(
                    `${BACKEND_URL}/juegos/buscar?nombre=${encodeURIComponent(searchName)}`
                );
            }
            if (!response.ok) {
                setSearchError('Juego no encontrado.');
                return;
            }
            const data = await response.json();
            setFoundGame(data);
            setSearchOpen(true);
            if (deleteMode) {
                setSuccessMessage(`Juego eliminado: ${data.nombre}`);
                removeGameFromList(data.id);
            } else {
                setSuccessMessage(`Juego encontrado: ${data.nombre}`);
            }
        } catch (err: any) {
            setSearchError('Ocurrió un error al procesar la solicitud.');
            setFoundGame(null);
        }
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
        setFoundGame(null);
        setSuccessMessage(null);
    };

    return (
        <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                <TextField
                    label={deleteMode ? "Eliminar juego por nombre" : "Buscar juego por nombre"}
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <Button
                    variant="outlined"
                    onClick={handleSearch}
                    color={deleteMode ? "error" : "primary"}
                >
                    {deleteMode ? "Eliminar" : "Buscar"}
                </Button>
                <FormControlLabel
                    control={
                        <Switch
                            checked={deleteMode}
                            onChange={() => setDeleteMode(!deleteMode)}
                            color="error"
                        />
                    }
                    label="Eliminar"
                />
            </Stack>

            {searchError && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {searchError}
                </Typography>
            )}
            {successMessage && (
                <Typography color={deleteMode ? "error" : "primary"} sx={{ mb: 2 }}>
                    {successMessage}
                </Typography>
            )}
            <GameFoundModal
                open={searchOpen}
                handleClose={handleSearchClose}
                game={foundGame}
            />
        </Stack>
    );
}