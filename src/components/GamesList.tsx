import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import EnhancedTable from './Table';
import data from '../../server.json';

const BACKEND_URL = data.BACKEND_URL || 'http://localhost:3000';

export default function GamesList() {
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
        <EnhancedTable rows={rows} />
    );
}