import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api_Url from '../env'
import { AdminState } from '../Context/ContextApi'
import NavBar from './NavBar'
import Header from './Header'

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
                    setSuccess(true)
                    setFail(false)
                    setTokenFailed(false)
                    setTimeout(() => {
                        reset()
                        navigate(0)
                    }, 2000)
                }
                else if (result.msg === "Token Expired") {
                    setTokenFailed(true)
                    setSuccess(false)
                    setFail(false)
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
                setTokenFailed(false)
                setSuccess(false)
                setFail(true)
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
        if (id) {
            try {
                const data = await fetch(`${Api_Url}/api/vender/id/${id}`, {
                    method: 'get',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const jsonData = await data.json()
                setVender(jsonData)
            } catch (error) {
                console.error(error)
            }
        } else {
            console.error("Id is null or undefined")
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
            setDelError(error.message)
        }
    }

    useEffect(() => {
        getVenderDetail(Vender_id)
    }, [Vender_id])

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
            <Header className="z-index-5 custom-header" />
            <div className='container-fluid bg-main text-light'>
                <div className='flex-grow-1 overflow-auto pt-5 pt-sm-0'>
                    <div className='container py-4'>
                        <div className="row justify-content-center align-items-center g-1 sm:px-5">
                            <div class="col-12 col-sm-6 ">
                                <div className=' text-white text-center py-3 border-rside border-2  border-secondary'>
                                    <div id="milk-entry-heading">
                                        <h2>Fill Milk Entry Details : </h2>
                                    </div>
                                    <div id="milk-entry-fetch">
                                        {success && <p>Submit Successfully</p>}
                                        {fail && <p>Submit Failed</p>}
                                    </div>
                                    <div id="milk-entry-form">
                                        <div class="form-floating mb-3">
                                            {searchError && <p className="fetch-error">Sorry, Unable To Fetch Vender Names  </p>}
                                            {tokenFailed && <p className="fetch-error">Token Failed, Login Again  </p>}
                                            <input class="form-control" id="floatingInput" type='text' onInput={handleVenderSelection} list='vendername' />
                                            <label for="floatingInput">Vendor Name</label>
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
                                            {error && !Vender_id && <p className='error'>Please Enter Name </p>}
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input type="date" class="form-control" id="floatingInput" value={DateDetail} onChange={(e) => setDateDetail(e.target.value)} />
                                            <label for="floatingInput">Date</label>
                                            {error && !DateDetail && <p className='error'>Please Enter Date</p>}
                                        </div>
                                        <div>
                                            <select class="form-select mb-3" aria-label="Default select example" id="select" onChange={e => setShift(e.target.value)}>
                                                <option selected value={''}>Shift</option>
                                                <option value={'M'}>Morning</option>
                                                <option value={'E'}>Evening</option>
                                            </select>
                                            {error && !Shift && <p className='error'>Please Select Shift</p>}
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="floatingInput" value={Quantity} onChange={(e) => setQuantity(e.target.value)} type='number' placeholder="Quantity" />
                                            <label for="floatingInput">Quantity</label>
                                            {error && !Quantity && <p className='error'>Please Enter Quantity </p>}
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="floatingInput" value={Fat} onChange={(e) => setFat(e.target.value)} type='number' placeholder="Fat" />
                                            <label for="floatingInput">Fat</label>
                                            {error && !Fat && <p className='error'>Please Enter Fat </p>}
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="floatingInput" value={NetAmount} type='number' readOnly />
                                            <label for="floatingInput">Net Amount</label>
                                            {!NetAmount && <p className='text-warning mb-2 '>Wait While NetAmount Is Calculating </p>}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <button onClick={submit} type="button" className="btn btn-primary btn-main">Submit</button>
                                            <button onClick={reset} type="button" className="btn btn-danger">Reset</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 ">
                            <div className=' text-white text-center py-3 border-rside border-2  border-secondary'>
                                {
                                    entries.length > 0 &&
                                    <div id="milk-entry-tab-wrapper">
                                        {delError && <p className='fetch-error'>{delError}</p>}
                                        <h2 id="milk-entry-heading">Todays Entry</h2>
                                        <table id="milk-entry-table">
                                            <thead>
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
                                            <tbody>
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
                                                            <td><button onClick={() => deleteEntry(entry._id)}>Delete</button></td>
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
        </Fragment>
    )
}

export default MilkEntry;