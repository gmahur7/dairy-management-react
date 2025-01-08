import React, { useEffect, useState } from 'react'
import Api_Url from '../env'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminState } from '../Context/ContextApi'
import VenderLastDaysChart from './VenderLastDaysChart'

const VenderDetail = () => {
    const navigate = useNavigate()
    const { token, setToPaymentIds } = AdminState()
    const params = useParams()
    const { id } = params
    const [data, setData] = useState({})
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState(false)
    const [displayChart, setDisplayChart] = useState(false)
    const [chartBase, setChartBase] = useState('')
    const [milkData, setMilkData] = useState([])
    const [TotalAmount, setTotalAmount] = useState(0)
    const [TotalQuantity, setTotalQuantity] = useState(0)
    const [fetchError, setFetchError] = useState(false)
    const [colSpan, setColSpan] = useState(() => {
        if (window.innerWidth > 576) {
            return 6;
        }
        return 4;
    })

    const getData = async () => {
        try {
            let result = await fetch(`${Api_Url}/api/vender/venderdetail/${id}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            result = await result.json()
            if (result) {
                setFetchError(false)
                setData(result)
                setMilkData(result.MilkDetail)
            }
            else throw new Error("Data Not Found")
        } catch (error) {
            setFetchError(error.message)
        }
    }

    const getTotalAmount = (milkData) => {
        let amount = milkData.reduce((acc, item) => {
            return acc + Number.parseFloat(item.NetAmount);
        }, 0)
        setTotalAmount(amount)

        let qty = milkData.reduce((acc, item) => {
            return acc + Number.parseFloat(item.Quantity);
        }, 0)
        setTotalQuantity(qty)
    }

    const gotoPayment = () => {
        let milkentries = milkData.map((item) => {
            return item._id
        })
        setToPaymentIds(milkentries)
        navigate(`/payment/${data._id}`)
    }

    const lastentries = async (days) => {
        try {
            let result = await fetch(`${Api_Url}/api/vender/venderdetail/lastdaysentries`, {
                method: 'post',
                body: JSON.stringify({ venderId: id, days }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            result = await result.json()
            if (result.length > 0) {
                setFetchError(false)
                setMilkData(result)
            }
            else throw new Error("Data Not Found")
        } catch (error) {
            setMilkData([])
            setFetchError(error.message)
        }
    }

    const dateToDate = async () => {
        if (!startDate || !endDate) setError(true)
        else {
            try {
                let result = await fetch(`${Api_Url}/api/vender/venderdetail/notpayment/datetodateentries/`, {
                    method: 'post',
                    body: JSON.stringify({ venderId: id, startDate, endDate }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                result = await result.json()

                if (result.length > 0) {
                    setFetchError(false)
                    setMilkData(result)
                }
                else throw new Error("Data Not Found")
            } catch (error) {
                setMilkData([])
                setFetchError(error.message)
            }
        }
    }

    const allPayments = () => {
        navigate(`/vender/payments/${id}`)
    }

    const allEntries = () => {
        navigate(`/vender/all/${id}`)
    }

    function printTable() {
        const printWindow = window.open('', '_blank');
        const printDoc = printWindow.document;

        // Create a div to contain the content to print
        const printContent = printDoc.createElement('div');

        // Create styles for printing
        const printStyle = printDoc.createElement('style');
        printStyle.innerHTML = `
            /* Print-specific styles */
            @media print {
                #vender-data-table {
                    font-size: 10px; /* Adjust the font size to make the table smaller */
                    width: 100%; /* Adjust the table width */
                    text-align: center;
                }
    
                /* Add any other print-specific styles you need */
            }
        `;
        printDoc.head.appendChild(printStyle);

        // Create elements for vender name, total quantity, total amount, and date range
        const venderName = document.getElementById('vender-name').cloneNode(true);
        const totalQuantity = document.createElement('p');
        totalQuantity.textContent = `Total Quantity: ${TotalQuantity} Kg`;
        const totalAmount = document.createElement('p');
        totalAmount.textContent = `Total Amount: Rs. ${TotalAmount} /-`;
        const dateRange = document.createElement('p');
        if (milkData.length > 0) {
            dateRange.textContent = `From: ${milkData[0].DateDetail} 
            To: ${milkData[milkData.length - 1].DateDetail}`;
        }

        // Append elements to the print content
        printContent.appendChild(venderName);
        printContent.appendChild(totalQuantity);
        printContent.appendChild(totalAmount);
        printContent.appendChild(dateRange);

        // Append the print content to the print document body and print
        printDoc.body.appendChild(printContent);
        printWindow.print();
        printWindow.close();
    }

    // function printTable() {
    //     const printWindow = window.open('', '_blank');
    //     const printDoc = printWindow.document;
    //     const printContent = printDoc.createElement('div');
    //     const printStyle = printDoc.createElement('style');
    //     printStyle.innerHTML = `
    //         /* Print-specific styles */
    //         @media print {
    //             #vender-data-table {
    //                 font-size: 10px; /* Adjust the font size to make the table smaller */
    //                 width: 100%; /* Adjust the table width */
    //                 text-align: center;
    //             }

    //             /* Add any other print-specific styles you need */
    //         }
    //     `;
    //     printDoc.head.appendChild(printStyle);
    //     const venderName = document.getElementById('vender-name').cloneNode(true);
    //     const totalQuantity = document.createElement('p');
    //     totalQuantity.textContent = `Total Quantity: ${TotalQuantity} Kg`;
    //     const totalAmount = document.createElement('p');
    //     totalAmount.textContent = `Total Amount: Rs. ${TotalAmount} /-`;
    //     const dateRange = document.createElement('p');
    //     if (milkData.length > 0) {
    //         dateRange.textContent = `From: ${milkData[0].DateDetail} To: ${milkData[milkData.length - 1].DateDetail}`;
    //     }

    //     // Append elements to the print content
    //     printContent.appendChild(venderName);
    //     printContent.appendChild(totalQuantity);
    //     printContent.appendChild(totalAmount);
    //     printContent.appendChild(dateRange);

    //     // Append the print content to the print document body and print
    //     printDoc.body.appendChild(printContent);
    //     printWindow.print();
    //     printWindow.close();
    //   }

    useEffect(() => {
        const handleColspan = () => {
            if (window.innerWidth > 576) {
                setColSpan(6)
                return;
            }
            setColSpan(4)
        };
        window.addEventListener('resize', handleColspan);
        return () => {
            window.removeEventListener('resize', handleColspan);
        };
    }, []);

    useEffect(() => {
        getData()
    }, [token])

    useEffect(() => {
        getTotalAmount(milkData)
    }, [milkData])
    
    return (
        <div className='container-fluid bg-main text-white min-h-auto pb-10'>
            <div className='container d-flex flex-column flex-sm-row align-items-center justify-content-between pb-1 pb-sm-4 pt-2 gap-3'>
                <div className='bg-secondary px-4 rounded-2 py-1'>
                    <h2 className='text-warning fs-3'>{data && data.Name}</h2>
                </div>
                <div className='d-flex flex-row gap-sm-2 justify-content-between gap-2 gap-sm-5 px-1'>
                    <button variant='primary' onClick={printTable}>Print</button>
                    <button variant='primary' onClick={allPayments}>Check Payments</button>
                    <button variant='primary' onClick={allEntries}>All Entries</button>
                </div>
            </div>
            <div className="container pt-4 d-flex justify-content-center flex-column align-items-center">
                <div className=' bg-sec container d-flex justify-content-between flex-column align-items-center py-4 rounded-3'>
                    <div className='mb-3 d-flex gap-1 gap-md-5'>
                        <button variant='primary' onClick={() => getData()}>All Entries</button>
                        <button variant='primary' onClick={() => lastentries(7)}>7 Days Entries</button>
                        <button variant='primary' onClick={() => lastentries(15)}>15 Days Entries</button>
                        <button variant='primary' onClick={() => lastentries(30)}>30 Days Entries</button>
                    </div>
                    <div className="input-group flex-nowrap d-flex gap-0 gap-sm-4 px-0 px-sm-5">
                        <input type="date" className="form-control rounded-5 " placeholder="start-date" aria-label="Username" aria-describedby="addon-wrapping" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <input type="date" className="form-control rounded-5 " placeholder="end-date" aria-label="Username" aria-describedby="addon-wrapping" value={endDate} onChange={e => setEndDate(e.target.value)} />

                        <button variant='primary' className='rounded-1' onClick={dateToDate}>Get Entries</button>
                    </div>
                </div>
                {
                    data &&
                    // <div className='bg-custom mt-5 p-5 rounded-2'>
                    <table striped hover className='rounded-5 mt-2' variant='dark'>
                        <thead>
                            <tr>
                                <th className="d-none d-sm-table-cell">S.No</th>
                                <th>Date</th>
                                <th>Shift</th>
                                <th className="d-none d-sm-table-cell">FatPass</th>
                                <th>Fat</th>
                                <th>Rate</th>
                                <th>Qty</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milkData && milkData.length > 0 &&
                                milkData.map((item, index) =>
                                    <tr key={item._id}>
                                        <td className="d-none d-sm-table-cell">{index + 1}</td>
                                        <td>{item.DateDetail}</td>
                                        <td>{item.Shift}</td>
                                        <td className="d-none d-sm-table-cell">{item.FatPass}</td>
                                        <td>{item.Fat}</td>
                                        <td>{item.Rate}</td>
                                        <td>{item.Quantity}</td>
                                        <td>{item.NetAmount}</td>
                                    </tr>
                                )
                            }
                            <tr>
                                <td colSpan={colSpan}>Totals  = </td>
                                <td>{TotalQuantity}</td>
                                <td>{TotalAmount} </td>
                            </tr>
                        </tbody>
                    </table>
                    // </div>
                }
                <div className='container d-flex flex-column flex-sm-row justify-content-between my-2 gap-4 gap-sm-0'>
                    <button className='btn-main' onClick={gotoPayment}>Go To Payment</button>
                    <div className='d-flex gap-2'>
                        {
                            data &&
                            <select size="sm" aria-label="Default select example" onClick={e => setChartBase(e.target.value)}>
                                <option value="">Select Chart Base</option>
                                <option value="Quantity">Quantity</option>
                                <option value="Amount">Amount</option>
                                <option value="Fat">Fat</option>
                            </select>
                        }
                        {data && <button variant='info' onClick={() => displayChart ? setDisplayChart(false) : setDisplayChart(true)}>{displayChart ? 'Remove Chart' : 'Generate Chart'}</button>}
                    </div>
                </div>

            </div>
            {data && displayChart &&
                <div className='container-fluid'>
                    <VenderLastDaysChart data={milkData} type={chartBase} />
                </div>
            }
        </div>
    )
}

export default VenderDetail