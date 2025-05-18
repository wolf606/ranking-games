import { MouseEvent, ChangeEvent } from "react";

type GameData = {
  id: string;
  nombre: string;
  genero: string;
  plataforma: string;
  precio: number;
  stock: number;
  imagen: string;
};

type Order = 'asc' | 'desc';

interface HeadCell {
  disablePadding: boolean;
  id: keyof GameData;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: MouseEvent<unknown>, property: keyof GameData) => void;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

type FormState = {
  nombre: string;
  genero: string;
  plataforma: string;
  precio: string;
  stock: string;
  imagen: string;
};
type RankingData = {
        key: string;
        value: number;
    };

declare global {
  interface GameData {
    id: string;
    nombre: string;
    genero: string;
    plataforma: string;
    precio: number;
    stock: number;
    imagen: string;
  }
  type Order = 'asc' | 'desc';
  interface HeadCell {
    disablePadding: boolean;
    id: keyof GameData;
    label: string;
    numeric: boolean;
  }
  interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: keyof GameData) => void;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }
  interface EnhancedTableToolbarProps {
    numSelected: number;
  }

  type FormState = {
    nombre: string;
    genero: string;
    plataforma: string;
    precio: string;
    stock: string;
    imagen: string;
  };
  type RankingData = {
          key: string;
          value: number;
      };
}