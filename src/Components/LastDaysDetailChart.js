import React, { useEffect, useState } from 'react'
import { AdminState } from '../Context/ContextApi';
import Api_Url from '../env';
import { Bar } from 'react-chartjs-2';

const LastDaysDetailChart = () => {
    const { token } = AdminState();
    const [data, setData] = useState([]);
    const [days, setDays] = useState(7)
    const [displayChart, setDisplayChart] = useState(false)
    const [fetchError, setFetchError] = useState();
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState(false)
    const [page,setPage]=useState(1);
    const [filteredData,setFilteredData]=useState([]);

    const getData = async (days) => {
        try {
            let result = await fetch(`${Api_Url}/api/perday/lastdaysdata`, {
                method: 'post',
                body: JSON.stringify({ days: days }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            result = await result.json();
            console.log(result)
            if (result) {
                setData(result);
            } else {
                setData([{}]);
                setFetchError(false);
                throw new Error(result.msg);
            }
        } catch (error) {
            setFetchError(error.message);
        }
    };

    const dateToDate = async () => {
        if (!startDate || !endDate) setError(true)
        else {
            try {
                let result = await fetch(`${Api_Url}/api/perday/fromdatetodate`, {
                    method: 'post',
                    body: JSON.stringify({ startDate, endDate }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                result = await result.json()
                if (result.length > 0) {
                    setFetchError(false)
                    setData(result)
                }
                else throw new Error(result.msg)
            } catch (error) {
                setData([{}])
                setFetchError(error.message)
            }
        }
    }

    const getDateQuantities = () => {
        const dateQuantities = {};

        if (Array.isArray(data)) {
            data.forEach((dayData) => {
                const { Date, TotalQuantity, Shift } = dayData;

                if (!dateQuantities[Date]) {
                    dateQuantities[Date] = { Morning: 0, Evening: 0 };
                }

                dateQuantities[Date][Shift] += TotalQuantity;
            });
        } else {
            console.warn('Data is not an array');
        }

        return Object.entries(dateQuantities).map(([date, quantities]) => ({
            date,
            totalQuantity: quantities.Morning + quantities.Evening,
            morningQuantity: quantities.Morning,
            eveningQuantity: quantities.Evening,
        }));
    };

    const chartData = {
        labels: getDateQuantities().map((dateData) => dateData.date),
        datasets: [
            {
                label: 'Total Quantity',
                data: getDateQuantities().map((dateData) => dateData.totalQuantity),
                backgroundColor: 'rgba(242, 37, 37, 0.5)',
                borderColor: 'rgba(242, 37, 37, 1)',
                borderWidth: 1,
                barThickness: 30,
                hoverBackgroundColor: 'rgba(242, 37, 37, 0.8)',
            },
            {
                label: 'Morning Quantity',
                data: getDateQuantities().map((dateData) => dateData.morningQuantity),
                backgroundColor: 'rgba(0, 151, 10, 0.5)',
                borderColor: 'rgba(0, 151, 10, 1)',
                borderWidth: 1,
                barThickness: 30,
                hoverBackgroundColor: 'rgba(0, 151, 10, 0.8)',
            },
            {
                label: 'Evening Quantity',
                data: getDateQuantities().map((dateData) => dateData.eveningQuantity),
                backgroundColor: 'rgba(13, 0, 255, 0.5)',
                borderColor: 'rgba(13, 0, 255, 1)',
                borderWidth: 1,
                barThickness: 30,
                hoverBackgroundColor: 'rgba(13, 0, 255, 0.8)',
            },
        ],
    };

    const next = () => {
        if (page < Math.ceil(chartData.labels.length / 5)) {
            setPage(page + 1);
        }
    };
    
    const prev = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };    

    const setDataToChart = () => {
        const startIndex = (page - 1) * 5;
        const endIndex = page * 5;
        setFilteredData(chartData.labels.slice(startIndex, endIndex));
    };

    useEffect(() => {
        getData(days)
    }, [token, days]);

    useEffect(()=>{
        setDataToChart()
    },[page])

    // console.log(chartData)

    return (
        <div className='container-fluid bg-main text-white py-5'>
            <div className='container bg-sec rounded p-4'>
                <div className='text-center text-main mb-4'>
                    <h2>Last {days} Days Detail Chart</h2>
                </div>
                <div className='d-flex gap-3 my-3'>
                    <button onClick={() => setDays(7)}>Last 7 days</button>
                    <button onClick={() => setDays(15)}>Last 15 days</button>
                    <button onClick={() => setDays(30)}>Last 30 days</button>
                </div>
                <div className='d-flex flex-column flex-sm-row align-items-center gap-3 '>
                    <lable
                        controlId="floatingInput"
                        label="Start Date"
                    >
                        <input placeholder="name@example.com" type="date" value={startDate} onChange={e => setStartDate(e.target.value)}  />
                    </lable>
                    <lable
                        controlId="floatingInput"
                        label="End Date"
                       
                    >
                        <input placeholder="name@example.com" type="date" value={endDate} onChange={e => setEndDate(e.target.value)}  />
                    </lable>
                    <button variant='secondary' className='py-3' onClick={dateToDate}>Get Entries</button>
                </div>
                {fetchError && <p className='text-danger fs-5 my-1 text-center'>Server Error, Try After Some Time</p>}
                <div className='d-flex flex-column flex-sm-row gap-0 gap-sm-3 text-danger'>
                    <p className='text-center'>
                        {error && !startDate && <>Please Select Starting Date</>}
                    </p>
                    <p className='text-center'>
                        {error && !endDate && <>Please Select End Date</>}
                    </p>
                </div>
                <div id="last-days-detail-tab-div">
                    <table striped bordered hover variant='dark'>
                        <thead>
                            <tr>
                                <th className="d-none d-sm-table-cell">S.No</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Total Quantity</th>
                                <th>Shift</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={item._id}>
                                    <td className="d-none d-sm-table-cell">{index + 1}</td>
                                    <td>{item.Date}</td>
                                    <td>{item.TotalAmount}</td>
                                    <td>{item.TotalQuantity}</td>
                                    <td>{item.Shift}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div id="last-days-display-chart">
                    {data.length > 0 && <button variant='success' onClick={() => displayChart ? setDisplayChart(false) : setDisplayChart(true)}>{displayChart ? 'Remove Chart' : 'Generate Chart'}</button>}
                </div>
                {data.length > 0 &&
                    displayChart &&
                    <div id="last-days-Bar-chart">
                        <Bar data={{ ...chartData, labels: filteredData }}  />
                        <div className='d-flex justify-content-center gap-5 mt-3'>
                            <button variant='primary' onClick={prev} disabled={page>1?false:true}>Prev</button>
                            <button variant='primary' onClick={next} disabled={page<=Number.parseInt(data.length/5)?false:true}>Next</button>
                        </div>
                    </div>
                }
            </div >
        </div>
    )
}

export default LastDaysDetailChart