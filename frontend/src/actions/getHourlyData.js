import axios from 'axios';

const getHourlyData = ({ start, end }) => dispatch => {
  axios.get(`http://localhost/api/hourly?start=${start}&end=${end}`).then((response) => {
    console.log('get hourly data', response.data);
    dispatch({ type: 'hourly-data', data: response.data });
  }).catch((error) => {
    console.log('get hourly data error', error);
  });
};

export default getHourlyData;
