import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

type RankingTableProps = {
  rows: GameData[];
  ranking: RankingData[];
};

export default function RankingTable({ rows, ranking }: RankingTableProps) {
  const [sortedRows, setSortedRows] = useState<GameData[]>([]);

  useEffect(() => {
    const sorted = [...rows].sort((a, b) => {
      const aRanking = ranking.find((r) => r.key === a.id)?.value || 0;
      const bRanking = ranking.find((r) => r.key === b.id)?.value || 0;
      return bRanking - aRanking;
    });
    setSortedRows(sorted);
  }, [rows, ranking]);

  // Helper to get search count for a row
  const getSearchCount = (id: string | number) =>
    ranking.find((r) => r.key === id)?.value || 0;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="ranking table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Género</TableCell>
            <TableCell>Plataforma</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Imagen</TableCell>
            <TableCell>Busquedas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row, idx) => (
            <TableRow key={row.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.genero}</TableCell>
              <TableCell>{row.plataforma}</TableCell>
              <TableCell>${row.precio}</TableCell>
              <TableCell>{row.stock}</TableCell>
              <TableCell align="right">
                <img src={row.imagen} alt={row.nombre} width="50" />
            </TableCell>
              <TableCell>{getSearchCount(row.id)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}