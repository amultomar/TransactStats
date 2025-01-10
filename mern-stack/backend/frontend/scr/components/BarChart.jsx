import React, { useEffect, useState } from 'react';
import { fetchBarChartData } from '../api';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchBarChartData(month);
      const chartData = {
        labels: res.data.map(item => item._id),
        datasets: [{
          label: 'Items in Price Range',
          data: res.data.map(item => item.count),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth : 1,
        }],
      };
      setData(chartData);
    };

    loadData();
  }, [month]);

  return <Bar data={data} />;
};

export default BarChart;
