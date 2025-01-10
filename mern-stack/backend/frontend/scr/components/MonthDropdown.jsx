import React from 'react';

const MonthDropdown = ({ selectedMonth, onChange }) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div>
      <select value={selectedMonth} onChange={(e) => onChange(e.target.value)}>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthDropdown;
