import React, { useEffect, useState } from 'react'
import Api_Url from '../env'
import { AdminState } from '../Context/ContextApi'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

const SetRateFatPass = () => {
    const params = useParams();
    const { id } = params;
    const navigate = useNavigate()
    const { token } = AdminState()
    const [data, setData] = useState({})
    const [Name, setName] = useState('')
    const [Rate, setRate] = useState('')
    const [FatPass, setFatPass] = useState('')
    const [error, setError] = useState(false)
    const [fetchError, setFetchError] = useState(false)

    function isEmpty(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }


    const getData = async () => {
        try {
            let result = await fetch(`${Api_Url}/api/vender/id/${id}`, {
                method: "get",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            result = await result.json()

            if (result.Name) {
                setName(result.Name)
                setFatPass(result.FatPass)
                setRate(result.Rate)
                setData({ ...result })
                setFetchError(false)
            }
            else if (result.msg === 'Invalid Vendor ID') {
                setFetchError(true)
                setData({})
                setTimeout(() => {
                    reset()
                    navigate('/vendertable')
                }, 2000)
            }
            else throw new Error("Data Not Found")
        } catch (error) {
            setFetchError(true)
            setError(error.message)
            setData({})
        }
    }

    const update = async (e) => {
        e.preventDefault()
        if (!Name || !FatPass || !Rate) {
            setError(true)
            toast.error("Please Fill All The Fields First")
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/vender/update/${id}`, {
                    method: 'put',
                    body: JSON.stringify({ Name, FatPass, Rate }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                result = await result.json()
                console.log(result)
                if (result.msg === 'Successful') {
                    toast.success("Vendor Updated Successfully")
                    setTimeout(() => {
                        reset()
                        navigate('/vendertable')
                    }, 3000)
                }
                else {
                    throw new Error("Submit Failed.")
                }
            }
            catch (err) {
                toast.error(error.message)
            }
        }
    }

    function reset() {
        setName('')
        setFatPass('')
        setRate('')
        setError(false)
    }

    useEffect(() => {
        if (!id) navigate('/vendertable')
    })

    useEffect(() => {
        getData()
    }, [token, id, navigate])

    return (
        <div className='container-fluid bg-main text-white'>
            <div className="container d-flex flex-column align-items-center">
                {!isEmpty(data) &&
                    <div className='col-md-6 col-sm-12 col-xs-12'>
                            <div className='card bg-dark mt-5 mt-sm-4 p-3'>
                                <div className='card-header fs-3 bg-main text-info text-center'>Update Vendor Details</div>
                                <div className='card-body'>
                                    <form onSubmit={update}>
                                        <div className='form-group mb-3'>
                                            <label htmlFor='name' className='text-white'>Name</label>
                                            <input type='text' className='form-control' id='name' placeholder='Enter Name
                                            ' value={Name} onChange={e => setName(e.target.value)} />
                                            {error&&!Name&&<small className='text-danger pt-1'>Please Fill Name Field</small>}
                                        </div>
                                        <div className='form-group mb-3'>
                                            <label htmlFor='FatPass' className='text-white'>FatPass Pass</label>
                                            <input type='number' className='form-control pt-1' id='FatPass' placeholder='Enter FatPass Pass
                                            ' value={FatPass} onChange={e => setFatPass(e.target.value)} />
                                            {error&&!FatPass&&<small className='text-danger'>Please Fill Fat Pass</small>}
                                        </div>
                                        <div className='form-group mb-4'>
                                            <label htmlFor='name' className='text-white'>Rate</label>
                                            <input type='number' className='form-control' id='rate' placeholder='Enter Rate
                                            ' value={Rate} onChange={e => setRate(e.target.value)} />
                                           {error&&!Rate&& <small className='text-danger pt-1'>Please fill Rate</small>}
                                        </div>
                                        <div className='d-flex gap-4'>
                                            <button type='submit' className='btn btn-primary btn-main'>Submit</button>
                                            <button type='reset' className='btn btn-danger' onClick={reset}>Reset</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    }
                <div id="set-rate-fetch">
                    {fetchError && <p>Invalid Vendor ID</p>}
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default SetRateFatPass