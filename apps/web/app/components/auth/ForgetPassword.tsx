"use client"

import { type FormEvent, useState, useEffect } from "react"
import { FaArrowLeft } from "react-icons/fa6"
import { isValidEmail } from "../../../src/utils/Helper"
import axios from "axios"
import { getTimeRemaining } from "../../../src/utils/timer"
import { useRouter } from "next/navigation"

export default function ForgetPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isShowOtpForm, setIsShowOtpForm] = useState(false)
  const [userOtp, setUserOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const endTime = localStorage.getItem("otpEndTime")
    if (endTime) {
      const remaining = getTimeRemaining(Number.parseInt(endTime))
      setTimeRemaining(remaining)
      setIsShowOtpForm(remaining > 0)
    }
  }, [])

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)  
    } else if (isShowOtpForm) {
      setIsShowOtpForm(false)
      localStorage.removeItem("otpEndTime")
    }
  }, [timeRemaining, isShowOtpForm])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Please fill the email field")
      return
    }

    if (!isValidEmail(email)) {
      setError("Email not valid")
      return
    }

    try {
      const response: any = await axios.post(`/api/auth/forgetpassword`, { email: email })
      setError(response.data.message)
      if (response.status === 200) {
        setIsShowOtpForm(true)
        const endTime = Date.now() + 60000 // 1 minute from now
        localStorage.setItem("otpEndTime", endTime.toString())
        setTimeRemaining(60)
      }
    } catch (e: any) {
      console.log(e)
      setError(e.response.data.message)
    }
  }

  const handleValidateOtp = async () => {
    if (!isShowOtpForm) return

    try {
      const response: any = await axios.post("/api/auth/verify-otp", { otp: userOtp, email, newpassword: newPassword })
      setError(response.data.message)
      if (response.status === 200) {
        setError(response.data.message)
        setTimeout(() => {
           router.push("/login")
        }, 2000);
        setTimeRemaining(0);
      }
    } catch (e: any) {
      console.log(e)
      setError(e.response.data.message)
    }
  }

  return (
    <div className="dark:bg-black min-h-screen bg-white flex justify-center items-center">
      {!isShowOtpForm ? (
        <form onSubmit={handleSubmit} className="border border-gray-600 flex flex-col p-10 rounded-2xl gap-3 w-96">
          <div className="flex items-center mb-4">
            <FaArrowLeft className="text-gray-400 cursor-pointer" onClick={() =>{
               if (typeof window !== "undefined") {
                window.history.back();
              }
              }} />
            <h2 className="text-2xl font-bold text-center flex-grow dark:text-gray-200 text-gray-900">Forgot Password</h2>
          </div>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg text-black dark:text-white bg-gray-100 dark:bg-gray-800 outline-none border border-gray-600"
          />
          {error !== "Password changed successfully" && <span className="text-red-500">{error}</span>}
          {error === "Password changed successfully" && <span className="text-green-500 mb-3">{error}</span>}
          <button
            className="bg-blue-500 p-3 rounded-lg text-white cursor-pointer hover:bg-blue-600 transition duration-300"
            type="submit"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <div className="border border-gray-600 flex flex-col p-10 rounded-2xl gap-3 w-96">
          <div className="flex items-center mb-4">
            <FaArrowLeft className="text-gray-400 cursor-pointer" onClick={() => setIsShowOtpForm(false)} />
            <h2 className="text-2xl font-bold text-center flex-grow text-gray-200">Verify OTP</h2>
          </div>
          <input
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            placeholder="New password"
            className="p-3 rounded-lg border border-gray-600 outline-none dark:text-white text-black bg-gray-100 dark:bg-gray-800 mb-3"
          />
          <div className="flex gap-2 mb-3">
            {Array.from({ length: 6 }, (_, i) => (
              <input
                key={i}
                type="number"
                maxLength={1}
                className="rounded-lg text-center dark:text-white text-black p-3 border-gray-600 border h-12 w-12 bg-gray-100 dark:bg-gray-800"
                onKeyUp={(e: any) => {
                    if (e === "-" || "+" || "." || "e") {
                        e.preventDefault();
                    }
                }}
                onChange={(e) => {
                  const value = e.target.value
                  setUserOtp((prev) => {
                    const newOtp = prev.split("")
                    newOtp[i] = value
                    return newOtp.join("")
                  })
                  if (value && e.target.nextElementSibling) {
                    ;(e.target.nextElementSibling as HTMLInputElement).focus()
                  }
                }}
              />
            ))}
          </div>
          {timeRemaining > 0 && <p className="text-sm text-gray-400 mb-3">Time remaining: {timeRemaining} seconds</p>}
          {error === "Otp sent successfully" && <span className="text-green-500 mb-3">{error}</span>}
          {error && <span className="text-red-500 mb-3">{error}</span>}
          <button
            className="bg-blue-500 p-3 rounded-lg text-white cursor-pointer hover:bg-blue-600 transition duration-300"
            onClick={handleValidateOtp}
            disabled={timeRemaining === 0}
          >
            Verify OTP
          </button>
        </div>
      )}
    </div>
  )
}

