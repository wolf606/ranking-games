import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import EnhancedTable from './Table';
import NewGame from './NewGame';
import SearchByName from './SearchByName';
import data from '../../server.json';
import Stack from '@mui/material/Stack';

const BACKEND_URL = data.BACKEND_URL || 'http://localhost:3000';

export default function GamesList() {
    
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [rows, setRows] = useState<GameData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    


    useEffect(() => {
    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/juegos`);
            if (!response.ok) throw new Error('Error fetching games');
            const data = await response.json();
            setRows(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };
        fetchGames();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleOpen}>
                    Agregar Juego
                </Button>
                <SearchByName />
            </Stack>
            <EnhancedTable rows={rows} />
            <NewGame open={open} handleClose={handleClose} rows={rows} setRows={setRows} />
        </div>
    );
}