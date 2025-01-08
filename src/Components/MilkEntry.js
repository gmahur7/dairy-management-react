import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api_Url from '../env'
import { AdminState } from '../Context/ContextApi'
import { ToastContainer, toast } from 'react-toastify';
import { MdDeleteForever } from 'react-icons/md'
import { RiDeleteBin6Fill } from 'react-icons/ri'

const MilkEntry = () => {
    const token = AdminState()?.token;
    const navigate = useNavigate()
    const [vender, setVender] = useState({})
    const [venderNames, setVenderNames] = useState([])
    const [entries, setEntries] = useState([])
    const [Name, setName] = useState('')
    const [Shift, setShift] = useState('')
    const [DateDetail, setDateDetail] = useState('')
    const [Quantity, setQuantity] = useState('')
    const [Fat, setFat] = useState('')
    const [NetAmount, setNetAmount] = useState('')
    const [Vender_id, setVender_id] = useState('')
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [error, setError] = useState(false)
    const [searchError, setSearchError] = useState(false)
    const [fetchError, setFetchError] = useState(false)
    const [tokenFailed, setTokenFailed] = useState(false)
    const [delError, setDelError] = useState("")


    const getEntries = async () => {
        if (!DateDetail) {
            setDateDetail(getCurrentDate())
            // getEntries()
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/milkentry/entries/today`, {
                    method: 'post',
                    body: JSON.stringify({ DateDetail, Shift }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                result = await result.json()
                if (result.length > 0) {
                    setFetchError(false)
                    setEntries(result)
                }
                else {
                    throw new Error(result.msg)
                }
            } catch (error) {
                setFetchError(true)
                setEntries([])
            }
        }
    }


    const getVenderNames = async (search) => {
        try {
            let result = await fetch(`${Api_Url}/api/vender/names`, {
                method: 'get',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            result = await result.json()
            if (result.length > 0) {
                setVenderNames(result)
                setSearchError(false)
            }
            else {
                throw new Error(result.msg)
            }
        } catch (error) {
            setVenderNames([])
            setSearchError(error.message)
        }
    }

    useEffect(() => {
        getEntries()
    }, [DateDetail, Shift])

    const submit = async () => {
        if (!Vender_id || !DateDetail || !Quantity || !Fat || !Shift || !NetAmount) {
            toast.error("Please All The Fields First.")
            setError(true)
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/milkentry`, {
                    method: 'post',
                    body: JSON.stringify({ Vender: Vender_id, DateDetail, Fat, Quantity, NetAmount, Shift }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                result = await result.json()
                if (result.msg === 'Successful') {
                    toast.success("Entry Added Sucessfully")
                    setTimeout(() => {
                        reset()
                        navigate(0)
                    }, 2000)
                }
                else if (result.msg === "Token Expired") {
                    toast.success("Authorization Failed, Login Again")
                    setTimeout(() => {
                        navigate('/adminlogin')
                        localStorage.removeItem('admin')
                    }, 3000)
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
        document.getElementById('select').value = "";
        setName('')
        setDateDetail(getCurrentDate())
        setShift('')
        setQuantity('')
        setFat('')
        setNetAmount('')
        setVender_id('')
        setSuccess(false)
        setFail(false)
        setError(false)
        setSearchError(false)
        setVender({})
        setNetAmount('')
    }

    function netAmountCalcualtion() {
        if (vender.FatPass > Fat) {
            let Fatless = vender.FatPass - Fat
            let result = (Quantity * Fatless * 1.5) / 10
            result = Quantity - result
            result = result * vender.Rate
            setNetAmount(Number.parseInt(result))
        }
        else {
            let Fatmore = Fat - vender.FatPass
            let result = (Quantity * Fatmore * 1.5) / 10
            result = Number.parseInt(Quantity) + Number.parseInt(result)
            result = result * vender.Rate
            setNetAmount(Number.parseInt(result))
        }
    }

    async function getVenderDetail(id) {
        try {
            if (id) {
                const data = await fetch(`${Api_Url}/api/vender/id/${id}`, {
                    method: 'get',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const jsonData = await data.json()
                setVender(jsonData)
            }
            else {
                throw new Error("Id Is Missing")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        return `${year}-${month}-${day}`;
    }

    const handleVenderSelection = (event) => {
        console.log(event.target.value)
        const selectedVenderName = event.target.value;
        const selectedVender = venderNames.find(vender => vender.Name === selectedVenderName);
        if (selectedVender) {
            setVender_id(selectedVender._id)
        }
    };

    const deleteEntry = async (id) => {
        try {
            let result = await fetch(`${Api_Url}/api/milkentry/entries/delete/${id}`, {
                method: 'delete',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            result = await result.json()
            if (result.msg === 'Entry Deleted Successfully') {
                getEntries()
                setDelError("")
            }
            else {
                throw new Error(result.msg)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (Vender_id) {
            getVenderDetail(Vender_id)
        }
    }, [Vender_id,])

    useEffect(() => {
        if (!Vender_id || !Fat || !Quantity) {
        }
        else {
            netAmountCalcualtion()
        }
    }, [Vender_id, Fat, Quantity, vender])

    useEffect(() => {
        getVenderNames()
        setDateDetail(getCurrentDate())
        getEntries()
    }, [token, navigate])

    useEffect(() => {
        if (entries.length < 0) getEntries()
    }, [])

    return (
        <Fragment>
            <div className='container-fluid bg-main text-light'>
                <div className='flex-grow-1 overflow-auto pt-5 pt-sm-0'>
                    <div className='container-fluid'>
                        <div className="row justify-content-center g-1 sm:px-5">
                            <div className="col-12 col-sm-6 col-md-4">
                                <div className=' text-white text-center py-3 px-1 px-sm-3 px-md-4 border-rside  border-secondary'>
                                    <div id="milk-entry-heading">
                                        <h2>Fill Milk Entry Details : </h2>
                                    </div>
                                    <div id="milk-entry-form">
                                        <div className="form-floating mb-3">
                                            {searchError && <p className="fetch-error">Sorry, Unable To Fetch Vender Names  </p>}
                                            {tokenFailed && <p className="fetch-error">Token Failed, Login Again  </p>}
                                            <input className="form-control" id="floatingInput" type='text' onInput={handleVenderSelection} list='vendername' />
                                            <label htmlFor="floatingInput">Vendor Name</label>
                                            {
                                                venderNames.length > 0 &&
                                                <datalist id="vendername">
                                                    {
                                                        venderNames.map((item, index) =>
                                                            <option key={index} value={item.Name}>{item.Name}</option>
                                                        )
                                                    }
                                                </datalist>
                                            }
                                            {error && !Vender_id && <p className='text-danger text-start'>Please Enter Name </p>}
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input type="date" className="form-control" id="floatingInput" value={DateDetail} onChange={(e) => setDateDetail(e.target.value)} />
                                            <label htmlFor="floatingInput">Date</label>
                                            {error && !DateDetail && <p className='text-danger text-start'>Please Enter Date</p>}
                                        </div>
                                        <div className='mb-3'>
                                            <select className="form-select" aria-label="Default select example" id="select" onChange={e => setShift(e.target.value)}>
                                                <option defaultValue={''} value={''}>Shift</option>
                                                <option alue={'M'}>Morning</option>
                                                <option alue={'E'}>Evening</option>
                                            </select>
                                            {error && !Shift && <p className='text-danger text-start'>Please Select Shift</p>}
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" id="floatingInput1" value={Quantity} onChange={(e) => setQuantity(e.target.value)} type='number' />
                                            <label htmlFor="floatingInput1">Quantity</label>
                                            {error && !Quantity && <p className='text-danger text-start'>Please Enter Quantity </p>}
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" id="floatingInput2" value={Fat} onChange={(e) => setFat(e.target.value)} type='number' />
                                            <label htmlFor="floatingInput2">Fat</label>
                                            {error && !Fat && <p className='text-danger text-start'>Please Enter Fat </p>}
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" id="floatingInput3" value={NetAmount} type='number' readOnly />
                                            <label htmlFor="floatingInput3">Net Amount</label>
                                            {!NetAmount && <p className='text-warning mb-2 text-start'>Wait While NetAmount Is Calculating </p>}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <button onClick={submit} type="button" className="btn btn-primary btn-main">Submit</button>
                                            <button onClick={reset} type="button" className="btn btn-secondary">Reset</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-8 ">
                                <div className=' text-white text-center py-3 border-secondary'>
                                    {
                                        entries.length > 0 &&
                                        <div className="d-flex justify-content-center flex-column ">
                                            <h2 className='text-center'>Today's Entry</h2>
                                            <table className="d-none d-md-block px-lg-5 table table-striped table-hover table-dark">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>S.NO</th>
                                                        <th>Name</th>
                                                        <th>Shift</th>
                                                        <th>Fat Pass</th>
                                                        <th>Fat</th>
                                                        <th>Rate</th>
                                                        <th>Quantity</th>
                                                        <th>NetAmount</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='table-group-divider'>
                                                    {
                                                        entries.map((entry, index) =>
                                                            <tr key={entry._id}>
                                                                <td>{index + 1}</td>
                                                                <td>{entry.Vender.Name}</td>
                                                                <td>{entry.Shift}</td>
                                                                <td>{entry.Vender.FatPass}</td>
                                                                <td>{entry.Fat}</td>
                                                                <td>{entry.Rate}</td>
                                                                <td>{entry.Quantity}</td>
                                                                <td>{entry.NetAmount}</td>
                                                                <td><button variant='danger' size='sm' onClick={() => deleteEntry(entry._id)}><RiDeleteBin6Fill /></button></td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                            <table className="d-md-none table table-striped table-hover table-dark">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Fat</th>
                                                        <th>Rate</th>
                                                        <th>Qty</th>
                                                        <th>N.A</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='table-group-divider'>
                                                    {
                                                        entries.map((entry, index) =>
                                                            <tr key={entry._id}>
                                                                <td>{entry.Vender.Name}</td>
                                                                <td>{entry.Fat}</td>
                                                                <td>{entry.Rate}</td>
                                                                <td>{entry.Quantity}</td>
                                                                <td>{entry.NetAmount}</td>
                                                                <td><button variant='danger' size='sm' onClick={() => deleteEntry(entry._id)}><MdDeleteForever /></button></td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default MilkEntry;