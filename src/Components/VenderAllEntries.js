import React, { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'
import Api_Url from '../env'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminState } from '../Context/ContextApi'
import NavBar from './NavBar'

const VenderAllEntries = () => {
    const navigate = useNavigate()
    const { token, setToPaymentIds } = AdminState()
    const params = useParams()
    const { id } = params
    const [data, setData] = useState({})
    const [milkData, setMilkData] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState(false)
    const [TotalAmount, setTotalAmount] = useState(0)
    const [TotalQuantity, setTotalQuantity] = useState(0)
    const [fetchError, setFetchError] = useState(false)

    const getData = async () => {
        try {
            let result = await fetch(`${Api_Url}/api/vender/venderdetail/all/${id}`, {
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

    const lastentries = async (days) => {
        try {
            let result = await fetch(`${Api_Url}/api/vender/venderdetail/all/lastdaysentries/`, {
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
                #vender-all-entry-table {
                    font-size: 10px; /* Adjust the font size to make the table smaller */
                    width: 80%; /* Adjust the table width */
                    text-align: center;
                }
    
                /* Add any other print-specific styles you need */
            }
        `;
        printDoc.head.appendChild(printStyle);
    
        // Clone vender name element and append to print content
        const venderName = document.getElementById('vender-all-entry-heading').querySelector('h2').cloneNode(true);
        printContent.appendChild(venderName);
    
        // Create elements for total quantity and total amount
        const totalQuantity = printDoc.createElement('p');
        totalQuantity.textContent = `Total Quantity: ${TotalQuantity} Kg`;
        const totalAmount = printDoc.createElement('p');
        totalAmount.textContent = `Total Amount: Rs ${TotalAmount} /-`;
    
        // Append total quantity and total amount to print content
        printContent.appendChild(totalQuantity);
        printContent.appendChild(totalAmount);
    
        // Create element for date range
        const dateRange = printDoc.createElement('p');
        if (milkData.length > 0) {
            const fromDate = milkData[0].DateDetail;
            const toDate = milkData[milkData.length - 1].DateDetail;
            dateRange.textContent = `From: ${fromDate} To: ${toDate}`;
        }
    
        // Append date range to print content
        printContent.appendChild(dateRange);
    
        // Append the print content to the print document body and print
        printDoc.body.appendChild(printContent);
        printWindow.print();
        printWindow.close();
    }

    // function printTable() {
    //     const printWindow = window.open('', '_blank');
    //     const table = document.getElementById('vender-all-entry-table');
    //     const venderName = document.getElementById('vender-all-entry-heading').firstElementChild;
    //     const printDoc = printWindow.document;
    //     const printStyle = printDoc.createElement('style');
    //     printStyle.innerHTML = `
    //       /* Print-specific styles */
    //       @media print {
    //         #vender-all-entry-table {
    //           font-size: 10px; /* Adjust the font size to make the table smaller */
    //           width: 80%; /* Adjust the table width */
    //           text-align: center;
    //         }
      
    //         /* Add any other print-specific styles you need */
    //       }
    //     `;
    //     printDoc.head.appendChild(printStyle);
    //     const venderNameClone = venderName.cloneNode(true);
    //     printDoc.body.appendChild(venderNameClone);
    //     const tableClone = table.cloneNode(true);
    //     printDoc.body.appendChild(tableClone);
    //     printWindow.print();
    //     printWindow.close();
    //   }
    

    const dateToDate = async () => {
        if (!startDate || !endDate) setError(true)
        else {
            try {
                let result = await fetch(`${Api_Url}/api/vender/venderdetail/all/datetodateentries/`, {
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

    useEffect(() => {
        getData()
    }, [token])

    useEffect(() => {
        getTotalAmount(milkData)
    }, [milkData])
    return (
        <>
            <NavBar />
            <div id="vender-all-entry">
                <div id="fetch-error">
                    {
                        fetchError && <p>{fetchError}</p>
                    }
                </div>
                <div id="vender-all-entry-heading">
                    <h2>Name : {data && data.Name}</h2>
                    <button onClick={allPayments}>CheckPayments</button>
                    <button onClick={printTable}>Print Table</button>
                </div>
                <div id="vender-all-entry-btns">
                    <button onClick={() => getData()}>All</button>
                    <button onClick={() => lastentries(7)}>Last 7 Days</button>
                    <button onClick={() => lastentries(15)}>Last 15 Days</button>
                    <button onClick={() => lastentries(30)}>Last 30 Days</button>
                </div>
                <div id="vender-all-entry-date2date">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    <button onClick={dateToDate}>Get Entries</button>
                </div>
                <div id="vender-all-entry-error">
                    <p className='all-entry-error'>
                        {error && !startDate && <>Please Select Starting Date</>}</p>
                    <p className='all-entry-error'>
                        {error && !endDate && <>Please Select Starting Date</>}
                    </p>
                </div>
                <div id="vender-all-entry-tab-wrapper">
                    {
                        data &&
                        <table id="vender-all-entry-table">
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
                                    <td colSpan={6}>Total Amount = </td>
                                    <td>{TotalQuantity} </td>
                                    <td>{TotalAmount} </td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    )
}

// const PrintData = ({ milkData, TotalAmount, TotalQuantity, componentRef }) => {
//     const handlePrint = () => {
//       window.print()
//     }
  
//     return (
//       <div>
//         <div style={{ display: 'none' }}>
//           <div ref={componentRef}>
//             <h2>Milk Data</h2>
//             <table id="vender-all-entry-table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Shift</th>
//                   <th>Fat</th>
//                   <th>FatPass</th>
//                   <th>Rate</th>
//                   <th>Quantity</th>
//                   <th>NetAmount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {milkData.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.DateDetail}</td>
//                     <td>{item.Shift}</td>
//                     <td>{item.Fat}</td>
//                     <td>{item.FatPass}</td>
//                     <td>{item.Rate}</td>
//                     <td>{item.Quantity}</td>
//                     <td>{item.NetAmount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td colSpan={5}>Total</td>
//                   <td>{TotalQuantity}</td>
//                   <td>{TotalAmount}</td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>
//     )
//   }

export default VenderAllEntries;