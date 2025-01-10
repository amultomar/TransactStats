import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/products',
});

export const fetchTransactions = (month, page = 1, perPage = 10, search = '') =>
  api.get('/', { params: { month, page, perPage, search } });

export const fetchStatistics = (month) =>
  api.get('/statistics', { params: { month } });

export const fetchBarChartData = (month) =>
  api.get('/bar-chart', { params: { month } });

export const fetchPieChartData = (month) =>
  api.get('/pie-chart', { params: { month } });

export const fetchCombinedData = (month) =>
  api.get('/combined', { params: { month } });
