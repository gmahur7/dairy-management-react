import React, { useEffect, useState } from 'react'
import Api_Url from '../env'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminState } from '../Context/ContextApi'
import VenderLastDaysChart from './VenderLastDaysChart'
import NavBar from './NavBar'

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
                    body: JSON.stringify({ venderId: id, startDate,endDate }),
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
        getData()
    }, [token])

    useEffect(() => {
        getTotalAmount(milkData)
    }, [milkData])
    return (
        <>
        <NavBar/>
        <div id="vender">
            <div id="vender-payment-btns">
                <h2 id="vender-name">Name : {data && data.Name}</h2>
                <button onClick={printTable}>Print Table</button>
                <div>
                <button onClick={allPayments}>CheckPayments</button>
                <button onClick={allEntries}>All Milk Entries</button>
                </div>
            </div>
            <div id="vender-fetch-btns">
                <button onClick={() => getData()}>All</button>
                <button onClick={() => lastentries(7)}>Last 7 Days</button>
                <button onClick={() => lastentries(15)}>Last 15 Days</button>
                <button onClick={() => lastentries(30)}>Last 30 Days</button>
            </div>
            <div id="vender-date2date">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                <button onClick={dateToDate}>Get Entries</button>
                <p>
                    {error && !startDate && <>Please Select Starting Date</>}
                    {error && !endDate && <> Please Select Ending Date</>}
                </p>
            </div>
            {
                data &&
                <table id="vender-data-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Shift</th>
                            <th>Fat</th>
                            <th>FatPass</th>
                            <th>Rate</th>
                            <th>Quantity</th>
                            <th>NetAmmount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {milkData && milkData.length > 0 &&
                            milkData.map((item, index) =>
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.DateDetail}</td>
                                    <td>{item.Shift}</td>
                                    <td>{item.Fat}</td>
                                    <td>{item.FatPass}</td>
                                    <td>{item.Rate}</td>
                                    <td>{item.Quantity}</td>
                                    <td>{item.NetAmount}</td>
                                </tr>
                            )
                        }
                        <tr>
                            <td colSpan={6}>Totals  = </td>
                            <td>{TotalQuantity}</td>
                            <td>{TotalAmount} </td>
                        </tr>
                    </tbody>
                </table>
            }
            {
                fetchError && <p className='fetch-error'>{fetchError}</p>
            }
            <button id="vender-to-payment-btn" onClick={gotoPayment}>Go To Payment</button>
            <div id='vender-chart-options'>
                {data && <button onClick={() => displayChart ? setDisplayChart(false) : setDisplayChart(true)}>{displayChart ? 'Remove Chart' : 'Generate Chart'}</button>}
                {
                    data &&
                    <select id="vender-chart-select" onClick={e => setChartBase(e.target.value)}>
                        <option value="">Select Chart Base</option>
                        <option value="Quantity">Quantity</option>
                        <option value="Amount">Amount</option>
                        <option value="Fat">Fat</option>
                    </select>
                }
            </div>
            {data && displayChart &&
                <VenderLastDaysChart data={milkData} type={chartBase} />
            }
        </div>
        </>
    )
}

export default VenderDetail