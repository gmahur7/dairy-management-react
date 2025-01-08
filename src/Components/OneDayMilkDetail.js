import React, {  useState } from 'react';
import { AdminState } from '../Context/ContextApi';
import Api_Url from '../env';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { toast, ToastContainer } from 'react-toastify';

const OneDayMilkDetail = () => {
  const { token } = AdminState();
  const [data, setData] = useState('');
  const [date, setDate] = useState('');
  const [displayChart, setDisplayChart] = useState(false)

  const getData = async (date) => {
    if (date) {
      try {
        let result = await fetch(`${Api_Url}/api/perday/`, {
          method: 'post',
          body: JSON.stringify({ date }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        result = await result.json();
        console.log(result)
        if (!result.msg) {
          setData(result);
        } else {
          setData({});
          throw new Error(result.msg);
        }
      } catch (error) {
        toast.error("Failed to fetch data.")
      }
    }
  };

  // useEffect(() => { }, [token]);

  const getVendorQuantities = () => {
    const vendorQuantities = {};
    data.MilkDetails?.forEach((detail) => {
      const { Vender, Shift, Quantity } = detail;
      const vendorName = Vender.Name;

      if (!vendorQuantities[vendorName]) {
        vendorQuantities[vendorName] = { M: 0, E: 0 };
      }
      if (Shift === "M") {
        vendorQuantities[vendorName].M += Quantity;
      } else if (Shift === "E") {
        vendorQuantities[vendorName].E += Quantity;
      }
    });

    return Object.entries(vendorQuantities).map(([vendor, quantities]) => ({
      vendor,
      quantity: quantities.M + quantities.E,
      morningQuantity: quantities.M,
      eveningQuantity: quantities.E,
    }));
  };

  const chartData = {
    labels: getVendorQuantities().map((vendorData) => vendorData.vendor),
    datasets: [
      {
        label: 'Total Quantity',
        data: getVendorQuantities().map((vendorData) => vendorData.quantity),
        backgroundColor: 'rgba(35, 1, 178, 0.2)',
        borderColor: 'rgba(35, 1, 178, 1)',
        borderWidth: 1,
        barThickness: 30, // Set the thickness of each bar
        hoverBackgroundColor: 'rgba(134, 192, 192, 0.5)',
      },
      {
        label: 'Morning Quantity',
        data: getVendorQuantities().map((vendorData) => vendorData.morningQuantity),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: 'Evening Quantity',
        data: getVendorQuantities().map((vendorData) => vendorData.eveningQuantity),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  return (
    <>
    <div className='container-fluid bg-main text-white'>
      <div className='container mx-auto'>
        <div id="one-day-comp">
          <div className='card bg-dark mt-4 p-3'>
            <div className='card-header fs-3 bg-main text-info '>One Day Detail</div>
            <div className='card-body'>
              <form>
                <div className='form-group mb-3'>
                  <label htmlFor='name' className='text-white'>Date</label>
                  <input type='date' className='form-control' id='name' placeholder='Enter Date' value={date} onChange={e => setDate(e.target.value)} />
                  {/* <small className='text-danger'>{error.name}</small> */}
                </div>
                { data.TotalAmount && data.TotalQuantity&&
                  <div>
                    <div className='form-group mb-3'>
                      <label htmlFor='fat' className='text-white'>Total Quantity</label>
                      <input type='number' className='form-control' id='fat' placeholder='Total Quantity' value={data.TotalQuantity} />
                      {/* <small className='text-danger'>{error.name}</small> */}
                    </div>
                    <div className='form-group mb-4'>
                      <label htmlFor='amt' className='text-white'>Total Amount</label>
                      <input type='number' className='form-control' id='amt' placeholder='Total Amount' value={data.TotalAmount} />
                      {/* <small className='text-danger'>{error.name}</small> */}
                    </div>
                  </div>
                }
                <div className='d-flex gap-4'>
                  <button className='btn btn-primary btn-main' onClick={()=>getData(date)}>Get Data</button>
                  {data && <button onClick={() => displayChart ? setDisplayChart(false) : setDisplayChart(true)}>{displayChart ? 'Remove Chart' : 'Generate Chart'}</button>}
                </div>
              </form>
            </div>
          </div>
          {data && displayChart &&
            <div id="one-day-bar-chart">
              <div className="chart">
                <Bar data={chartData} />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
      <ToastContainer/>
    </>
  );
};

export default OneDayMilkDetail;