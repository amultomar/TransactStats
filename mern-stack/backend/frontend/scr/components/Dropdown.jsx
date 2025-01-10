import React from 'react';

const Dropdown = ({ onChange, selectedMonth }) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <select value={selectedMonth} onChange={(e) => onChange(e.target.value)}>
      {months.map((month, index) => (
        <option key={index} value={month}>{month}</option>
      ))}
    </select>
  );
};

export default Dropdown;
