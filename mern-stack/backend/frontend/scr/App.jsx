import React, { useState } from 'react';
import Dropdown from './components/Dropdown';
import Table from './components/Table';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [month, setMonth] = useState('Mar');

  return (
    <div>
      <Dropdown selectedMonth={month} onChange={setMonth} />
      <Table month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
  );
};

export default App;
