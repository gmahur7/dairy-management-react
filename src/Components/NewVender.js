import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api_Url from '../env'
import { AdminState } from '../Context/ContextApi'
import Header from './Header'
import { ToastContainer, toast } from 'react-toastify'
import { Button, InputGroup } from 'react-bootstrap'

const NewVender = () => {
    const { token } = AdminState()
    const navigate = useNavigate()
    const [Name, setName] = useState('')
    const [Fat, setFat] = useState('')
    const [Rate, setRate] = useState('')
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [error, setError] = useState(false)

    const submit = async (e) => {
        e.preventDefault();
        if (!Name || !Fat || !Rate) {
            setError(true)
            toast.error("Please Fill All The Fields")
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/vender`, {
                    method: 'post',
                    body: JSON.stringify({ Name, FatPass: Fat, Rate }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                result = await result.json()
                if (result.msg === 'Successfull') {
                    toast.success("Vendor Added Successfully.")
                    setTimeout(() => {
                        reset()
                        navigate(0)
                    }, 2000)
                }
                else {
                    throw new Error("Submit Failed.")
                }
            }
            catch (err) {
                toast.error(err.message)
            }
        }
    }

    function reset() {
        setName('')
        setFat('')
        setSuccess(false)
        setFail(false)
        setError(false)
    }

    return (
        <Fragment>
            <div className='container-fluid bg-main text-white'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-md-6 col-sm-12 col-xs-12'>
                            <div className='card bg-dark mt-4 p-3'>
                                <div className='card-header fs-3 bg-main text-info '>Add Vender</div>
                                <div className='card-body'>
                                    <form onSubmit={submit}>
                                        <div className='form-group mb-3'>
                                            <label htmlFor='name' className='text-white'>Name</label>
                                            <input type='text' className='form-control' id='name' placeholder='Enter Name
                                            ' value={Name} onChange={e => setName(e.target.value)} />
                                            <small className='text-danger'>{error.name}</small>
                                        </div>
                                        <div className='form-group mb-3'>
                                            <label htmlFor='fat' className='text-white'>Fat Pass</label>
                                            <input type='number' className='form-control' id='fat' placeholder='Enter Fat Pass
                                            ' value={Fat} onChange={e => setFat(e.target.value)} />
                                            <small className='text-danger'>{error.name}</small>
                                        </div>
                                        <div className='form-group mb-4'>
                                            <label htmlFor='name' className='text-white'>Rate</label>
                                            <input type='number' className='form-control' id='rate' placeholder='Enter Rate
                                            ' value={Rate} onChange={e => setRate(e.target.value)} />
                                            <small className='text-danger'>{error.name}</small>
                                        </div>
                                        <div className='d-flex gap-4'>
                                            <Button type='submit' className='btn btn-primary btn-main'>Submit</Button>
                                            <Button type='reset' className='btn btn-danger' onClick={reset}>Reset</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </Fragment>
    )
}

export default NewVender;