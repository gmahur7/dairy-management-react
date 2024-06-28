import React, { useState } from 'react'
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
    const [loginDiv, setLoginDiv] = useState(true)
    const [Password, setPassword] = useState('')
    const [inpType, setInpType] = useState('password')
    const [error, setError] = useState(false)
    const [msg, setMsg] = useState(false)

    const login = async () => {
        if (!Id || !Password) {
            setError(true)
            return
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
        <div className='container-fluid bg-main min-vh-100'>
            <Header/>
            <div className='container '>
                {loginDiv &&
                    <div className="row justify-content-center align-items-center g-1 sm:px-5">
                        <div class="col-12 col-sm-6 ">
                            <div className=' text-white text-center py-3'>
                                <img src={image} alt="" className='w-75 w-sm-75' />
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <div className=' text-white text-center py-3 px-3'>
                                <div>
                                    <h2 className='text-main'>Admin Login</h2>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">@</span>
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="floatingInputGroup1" placeholder="Username" value={Id} onChange={e => setId(e.target.value)} />
                                        <label for="floatingInputGroup1">Username</label>
                                    </div>
                                </div>
                                <div className="form-floating mb-3">
                                    <input className="form-control position-relative" id="floatingPassword" placeholder="Password" type={inpType} value={Password} onChange={e => setPassword(e.target.value)} />
                                    <label for="floatingPassword" style={{ left: "10px" }}>Password</label>
                                    <button type="button" className="btn btn-secondary password-toggle position-absolute top-50 right-5px translate-y-50" onClick={() => inpType === 'text' ? setInpType('password') : setInpType('text')}>{inpType === 'password' ? <BiSolidShow className='text-sec' style={{ fontSize: '25px' }} /> : <BiSolidHide className='text-sec' style={{ fontSize: '25px' }} />}</button>

                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button onClick={login} type="button" className="btn btn-primary">Log-In</button>
                                    <Link className='text-sec' onClick={toforgetpass} >Forget Password</Link>
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
        <div id="forget-pass">
            <div id="forget-pass-header">
                <h1>Forget Password</h1>
            </div>
            {emailDiv &&
                <div id="forget-pass-email">
                    <div>
                        <label>Enter ID: </label>
                        <input type='text' value={Id} onChange={e => setId(e.target.value)} />
                        {error && !Id && <p>Please Enter Id First.</p>}
                    </div>
                    <div>
                        <label>Enter Email: </label>
                        <input type='text' value={Email} onChange={e => setEmail(e.target.value)} />
                        {error && !Email && <p>Please Enter Id First.</p>}
                    </div>
                    <div>
                        <button onClick={verify}>Submit</button>
                        <button onClick={() => navigate(0)}>Back</button>
                    </div>
                </div>
            }
            {
                otpDiv &&
                <div id="forget-pass-otpdiv">
                    <div>
                        <h3>Please Verify OTP</h3>
                        <p>OTP has been send to your e-mail {Email}</p>
                    </div>
                    <div>
                        <label>Enter OTP: </label>
                        <input type='number' value={OTP} onChange={e => setOTP(e.target.value)} />
                        {error && !OTP && <p>Please Enter OTP To Verify.</p>}
                    </div>
                    <div>
                        <button onClick={verifyOTP}>Verify</button>
                        <button onClick={() => navigate(0)}>Back</button>
                    </div>
                    <div>
                        {msg2 && <p>OTP Verification Failed</p>}
                    </div>
                </div>
            }
            {
                passDiv &&
                <div id="forget-pass-passdiv">
                    <div>
                        <label>Enter Password : </label>
                        <input type='text' value={Password} onChange={e => setPassword(e.target.value)} />
                        {error && !Password && <p>Please Enter Password First.</p>}
                    </div>
                    <div>
                        <label>Enter Confirm Password : </label>
                        <input type='password' value={ConfirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        {error && !ConfirmPassword && <p>Please Enter Confirm Password.</p>}
                    </div>
                    <div>
                        <button onClick={changePassword}>Change Password</button>
                    </div>
                    <div>
                        {msg && <p>{msg}</p>}
                        {msg2 && <p>{msg2}</p>}
                        {msg3 && <p>Passowrd Changed Successfully</p>}
                        {passFail && <p>Passowrd Not Changed,  Please Try Again Later...</p>}
                        {elqPass && <p>Password and Confirm Password should be same</p>}
                        {passLength && <p>Passowrd Must Be 8 Characters</p>}
                    </div>
                </div>
            }
        </div>
    )
}

export default AdminLogin