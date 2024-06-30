import React, { Fragment, useState } from 'react'
import Api_Url from '../env'
import { Link, useNavigate } from 'react-router-dom'
import { AdminState } from '../Context/ContextApi'
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import image from '../Images/Adminlogin.jpeg'
import Header from './Header';

const AdminLogin = () => {
    const { setToken } = AdminState()
    const navigate = useNavigate()
    const [Id, setId] = useState('')
    const [loginDiv, setLoginDiv] = useState(false)
    const [Password, setPassword] = useState('')
    const [inpType, setInpType] = useState('password')
    const [error, setError] = useState(false)
    const [msg, setMsg] = useState(false)

    const login = async () => {
        if (!Id || !Password) {
            setError(true)
            return;
        }
        else {
            try {
                let auth = await fetch(`${Api_Url}/api/admin`, {
                    method: 'post',
                    body: JSON.stringify({ Id, Password }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                auth = await auth.json()
                if (auth.Id && auth.token) {
                    setToken(auth.token)
                    localStorage.setItem('admin', JSON.stringify({ Id: auth.id, token: auth.token }))
                    navigate('/')
                }
                else {
                    throw new Error(auth.msg)
                }
            } catch (error) {
                setMsg(error.message)
            }
        }
    }

    function toforgetpass() {
        setLoginDiv(false)
    }

    // function reset() {
    //     setId('')
    //     setPassword('')
    //     setError(false)
    //     setMsg(false)
    // }

    return (
        <Fragment>
            <Header className="z-index-5 custom-header" />
            <div className='container-fluid bg-main d-flex flex-column'>
                <div className='flex-grow-1 overflow-auto pt-5 pt-sm-0'>
                    <div className='container py-4 border border-2 border-secondary rounded-5'>
                        {loginDiv &&
                            <div className="row justify-content-center align-items-center g-1 sm:px-5">
                                <div class="col-12 col-sm-6 ">
                                    <div className=' text-white text-center py-3 border-rside border-2  border-secondary'>
                                        <img src={image} alt="" className='w-75 w-sm-75 w-md-50' />
                                    </div>
                                </div>
                                <div class="col-12 col-sm-6 px-lg-5">
                                    <div className=' text-white text-center py-3 px-3'>
                                        <div>
                                            <h2 className='text-info'>Admin Login</h2>
                                        </div>
                                        <div className="input-group mb-3 z-index-1">
                                            <span className="input-group-text">@</span>
                                            <div className="form-floating">
                                                <input type="text" className="form-control" id="floatingInputGroup1" placeholder="Username" value={Id} onChange={e => setId(e.target.value)} />
                                                <label for="floatingInputGroup1">Username</label>
                                            </div>
                                        </div>
                                        <div className="form-floating mb-3" style={{ zIndex: 1 }}>
                                            <input className="form-control position-relative" id="floatingPassword" placeholder="Password" type={inpType} value={Password} onChange={e => setPassword(e.target.value)} />
                                            <label for="floatingPassword" style={{ left: "10px" }}>Password</label>
                                            <button type="button" className="btn btn-secondary password-toggle position-absolute top-50 right-5px translate-y-50" onClick={() => inpType === 'text' ? setInpType('password') : setInpType('text')}>{inpType === 'password' ? <BiSolidShow className='text-sec' style={{ fontSize: '25px' }} /> : <BiSolidHide className='text-sec' style={{ fontSize: '25px' }} />}</button>

                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <button onClick={login} type="button" className="btn btn-primary btn-main">Log-In</button>
                                            <Link className='text-main' onClick={toforgetpass} >Forget Password</Link>
                                        </div>
                                        {
                                            msg && <p>{msg}</p>
                                        }
                                    </div>
                                </div>
                            </div>

                        }
                        {
                            !loginDiv &&
                            <ForgetPassword />
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}



const ForgetPassword = () => {
    const navigate = useNavigate()
    const [Id, setId] = useState('')
    const [OTP, setOTP] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [ConfirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(false)
    const [emailDiv, setEmailDiv] = useState(true)
    const [otpDiv, setOtpDiv] = useState(false)
    const [passDiv, setPassDiv] = useState(false)
    const [msg, setMsg] = useState(false)
    const [msg2, setMsg2] = useState(false)
    const [msg3, setMsg3] = useState(false)
    const [passFail, setPassFail] = useState(false)
    const [elqPass, setEqlPass] = useState(false)
    const [passLength, setPassLength] = useState(false)
    const [inpType, setInpType] = useState('password')

    const verify = async () => {
        if (!Id || !Email) {
            setError(true)
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/admin/verify`, {
                    method: 'post',
                    body: JSON.stringify({ Id, Email }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json()
                if (result.msg === "OTP sent to your email successfully") {
                    setOtpDiv(true)
                    setEmailDiv(false)
                    setPassDiv(false)
                    setMsg(false)
                    setMsg2(false)
                    setMsg3(false)
                    setError(false)
                }
                else {
                    throw new Error(result.msg)
                }
            } catch (error) {
                setError(false)
                setEmailDiv(true)
                setOtpDiv(false)
                setPassDiv(false)
                setMsg(error.msg)
                setMsg2(false)
                setMsg3(false)
            }
        }
    }

    function reset() {
        setId('')
        setEmail('')
        setError(false)
        setMsg(false)
    }
    const verifyOTP = async () => {
        if (!OTP || !Id) {
            setError(true)
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/admin/verify/otp`, {
                    method: 'post',
                    body: JSON.stringify({ Id, OTP }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json()
                if (result.msg === "OTP verified successfully") {
                    setPassDiv(true)
                    setOtpDiv(false)
                    setEmailDiv(false)
                    setMsg(false)
                    setMsg3(false)
                    setError(false)
                }
                else {
                    throw new Error(result.msg)
                }
            } catch (error) {
                setEmailDiv(false)
                setOtpDiv(true)
                setMsg(false)
                setMsg3(false)
                setMsg2(true)
                setPassDiv(false)
                setError(false)
            }
        }
    }

    const changePassword = async () => {
        if (!Password || !ConfirmPassword) {
            setError(true)
            setEqlPass(false)
            setPassLength(false)
            return;
        }
        else {
            if (Password !== ConfirmPassword) {
                setEqlPass(true)
                setPassLength(false)
                return;
            }
            if (Password.length < 8) {
                setPassLength(true)
                return;
            }
            try {
                setEqlPass(false)
                setPassLength(false)
                let result = await fetch(`${Api_Url}/api/admin/change/password`, {
                    method: 'post',
                    body: JSON.stringify({ Id, Password }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json()
                if (result.msg === "Password Changed") {
                    setOtpDiv(false)
                    setEmailDiv(false)
                    setMsg(false)
                    setMsg2(false)
                    setError(false)
                    setMsg3(true)
                    setPassFail(false)
                    setTimeout(() => {
                        reset()
                        navigate(0)
                    }, 3000)
                }
                else {
                    throw new Error(result.msg)
                }
            } catch (error) {
                setPassFail(true)
                setEmailDiv(false)
                setOtpDiv(false)
                setMsg(false)
                setMsg2(false)
                setMsg3(true)
                setError(false)
                setTimeout(() => {
                    navigate(0)
                }, 3000)
            }
        }
    }

    return (
        <>
            <div className="row justify-content-center align-items-center g-1 sm:px-5">
                <div class="col-12 col-sm-6 px-lg-5">
                    <div className='text-white text-center py-3 px-3'>
                        <div>
                            {emailDiv&&<h2 className='text-info'>Forget Password</h2>}
                            {otpDiv&&<h2 className='text-info'>Verify OTP</h2>}
                            {passDiv&&<h2 className='text-info'>Change Passowrd</h2>}
                        </div>
                        {emailDiv &&
                            <div>
                                <div>
                                    <p>Enter UserId and E-mail To Confirm Identity</p>
                                </div>
                                <div className="input-group mb-3 z-index-1">
                                    <span className="input-group-text">@</span>
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="floatingInputGroup1" placeholder="Username" value={Id} onChange={e => setId(e.target.value)} />
                                        <label for="floatingInputGroup1">Username</label>
                                    </div>
                                </div>
                                <div className="input-group mb-3 z-index-1">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="floatingInputGroup1" placeholder="E-Mail" value={Email} onChange={e => setEmail(e.target.value)} />
                                        <label for="floatingInputGroup1">E-Mail</label>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between justify-content-sm-around align-items-center">
                                    <button onClick={verify} type="button" className="btn btn-primary btn-main">Submit</button>
                                    <button onClick={() => navigate(0)} type="button" className="btn btn-secondary">Back</button>
                                </div>
                                <div className='pt-3'>
                                {
                                    msg && <p className='text-danger'>{msg}</p>
                                }
                                </div>
                            </div>
                        }
                        {
                            otpDiv &&
                            <div className=''>
                                <div>
                                    <p>OTP has been send to your E-mail {Email}</p>
                                </div>
                                <div className="input-group mb-3 z-index-1">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="floatingInputGroup1" placeholder="OTP" value={OTP} onChange={e => setOTP(e.target.value)} />
                                        <label for="floatingInputGroup1">OTP</label>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between justify-content-sm-around align-items-center">
                                        <button onClick={verifyOTP} type="button" className="btn btn-primary btn-main">Verify</button>
                                        <button onClick={() => navigate(0)} type="button" className="btn btn-secondary">Back</button>
                                    </div>
                                    <div className='pt-3'>
                                        {msg2 && <p className='text-danger'>OTP Verification Failed</p>}
                                    </div>
                            </div>
                        }
                        {
                            passDiv &&
                            <div>
                                <div className="form-floating mb-3" style={{ zIndex: 1 }}>
                                    <input className="form-control position-relative" id="floatingPassword" placeholder="Password" type={inpType} value={Password} onChange={e => setPassword(e.target.value)} />
                                    <label for="floatingPassword" style={{ left: "10px" }}>Password</label>
                                    <button type="button" className="btn btn-secondary password-toggle position-absolute top-50 right-5px translate-y-50" onClick={() => inpType === 'text' ? setInpType('password') : setInpType('text')}>{inpType === 'password' ? <BiSolidShow className='text-sec' style={{ fontSize: '25px' }} /> : <BiSolidHide className='text-sec' style={{ fontSize: '25px' }} />}</button>
                                </div>
                                <div className="form-floating mb-3" style={{ zIndex: 1 }}>
                                    <input className="form-control position-relative" id="floatingPassword" placeholder="Confirm Password" type={inpType} value={ConfirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                    <label for="floatingPassword" style={{ left: "10px" }}>Confirm Password</label>
                                    <button type="button" className="btn btn-secondary password-toggle position-absolute top-50 right-5px translate-y-50" onClick={() => inpType === 'text' ? setInpType('password') : setInpType('text')}>{inpType === 'password' ? <BiSolidShow className='text-sec' style={{ fontSize: '25px' }} /> : <BiSolidHide className='text-sec' style={{ fontSize: '25px' }} />}</button>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button onClick={changePassword} type="button" className="btn btn-primary btn-main">Change Password</button>
                                    <button onClick={() => navigate(0)} type="button" className="btn btn-secondary">Back</button>
                                </div>
                                <div className='pt-3'>
                                    {msg3 && <p className='text-success'>Password Changed Successfully</p>}
                                    {passFail && <p className='text-danger'>Passowrd Not Changed,  Please Try Again Later...</p>}
                                    {elqPass && <p className='text-warning'>Password and Confirm Password should be same</p>}
                                    {passLength && <p className='text-warning'>Passowrd Must Be 8 Characters</p>}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div class="col-12 col-sm-6 ">
                    <div className=' text-white text-center py-3 border-lside border-2  border-secondary'>
                        <img src={image} alt="" className='w-75 w-sm-75 w-md-50' />
                    </div>
                </div>
            </div>
        </>




    )
}

export default AdminLogin