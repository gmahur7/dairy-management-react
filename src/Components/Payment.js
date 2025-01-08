import React, { useEffect, useState } from 'react'
import { AdminState } from '../Context/ContextApi'
import { useNavigate, useParams } from 'react-router-dom'
import Api_Url from '../env'

const Payment = () => {
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params;
    const { token, toPaymentIds } = AdminState()
    const [error, setError] = useState(false)
    const [doneError, setDoneError] = useState(false)
    const [done, setDone] = useState(false)
    const [fetchError, setFetchError] = useState(true)
    const [Details, setDetails] = useState([])
    const [TotalAmount, setTotalAmount] = useState(0)
    const [PaidAmount, setPaidAmount] = useState(0)

    const fetchEntries = async () => {
        try {
            let data = await fetch(`${Api_Url}/api/milkentry/entries`, {
                method: 'post',
                body: JSON.stringify({ ids: toPaymentIds }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            data = await data.json()
            if (data.length > 0) {
                getTotalAmount(data)
                setDetails(data)
                setFetchError(false)
            }
            else throw new Error(data.msg)
        } catch (error) {
            setFetchError(error.message)
        }
    }

    const payment = async () => {
        if (!TotalAmount || !PaidAmount || !id || !toPaymentIds.length > 0) {
            setError(true)
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/payment/${id}`, {
                    method: 'post',
                    body: JSON.stringify({ TotalAmount, PaidAmount, PaymentArray: toPaymentIds }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                result = await result.json()
                if (result.msg === 'Recorded Successfully') {
                    setDoneError(false)
                    setDone(true)
                    setTimeout(() => {
                        navigate(`/vender/${id}`)
                    })
                }
                else throw new Error("Something Went Wrong, Try After Some Time")
            } catch (error) {
                setDoneError(true)
                setDone(true)
            }
        }
    }

    const getTotalAmount = (milkData) => {
        let amount = milkData.reduce((acc, item) => {
            return acc + Number.parseFloat(item.NetAmount);
        }, 0)
        setTotalAmount(amount)
    }

    useEffect(() => {
        if (!toPaymentIds.length > 0) {
            navigate('/vendertable')
        }
        fetchEntries()
    }, [token])

    return (
        <div className='container-fluid bg-main text-white py-3'>
            <div className='container mt-5 p-5 bg-sec rounded'>
                <div className='text-center pb-3'>
                    <h1>Payment : <span className='text-main'> {Details.length > 0 && Details[0].Vender.Name}</span></h1>
                </div>
                {
                    !fetchError &&
                    <div className=''>
                        <div>
                            <div className="mb-1">
                                <label id="inputGroup-sizing-default">
                                Total Amount 
                                </label>
                                <input
                                    aria-label="Default"
                                    aria-describedby="inputGroup-sizing-default"
                                    type="number"
                                    value={TotalAmount}
                                />
                            </div>
                            {error && !TotalAmount && <p className='text-danger'>Total Amount is Not Avilable.</p>}
                        </div>
                        <div>
                            <div className="mb-1 mt-3">
                                <label>₹</label>
                                <input type='number' aria-label="Amount (to the nearest dollar)" onChange={(e) => setPaidAmount(e.target.value)} />
                                <label>.0</label>
                            </div>
                            {error && !PaidAmount && <p className='text-danger'>Please Enter Paid Amount.</p>}
                        </div>
                        <div className='mt-3'>
                            <button variant='success' className='px-4' onClick={payment}>Payment</button>
                        </div>
                    </div>
                }
                <div id="payment-tab-fetch">
                    {
                        fetchError && <h4>{fetchError}</h4>
                    }
                    {
                        done && <h4>Payment Record Successfully</h4>
                    }
                    {
                        doneError && <h4>{doneError}</h4>
                    }
                </div>
            </div>
        </div>
    )
}

export default Payment