import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import getHourlyData from "./actions/getHourlyData";
import {useDispatch, useSelector} from "react-redux";
import moment from 'moment';

const Header = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell align="right">Temperature</TableCell>
        <TableCell align="right">CO2&nbsp;</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default function BasicTable() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.data);

  useEffect(() => {
    dispatch(getHourlyData({
      start: moment().add(1, 'day').subtract(1, 'month').format('YYYY-MM-DD'),
      end: moment().add(1, 'day').format('YYYY-MM-DD'),
    }));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <Header/>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.name}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row">
                {moment(row.date).format('D MMMM YYYY HH:mm')}
              </TableCell>
              <TableCell align="right">{parseFloat(row.temperature).toFixed(2)}</TableCell>
              <TableCell align="right">{row.CO2 || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

}


