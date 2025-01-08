import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminState } from '../Context/ContextApi'
import Api_Url from '../env'

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
    const [colSpan, setColSpan] = useState(() => {
        if (window.innerWidth > 576) {
            return 2;
        }
        return 1;
    })

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
            // console.log(result)
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
        const handleColspan = () => {
            if (window.innerWidth > 576) {
                setColSpan(2)
                return;
            }
            setColSpan(1)
        };
        window.addEventListener('resize', handleColspan);
        return () => {
            window.removeEventListener('resize', handleColspan);
        };
    }, [window]);

    useEffect(() => {
        if (!id) navigate('/vendertable')
        getData()
    }, [token])

    useEffect(() => {
        getTotals(data)
    }, [data])

    return (
        <div className='container-fluid min-h-full bg-main text-white py-2' style={{ "minHeight": "100vh" }}>
            <div className='py-4 text-center'>
                <h2 id='payemnt-heading'>Vendor Payment Table</h2>
            </div>
            <div className='container bg-sec rounded p-0 p-sm-5 py-3 py-sm-5'>
                <div className='d-flex justify-content-between'>
                    <h3 className='text-white'>Name : <span className='text-main'>{data[0]?.Vender?.Name}</span></h3>
                    <button variant='secondary' className='px-4' onClick={printTable}>Print</button>
                </div>
                <div className='d-flex flex-column flex-sm-row gap-3 align-items-center mt-2 mb-3'>
                    <label
                        controlId="floatingInput"
                        label="Start Date"

                    >
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </label>
                    {error && !startDate && <p className='text-danger'>Please Select Start Date First</p>}
                    <label
                        controlId="floatingInput"
                        label="End Date"

                    >
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </label>
                    {error && !endDate && <p className='text-danger'>Please Select End Date First</p>}
                    <button variant='primary' className='py-3' onClick={getDatafromDateTodate}>Get Entries</button>
                </div>
                {
                    data &&
                    <table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="d-none d-sm-table-cell">S.No</th>
                                <th>{colSpan===2?'Payment Date':'Date'}</th>
                                <th>{colSpan===2?'Total Quantity':'Quantity'}</th>
                                <th>{colSpan===2?'Total Amount':'Amount'}</th>
                                <th>{colSpan===2?'Paid Amount':'Paid'}</th>
                                <th>{colSpan===2?'Unpaid Amount':'Unpaid'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 &&
                                data.map((item, index) => (
                                    <tr key={item._id}>
                                        <td className="d-none d-sm-table-cell">{index + 1}</td>
                                        <td>{item.PaymentDate}</td>
                                        <td>{item.TotalQuantity}</td>
                                        <td>{item.TotalAmount}</td>
                                        <td>{item.PaidAmount}</td>
                                        <td>{item.UnpaidAmount}</td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td colSpan={colSpan}>Totals = </td>
                                <td>{TotalQuantity} </td>
                                <td>{TotalAmount} </td>
                                <td>{TotalPaid} </td>
                                <td>{UnpaidAmount} </td>
                            </tr>
                        </tbody>
                    </table>
                }
                {
                    fetchError && <p className="fetchError text-center text-danger fs-3">{fetchError}</p>
                }
            </div>
        </div >
    )
}

export default VenderPaymentTable