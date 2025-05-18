import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Typography, Tabs, Tab, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import EnhancedTable from './Table';
import NewGame from './NewGame';
import RankingTable from './RankingTable';
import SearchByName from './SearchByName';
import { BACKEND_URL } from '../config';
import Stack from '@mui/material/Stack';

export default function GamesList() {
    
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [rows, setRows] = useState<GameData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState(0);

    const [ranking, setRanking] = useState<RankingData[]>([]);

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

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/juegos/ranking`);
                if (!response.ok) throw new Error('Error fetching ranking');
                const data = await response.json();
                setRanking(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchRanking();
    }, [tab]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <div>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleOpen}>
                    Agregar Juego
                </Button>
                <SearchByName setRows={setRows} />
            </Stack>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label="Todos los Juegos" />
                    <Tab label="Ranking" />
                </Tabs>
            </Box>
            {tab === 0 && <EnhancedTable rows={rows} />}
            {tab === 1 && <RankingTable rows={rows} ranking={ranking} />}
            <NewGame open={open} handleClose={handleClose} rows={rows} setRows={setRows} />
        </div>
    );
}