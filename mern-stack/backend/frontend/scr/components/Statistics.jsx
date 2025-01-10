import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../api';

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalAmount: 0,
    totalSold: 0,
    totalNotSold: 0,
  });

  useEffect(() => {
    const loadStatistics = async () => {
      const res = await fetchStatistics(month);
      setStatistics(res.data);
    };

    loadStatistics();
  }, [month]);

  return (
    <div>
      <h3>Transaction Statistics</h3>
      <div>
        <p>Total Sale Amount: {statistics.totalAmount}</p>
        <p>Total Sold Items: {statistics.totalSold}</p>
        <p>Total Not Sold Items: {statistics.totalNotSold}</p>
      </div>
    </div>
  );
};

export default Statistics;
