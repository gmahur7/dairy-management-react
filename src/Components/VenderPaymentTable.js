import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminState } from '../Context/ContextApi'
import Api_Url from '../env'
import NavBar from './NavBar'

const VenderPaymentTable = () => {
    const navigate = useNavigate()
    const { token } = AdminState()
    const params = useParams()
    const { id } = params
    const [data, setData] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState(false)
    const [TotalAmount, setTotalAmount] = useState(0)
    const [TotalPaid, setTotalPaid] = useState(0)
    const [TotalQuantity, setTotalQuantity] = useState(0)
    const [UnpaidAmount, setUnpaidAmount] = useState(0)
    const [fetchError, setFetchError] = useState(false)

    const getData = async () => {
        try {
            let result = await fetch(`${Api_Url}/api/payment/vender/done`, {
                method: 'Post',
                body: JSON.stringify({ VenderId: id }),
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
            else if (result.msg) {
                throw new Error(result.msg)
            }
            else {
                throw new Error("Record Not Found")
            }
        } catch (error) {
            setData([])
            setFetchError(error.message)
        }
    }

    const getDatafromDateTodate = async () => {
        if (!startDate || !endDate) {
            setError(true)
            return;
        }
        try {
            let result = await fetch(`${Api_Url}/api/payment/vender/datetodate`, {
                method: 'Post',
                body: JSON.stringify({ VenderId: id, startDate, endDate }),
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
            else if (result.msg) {
                throw new Error(result.msg)
            }
            else {
                throw new Error("Record Not Found")
            }
        } catch (error) {
            setData([])
            setFetchError(error.message)
        }
    }

    const getTotals = (data) => {
        let amount = data.reduce((acc, item) => {
          return acc + parseFloat(item.TotalAmount);
        }, 0);
        setTotalAmount(amount);
      
        let qty = data.reduce((acc, item) => {
          return acc + parseFloat(item.TotalQuantity);
        }, 0);
        setTotalQuantity(qty);
      
        let amt = data.reduce((acc, item) => {
          return acc + parseFloat(item.UnpaidAmount);
        }, 0);
        setUnpaidAmount(amt);
      
        let paid = data.reduce((acc, item) => {
          return acc + parseFloat(item.PaidAmount);
        }, 0);
        setTotalPaid(paid);
      };
      function printTable() {
        const printWindow = window.open('', '_blank');
        const table = document.getElementById('payment-table');
        const venderName = document.getElementById('payment-vender');
      
        const printDoc = printWindow.document;
        const printStyle = printDoc.createElement('style');
        printStyle.innerHTML = `
          /* Print-specific styles */
          @media print {
            #payment-table {
              font-size: 10px; /* Adjust the font size to make the table smaller */
              width: 80%; /* Adjust the table width */
              text-align: center;
            }
      
            /* Style for the inner table */
            #payment-table td table {
              font-size: 8px; /* Adjust the font size for the inner table */
            }
      
            /* Add any other print-specific styles you need */
          }
        `;
        printDoc.head.appendChild(printStyle);
      
        const venderNameClone = venderName.cloneNode(true);
        printDoc.body.appendChild(venderNameClone);
      
        const tableClone = table.cloneNode(true);
        printDoc.body.appendChild(tableClone);
      
        printWindow.print();
        printWindow.close();
      }


    useEffect(() => {
        if (!id) navigate('/vendertable')
        getData()
    }, [token])

    useEffect(() => {
        getTotals(data)
    }, [data])

    return (
        <>
            <NavBar />
            <div id="payment">
                <div>
                    <h2 id='payemnt-heading'>Vender Payment Table</h2>
                </div>
                <div>
                    <h3 id="payment-vender">Name : {data[0]?.Vender?.Name}</h3>
                    <button id="payment-table-btn" onClick={printTable}>Print</button>
                </div>
                <div id="vender-date2date">
                    <div>
                        <label>Select Start Date : </label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        {error && !startDate && <p>Please Select Start Date First</p>}
                    </div>
                    <div>
                        <label>Select End Date : </label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        {error && !endDate && <p>Please Select End Date First</p>}
                    </div>
                    <button onClick={getDatafromDateTodate}>Get Entries</button>
                </div>
                {
                    data &&
                    <table id="payment-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Payment Date</th>
                                <th>
                                    <th>Date</th>
                                    <th>Shift</th>
                                    <th>Fat</th>
                                    <th>FatPass</th>
                                    <th>Rate</th>
                                    <th>Quantity</th>
                                    <th>Net Amount</th>
                                    <th>Payment</th>
                                </th>
                                <th>Total Quantity</th>
                                <th>Total Amount</th>
                                <th>Paid Amount</th>
                                <th>UnPaid Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 &&
                                data.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.PaymentDate}</td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    {item.Payments.map((payment) => (
                                                        <tr key={payment._id}>
                                                            <td>{payment.DateDetail}</td>
                                                            <td>{payment.Shift}</td>
                                                            <td>{payment.Fat}</td>
                                                            <td>{payment.FatPass}</td>
                                                            <td>{payment.Rate}</td>
                                                            <td>{payment.Quantity}</td>
                                                            <td>{payment.NetAmount}</td>
                                                            <td>{payment.Payment}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                        <td>{item.TotalQuantity}</td>
                                        <td>{item.TotalAmount}</td>
                                        <td>{item.PaidAmount}</td>
                                        <td>{item.UnpaidAmount}</td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td colSpan={3}>Totals = </td>
                                <td>{TotalQuantity} </td>
                                <td>{TotalAmount} </td>
                                <td>{TotalPaid} </td>
                                <td>{UnpaidAmount} </td>
                            </tr>
                        </tbody>
                    </table>
                }
                {
                    fetchError && <p className="fetchError">{fetchError}</p>
                }
            </div>
        </>
    )
}

export default VenderPaymentTable