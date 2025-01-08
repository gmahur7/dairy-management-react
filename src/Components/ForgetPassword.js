import { useState } from "react"
import Api_Url from "../env"
import { useNavigate } from "react-router-dom"

const ForgetPassword = () => {
    const navigate=useNavigate()
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

    const verify = async () => {
        if (!Id || !Email) {
            setError(true)
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/admin`, {
                    method: 'post',
                    body: JSON.stringify({ Id, Email }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json()
                if (result.msg === "Avilable") {
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
                let result = await fetch(`${Api_Url}/api/admin`, {
                    method: 'post',
                    body: JSON.stringify({ Id, OTP }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json()
                if (result.msg === "OTP Verified") {
                    setOtpDiv(false)
                    setEmailDiv(false)
                    setMsg(false)
                    setMsg3(false)
                    setPassDiv(true)
                    setError(false)
                }
                else {
                    throw new Error(result.msg)
                }
            } catch (error) {
                setEmailDiv(false)
                setOtpDiv(false)
                setMsg(false)
                setMsg3(false)
                setMsg2(error.msg)
                setPassDiv(true)
                setError(false)
            }
        }
    }

    const changePassword = async () => {
        if (!Password || !Id) {
            setError(true)
        }
        else {
            try {
                let result = await fetch(`${Api_Url}/api/admin`, {
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
                    setTimeout(()=>{
                        reset()
                        navigate('/adminlogin')
                    },3000)
                }
                else {
                    throw new Error(result.msg)
                }
            } catch (error) {
                setEmailDiv(false)
                setOtpDiv(false)
                setMsg(false)
                setMsg2(false)
                setMsg3(true)
                setError(false)
                setTimeout(()=>{
                    reset()
                    navigate('/adminlogin')
                },3000)
            }
        }
    }

    return (
        <div>
            <h1>Forget Password</h1>
            {emailDiv &&
                <div>
                    <div>
                        <label>Enter ID: </label>
                        <input type='text' value={Id} onChange={e => setId(e.target.value)} />
                        {error&& !Id&&<p>Please Enter Id First.</p>}
                    </div>
                    <div>
                        <label>Enter Email: </label>
                        <input type='text' value={Email} onChange={e => setEmail(e.target.value)}  />
                        {error&& !Email&&<p>Please Enter Id First.</p>}
                    </div>
                    <div>
                        <button onClick={verify}>Submit</button>
                    </div>
                </div>
            }
            {
                otpDiv &&
                <div>
                    <div>
                        <h3>Please Verify OTP</h3>
                        <p>OTP has been send to your e-mail {Email}</p>
                    </div>
                    <div>
                        <label>Enter OTP: </label>
                        <input type='number' value={OTP}  onChange={e=>setOTP(e.target.value)} />
                        {error&& !OTP&&<p>Please Enter OTP To Verify.</p>}
                    </div>
                    <div>
                        <button onClick={verifyOTP}>Verify</button>
                    </div>
                </div>
            }
            {
                passDiv &&
                <div>
                    <div>
                        <label>Enter Password : </label>
                        <input type='text' value={Password}  onChange={e=>setPassword(e.target.value)} />
                        {error&& !Password&&<p>Please Enter Password First.</p>}
                    </div>
                    <div>
                        <label>Enter Confirm Password : </label>
                        <input type='password' value={ConfirmPassword}  onChange={e=>setConfirmPassword(e.target.value)} />
                        {error&& !ConfirmPassword&&<p>Please Enter Confirm Password.</p>}
                    </div>
                    <div>
                        <button onClick={changePassword}>Change Password</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default ForgetPassword;