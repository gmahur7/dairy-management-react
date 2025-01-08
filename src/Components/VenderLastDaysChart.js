import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data, type }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (data.length === 0) return;
    if (!type) {
      alert("Please Select Chart Type");
      return;
    }
  }, [type, data]);

  // Transform data into formattedData
  const formattedData = data.reduce((acc, entry) => {
    const existingEntry = acc.find(item => item.date === entry.DateDetail);
    if (existingEntry) {
      existingEntry.shifts[entry.Shift] = {
        fat: entry.Fat,
        quantity: entry.Quantity,
        netAmount: entry.NetAmount,
      };
    } else {
      acc.push({
        date: entry.DateDetail,
        shifts: {
          [entry.Shift]: {
            fat: entry.Fat,
            quantity: entry.Quantity,
            netAmount: entry.NetAmount,
          },
        },
      });
    }
    return acc;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = formattedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(formattedData.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={currentItems}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {type === 'Fat' && (
            <>
              <Bar dataKey="shifts.Morning.fat" stackId="a" fill="#8884d8" name="Morning Fat" />
              <Bar dataKey="shifts.Evening.fat" stackId="b" fill="#ff7300" name="Evening Fat" />
            </>
          )}
          {type === 'Quantity' && (
            <>
              <Bar dataKey="shifts.Morning.quantity" stackId="a" fill="#82ca9d" name="Morning Quantity" />
              <Bar dataKey="shifts.Evening.quantity" stackId="b" fill="#a890d3" name="Evening Quantity" />
            </>
          )}
          {type === 'Amount' && (
            <>
              <Bar dataKey="shifts.Morning.netAmount" stackId="a" fill="#ffc658" name="Morning Net Amount" />
              <Bar dataKey="shifts.Evening.netAmount" stackId="b" fill="#4bd6b8" name="Evening Net Amount" />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BarChartComponent;
