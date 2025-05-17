import { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import GameFoundModal from './GameFound';
import data from '../../server.json';
import Stack from '@mui/material/Stack';

const BACKEND_URL = data.BACKEND_URL || 'http://localhost:3000';

export default function SearchByName() {
    const [searchName, setSearchName] = useState('');
    const [foundGame, setFoundGame] = useState<GameData | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);

    const handleSearch = async () => {
        if (!searchName.trim()) return;
        try {
            const response = await fetch(`${BACKEND_URL}/juegos/buscar?nombre=${encodeURIComponent(searchName)}`);
            if (!response.ok) throw new Error('Juego no encontrado');
            const data = await response.json();
            setFoundGame(data);
            setSearchOpen(true);
            setSearchError(null);
        } catch (err: any) {
            setSearchError(err.message);
            setFoundGame(null);
        }
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
        setFoundGame(null);
    };

    return (
        <Stack direction="row" spacing={2}>
        <Stack direction="row" spacing={2} sx={{ my: 2 }}>
                <TextField
                    label="Buscar juego por nombre"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <Button variant="outlined" onClick={handleSearch}>
                    Buscar
                </Button>
                </Stack>

                {searchError && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {searchError}
                </Typography>
                )}
                <GameFoundModal
                    open={searchOpen}
                    handleClose={handleSearchClose}
                    game={foundGame}
                />
                {foundGame && (
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Juego encontrado: {foundGame.nombre}
                    </Typography>
                )}
    </Stack>
    )
}