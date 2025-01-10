import React, { useEffect, useState } from 'react';
import { fetchPieChartData } from '../api';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchPieChartData(month);
      const chartData = {
        labels: res.data.map(item => item._id),
        datasets: [{
          data: res.data.map(item => item.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
        }],
      };
      setData(chartData);
    };

    loadData();
  }, [month]);

  return <Pie data={data} />;
};

export default PieChart;
