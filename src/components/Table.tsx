import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';

import EnhancedTableToolbar from './TableToolbar';
import EnhancedTableHead from './TableHead';

import { getComparator } from '../utils/tableUtils';

function chipsGenerosColors(genero: string) {
  switch (genero) {
    case 'Acción':
      return { sx: { backgroundColor: 'rgb(244, 67, 54)', color: '#fff' } }; // Red
    case 'Aventura':
      return { sx: { backgroundColor: 'rgb(33, 150, 243)', color: '#fff' } }; // Blue
    case 'RPG':
      return { sx: { backgroundColor: 'rgb(156, 39, 176)', color: '#fff' } }; // Purple
    case 'Deportes':
      return { sx: { backgroundColor: 'rgb(76, 175, 80)', color: '#fff' } }; // Green
    case 'Simulación':
      return { sx: { backgroundColor: 'rgb(255, 193, 7)', color: '#000' } }; // Amber
    case 'Estrategia':
      return { sx: { backgroundColor: 'rgb(0, 188, 212)', color: '#fff' } }; // Cyan
    default:
      return { sx: { backgroundColor: 'rgb(158, 158, 158)', color: '#fff' } }; // Grey
  }
}

function plataformaIcon(plataforma: string) {
  switch (plataforma) {
    case 'PC':
      return <img src="https://img.icons8.com/color/512/windows-10.png" alt="PC" width="20" style={{ marginRight: '4px' }} />;
    case 'PlayStation':
      return <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/PlayStation_App_Icon.jpg" alt="PlayStation" width="20" style={{ marginRight: '4px' }} />;
    case 'Xbox':
      return <img src="https://static-00.iconduck.com/assets.00/xbox-icon-2048x2048-sg44x0or.png" alt="Xbox" width="20" style={{ marginRight: '4px' }} />;
    case 'Nintendo Switch':
      return <img src="https://cdn-icons-png.flaticon.com/512/871/871377.png" alt="Nintendo Switch" width="20" style={{ marginRight: '4px' }} />;
    case 'Móvil':
      return <img src="https://developer.android.com/static/guide/practices/ui_guidelines/images/adaptive-icon-mask-applied.png" alt="Móvil" width="20" style={{ marginRight: '4px' }} />;
    default:
      return null;
  }
}

export default function EnhancedTable({ rows }: { rows: GameData[] }) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof GameData>('nombre');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof GameData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {row.id}
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.nombre}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={row.genero}
                        {...chipsGenerosColors(row.genero)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{plataformaIcon(row.plataforma)}</TableCell>
                    <TableCell align="right">{"$"}{row.precio}</TableCell>
                    <TableCell align="right">{row.stock}</TableCell>
                    <TableCell align="right">
                      <img src={row.imagen} alt={row.nombre} width="50" />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[4]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
