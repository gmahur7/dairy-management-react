import React, { Fragment, useEffect, useState } from "react";
import Api_Url from "../env";
import { Link, useNavigate } from "react-router-dom";
import { AdminState } from "../Context/ContextApi";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import image from "../Images/Adminlogin.jpeg";
import { ToastContainer, toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const toastErrorObj = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const AdminLogin = () => {
  const { setToken } = AdminState();
  const navigate = useNavigate();
  const [Id, setId] = useState("");
  const [Email, setEmail] = useState("");
  const [loginDiv, setLoginDiv] = useState(true);
  const [confirmIdentityDiv, setConfirmIdentityDiv] = useState(false);
  const [verifyOtpDiv, setVerifyOTPDiv] = useState(false);
  const [passwordChangeDiv, setPasswordChangeDiv] = useState(false);
  const [Password, setPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [emailDiv, setEmailDiv] = useState(false);
  const [otpDiv, setOtpDiv] = useState(false);
  const [passDiv, setPassDiv] = useState(true);
  const [msg2, setMsg2] = useState(false);
  const [msg, setMsg] = useState(false);
  // const [msg, setMsg] = useState(false);
  const [inpType, setInpType] = useState("password");
  const [inpType2, setInpType2] = useState("password");

  const verify = async () => {
    if (!Id || !Email) {
      setError(true);
    } else {
      let result = await fetch(`${Api_Url}/api/admin/verify`, {
        method: "post",
        body: JSON.stringify({ Id, Email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.msg === "OTP sent to your email successfully") {
        return result;
      } else {
        throw new Error(result.msg || "Verification failed");
      }
    }
  };

  const loginMutation = useMutation({
    mutationFn: async ({ Id, Password }) => {
      const response = await fetch(`${Api_Url}/api/admin`, {
        method: "post",
        body: JSON.stringify({ Id, Password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.token) {
        throw new Error(data.msg || "Login failed");
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Login error occurred", toastErrorObj);
    },
    onSuccess: (data) => {
      toast.success("Login successful!", toastErrorObj);
      setToken(data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify({ Id: data.id, token: data.token })
      );
      navigate("/");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: () => verify(),
    mutationKey: "verify",
    onSuccess: () => {
      setOtpDiv(true);
      setEmailDiv(false);
      setPassDiv(false);
      setMsg(false);
      setMsg2(false);
      setError(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setError(false);
      setEmailDiv(true);
      setOtpDiv(false);
      setPassDiv(false);
      setMsg(error.msg || "Verification failed");
      setMsg2(false);
    },
  });

  const verifyOTPMutation = useMutation({
    mutationKey: "verifyOtp",
    mutationFn: () => verifyOTP(),
    onSuccess: () => {
      setPassDiv(true);
      setOtpDiv(false);
      setEmailDiv(false);
      setMsg(false);
      setError(false);
    },
    onError: (error) => {
      toast.error(error.message || "OTP Verifiaction failed");
      setEmailDiv(false);
      setOtpDiv(true);
      setMsg(false);
      setMsg2(true);
      setPassDiv(false);
      setError(false);
    },
  });

  const verifyOTP = async () => {
    if (!OTP || !Id) {
      setError(true);
    } else {
      let result = await fetch(`${Api_Url}/api/admin/verify/otp`, {
        method: "post",
        body: JSON.stringify({ Id, OTP }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.msg === "OTP verified successfully") {
        return result;
      } else {
        throw new Error(result.msg || "OTP verification failed");
      }
    }
  };

  const changePasswordMutation = useMutation({
    mutationKey: "change-password",
    mutationFn: () => changePassword(),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setOtpDiv(false);
      setEmailDiv(false);
      setMsg(false);
      setMsg2(false);
      setError(false);
      setTimeout(() => {
        reset();
        // navigate(0);
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Password not changed");
      setEmailDiv(false);
      setOtpDiv(false);
      setMsg(false);
      setMsg2(false);
      setError(false);
      setTimeout(() => {
        // navigate(0);
      }, 3000);
    },
  });

  const changePassword = async () => {
    // Checking if passwords are provided
    if (!Password || !ConfirmPassword) {
      throw new Error("Please Fill both Password and Confirm Password");
    } else {
      if (Password !== ConfirmPassword) {
        throw new Error("Password must be same");
      }
      if (Password.length < 8) {
        throw new Error("Password must be 8 characters long");
      }
      // Sending password change request
      let result = await fetch(`${Api_Url}/api/admin/change/password`, {
        method: "post",
        body: JSON.stringify({ Id, Password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await result.json();

      if (result.msg === "Password Changed") {
        return result;
      } else {
        throw new Error(result.msg || "Password not changed");
      }
    }
  };

  const handleLogin = () => {
    if (!Id || !Password) {
      toast.error("Please fill out both fields", toastErrorObj);
      return;
    }
    loginMutation.mutate({ Id, Password });
  };

  function toforgetpass() {
    setLoginDiv(false);
    setConfirmIdentityDiv(true);
  }

  useEffect(() => {
    if (msg) {
      setMsg(false);
    }
  }, [Id, Password]);

  function reset() {
    setId("");
    setEmail("");
    setError(false);
    setMsg(false);
  }

  // function reset() {
  //     setId('')
  //     setPassword('')
  //     setError(false)
  //     setMsg(false)
  // }

  // alert(confirmIdentityDiv)

  const renderLeftBox = () => {
    if (loginDiv || verifyOtpDiv) {
      return (
        <img
          src={image}
          alt="Admin Login"
          className="w-3/4 h-full object-cover rounded-lg"
        />
      );
    } else if (confirmIdentityDiv) {
      return (
        <div className="mt-6 space-y-4 text-center px-4">
          <h3 className="text-2xl text-light-headerText dark:text-dark-primary font-bold">
            Enter UserId and E-mail to Confirm Identity
          </h3>
          <div className="space-y-4">
            <div className="relative border-2 border-light-headerText rounded-md">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                @
              </span>
              <input
                type="text"
                className="w-full pl-10 py-2 rounded-lg"
                placeholder="Username"
                value={Id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="relative border-2 border-light-headerText rounded-md">
              <input
                type="text"
                className="w-full pl-3 py-2 rounded-md"
                placeholder="E-Mail"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center space-x-4">
              <button
                onClick={verifyMutation.mutate}
                type="button"
                className="bg-light-headerText text-white dark:text-black py-2 px-6 rounded-lg w-full md:w-2/4"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setLoginDiv(true);
                  setConfirmIdentityDiv(false);
                }}
                type="button"
                className="bg-light-headerText text-white dark:text-black py-2 px-6 rounded-lg w-full md:w-2/4"
              >
                Back
              </button>
            </div>
            {msg && <p className="text-center text-red-500">{msg}</p>}
          </div>
        </div>
      );
    } else if (passwordChangeDiv) {
      return (
        <div className="mt-6 space-y-4 text-center px-4">
          <h3 className="text-2xl text-light-headerText dark:text-dark-primary font-bold">
            Change Password
          </h3>
          <p className="text-black dark:text-white text-md">Enter Password and Confirm Password and make it remember</p>
          <div className="space-y-4">

            <div className="relative border-2 border-light-headerText rounded-md">
              <input
                className="form-control py-2 pl-8 pr-12 rounded-lg w-full"
                id="floatingPassword"
                placeholder="Password"
                type={inpType}
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() =>
                  inpType === "text"
                    ? setInpType("password")
                    : setInpType("text")
                }
              >
                {inpType === "password" ? (
                  <BiSolidShow className="text-light-headerText text-xl" />
                ) : (
                  <BiSolidHide className="text-light-headerText text-xl" />
                )}
              </button>
            </div>

            <div className="relative border-2 border-light-headerText rounded-md">
              <input
                className="form-control py-2 pl-8 pr-12 rounded-lg w-full"
                id="floatingPassword"
                placeholder="Confirm Password"
                type={inpType2}
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() =>
                  inpType2 === "text"
                    ? setInpType2("password")
                    : setInpType2("text")
                }
              >
                {inpType2 === "password" ? (
                  <BiSolidShow className="text-light-headerText text-xl" />
                ) : (
                  <BiSolidHide className="text-light-headerText text-xl" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-center space-x-4">
              <button
                onClick={verifyMutation.mutate}
                type="button"
                className="bg-light-headerText text-white dark:text-black py-2 px-6 rounded-lg w-full md:w-2/4"
              >
                Change
              </button>
              <button
                onClick={() => {
                  setPasswordChangeDiv(false);
                  setVerifyOTPDiv(true);
                }}
                type="button"
                className="bg-light-headerText text-white dark:text-black py-2 px-6 rounded-lg w-full md:w-2/4"
              >
                Back
              </button>
            </div>
            {msg && <p className="text-center text-red-500">{msg}</p>}
          </div>
        </div>
      );
    }
  };

  const renderRightBox = () => {
    if (confirmIdentityDiv || passwordChangeDiv) {
      return (
        <img
          src={image}
          alt="Admin Login"
          className="w-3/4 h-full object-cover rounded-lg"
        />
      );
    } else if (loginDiv) {
      return (
        <>
          <h2 className="text-4xl text-light-headerText dark:text-dark-primary">
            Admin Login
          </h2>

          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            {/* Username Input */}
            <div className="relative border-2 border-light-headerText rounded-md">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                @
              </span>
              <input
                type="text"
                className="form-control pl-8 py-2 rounded-lg w-full"
                id="floatingInputGroup1"
                placeholder="Username"
                value={Id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative border-2 border-light-headerText rounded-md">
              <input
                className="form-control py-2 pl-8 pr-12 rounded-lg w-full"
                id="floatingPassword"
                placeholder="Password"
                type={inpType}
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() =>
                  inpType === "text"
                    ? setInpType("password")
                    : setInpType("text")
                }
              >
                {inpType === "password" ? (
                  <BiSolidShow className="text-light-headerText text-xl" />
                ) : (
                  <BiSolidHide className="text-light-headerText text-xl" />
                )}
              </button>
            </div>

            {/* Button and Forget Password Link */}
            <div className="flex justify-between items-center gap-2 flex-col md:flex-row">
              <button
                onClick={handleLogin}
                type="button"
                className="bg-light-headerText py-2 px-6 rounded-lg w-full md:w-2/4"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Loading..." : "Log-In"}
              </button>
              <Link
                className="bg-light-headerText py-2 px-6 rounded-md w-full md:w-2/4"
                onClick={() => toforgetpass()}
              >
                Forget Password
              </Link>
            </div>
          </div>
        </>
      );
    } else if (verifyOtpDiv) {
      return (
        <>
          <h2 className="text-4xl text-light-headerText dark:text-dark-primary">
            Verify OTP
          </h2>

          <div className="grid grid-cols-1 gap-4 w-full max-w-md px-4">
            {/* Username Input */}
            <div className="relative border-2 border-light-headerText rounded-md">
              <input
                type="text"
                className="form-control pl-8 py-2 rounded-lg w-full"
                id="floatingInputGroup1"
                placeholder="OTP"
                value={Id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            {/* Button and Forget Password Link */}
            <div className="flex justify-between items-center gap-2 flex-col md:flex-row">
              <button
                onClick={handleLogin}
                type="button"
                className="bg-light-headerText py-2 px-6 rounded-lg w-full md:w-2/4"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Loading..." : "Verify"}
              </button>
              <Link
                className="bg-light-headerText py-2 px-6 rounded-md w-full md:w-2/4"
                onClick={() => {
                  setVerifyOTPDiv(false);
                  setConfirmIdentityDiv(true);
                }}
              >
                Back
              </Link>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <Fragment>
      <div className="container mx-auto bg-white dark:bg-black flex flex-col min-h-[92vh] my-auto">
        <div className="flex-grow overflow-auto pt-4 md:pt-10">
          <div className="md:container py-4 mx-auto">
            <div className="border-2 border-light-headerText rounded-lg py-4">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left side: Image */}
                <div className="border-b-2 pb-4 sm:pb-0 md:border-b-0 md:border-r-2 border-light-headerText rounded-lg flex justify-center items-center">
                  {renderLeftBox()}
                </div>

                {/* Right side: Form */}
                <div className="flex flex-col items-center justify-center rounded-lg p-4 text-white text-center py-4 px-3 gap-4 h-full">
                  {renderRightBox()}

                  {/* Error message */}
                  {msg && <p className="text-lg text-red-500 mt-3">{msg}</p>}
                </div>
              </div>
            </div>
            {/* {!loginDiv && <ForgetPassword />} */}
          </div>
        </div>
      </div>
      <ToastContainer />
    </Fragment>
  );
};

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [Id, setId] = useState("a");
  const [OTP, setOTP] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [emailDiv, setEmailDiv] = useState(false);
  const [otpDiv, setOtpDiv] = useState(false);
  const [passDiv, setPassDiv] = useState(true);
  const [msg, setMsg] = useState(false);
  const [msg2, setMsg2] = useState(false);
  const [inpType, setInpType] = useState("password");

  const verifyMutation = useMutation({
    mutationFn: () => verify(),
    mutationKey: "verify",
    onSuccess: () => {
      setOtpDiv(true);
      setEmailDiv(false);
      setPassDiv(false);
      setMsg(false);
      setMsg2(false);
      setError(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setError(false);
      setEmailDiv(true);
      setOtpDiv(false);
      setPassDiv(false);
      setMsg(error.msg || "Verification failed");
      setMsg2(false);
    },
  });

  const verify = async () => {
    if (!Id || !Email) {
      setError(true);
    } else {
      let result = await fetch(`${Api_Url}/api/admin/verify`, {
        method: "post",
        body: JSON.stringify({ Id, Email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.msg === "OTP sent to your email successfully") {
        return result;
      } else {
        throw new Error(result.msg || "Verification failed");
      }
    }
  };

  function reset() {
    setId("");
    setEmail("");
    setError(false);
    setMsg(false);
  }

  const verifyOTPMutation = useMutation({
    mutationKey: "verifyOtp",
    mutationFn: () => verifyOTP(),
    onSuccess: () => {
      setPassDiv(true);
      setOtpDiv(false);
      setEmailDiv(false);
      setMsg(false);
      setError(false);
    },
    onError: (error) => {
      toast.error(error.message || "OTP Verifiaction failed");
      setEmailDiv(false);
      setOtpDiv(true);
      setMsg(false);
      setMsg2(true);
      setPassDiv(false);
      setError(false);
    },
  });

  const verifyOTP = async () => {
    if (!OTP || !Id) {
      setError(true);
    } else {
      let result = await fetch(`${Api_Url}/api/admin/verify/otp`, {
        method: "post",
        body: JSON.stringify({ Id, OTP }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      if (result.msg === "OTP verified successfully") {
        return result;
      } else {
        throw new Error(result.msg || "OTP verification failed");
      }
    }
  };

  const changePasswordMutation = useMutation({
    mutationKey: "change-password",
    mutationFn: () => changePassword(),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setOtpDiv(false);
      setEmailDiv(false);
      setMsg(false);
      setMsg2(false);
      setError(false);
      setTimeout(() => {
        reset();
        // navigate(0);
      }, 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Password not changed");
      setEmailDiv(false);
      setOtpDiv(false);
      setMsg(false);
      setMsg2(false);
      setError(false);
      setTimeout(() => {
        // navigate(0);
      }, 3000);
    },
  });

  const changePassword = async () => {
    // Checking if passwords are provided
    if (!Password || !ConfirmPassword) {
      throw new Error("Please Fill both Password and Confirm Password");
    } else {
      if (Password !== ConfirmPassword) {
        throw new Error("Password must be same");
      }
      if (Password.length < 8) {
        throw new Error("Password must be 8 characters long");
      }
      // Sending password change request
      let result = await fetch(`${Api_Url}/api/admin/change/password`, {
        method: "post",
        body: JSON.stringify({ Id, Password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await result.json();

      if (result.msg === "Password Changed") {
        return result;
      } else {
        throw new Error(result.msg || "Password not changed");
      }
    }
  };

  return (
    <Fragment>
      <div className="bg-white dark:bg-black flex flex-col min-h-screen py-4">
        <div className="flex-grow overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4 py-10 border-2 border-light-headerText rounded-md">
            {/* Left Side: Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="text-center text-gray-800 dark:text-gray-100">
                {emailDiv && (
                  <h2 className="text-3xl font-bold text-blue-500">
                    Forget Password
                  </h2>
                )}
                {otpDiv && (
                  <h2 className="text-3xl font-bold text-blue-500">
                    Verify OTP
                  </h2>
                )}
                {passDiv && (
                  <h2 className="text-3xl font-bold text-blue-500">
                    Change Password
                  </h2>
                )}
              </div>
              {emailDiv && (
                <div className="mt-6 space-y-4">
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    Enter UserId and E-mail to Confirm Identity
                  </p>
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        @
                      </span>
                      <input
                        type="text"
                        className="w-full pl-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        placeholder="Username"
                        value={Id}
                        onChange={(e) => setId(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        placeholder="E-Mail"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between items-center space-x-4">
                      <button
                        onClick={verifyMutation.mutate}
                        type="button"
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => navigate(0)}
                        type="button"
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                      >
                        Back
                      </button>
                    </div>
                    {msg && <p className="text-center text-red-500">{msg}</p>}
                  </div>
                </div>
              )}
              {otpDiv && (
                <div className="mt-6 space-y-4">
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    OTP has been sent to your E-mail {Email}
                  </p>
                  <div>
                    <input
                      type="number"
                      className="w-full py-2 pl-3 rounded-lg border border-gray-300 dark:border-gray-600"
                      placeholder="OTP"
                      value={OTP}
                      onChange={(e) => setOTP(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center space-x-4">
                    <button
                      onClick={verifyOTPMutation.mutate}
                      type="button"
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => navigate(0)}
                      type="button"
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                    >
                      Back
                    </button>
                  </div>
                  {msg2 && (
                    <p className="text-center text-red-500">
                      OTP Verification Failed
                    </p>
                  )}
                </div>
              )}
              {passDiv && (
                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <input
                      className="w-full py-2 pl-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600"
                      placeholder="Password"
                      type={inpType}
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        inpType === "text"
                          ? setInpType("password")
                          : setInpType("text")
                      }
                    >
                      {inpType === "password" ? (
                        <BiSolidShow />
                      ) : (
                        <BiSolidHide />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full py-2 pl-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600"
                      placeholder="Confirm Password"
                      type={inpType}
                      value={ConfirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center space-x-4">
                    <button
                      onClick={changePasswordMutation.mutate}
                      type="button"
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => navigate(0)}
                      type="button"
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Right Side: Image */}
            <div className="flex justify-center items-center">
              <img
                src={image}
                alt="Forget Password"
                className="w-3/4 object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminLogin;
