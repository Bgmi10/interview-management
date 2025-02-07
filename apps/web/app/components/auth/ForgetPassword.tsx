"use client";
import { FormEvent, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { isValidEmail } from "../../utils/Helper";
import axios from "axios";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isshowotpform, setIsShowOtpForm] = useState(false);
    const [userotp, setUserOtp] = useState("343066"); 
    const [newpassword, setNewPassword] = useState("");

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();

      if (!email) {
        setError("please fill the email field");
        return;
      }

      if (!isValidEmail(email)) {
        setError("email not valid");
        return;
      }

      try{
        const response = await axios.post(`/api/auth/forgetpassword`, { email: email });
        setError(response.data.message);
        if (response.status === 200) {
            setIsShowOtpForm(true);
        } 

      } catch (e: any) {
        console.log(e);
        setError(e.response.data.message);
      } 

    }

    const handleValidateOtp = async() => {
        if (!isshowotpform) return;

        try {
            const reponse = await axios.post("/api/auth/verify-otp", { otp: userotp, email, newpassword });
            setError(reponse.data.message);
            if (reponse.status === 200) {
               
            }
        } catch (e) {
            console.log(e);
        }
    }

    const mockNumber = Array.from({ length: 6 }, (i) => i);

    return(
        <div className="dark:bg-black h-screen bg-white flex justify-center items-center">
           { !isshowotpform && <form onSubmit={handleSubmit} className="border border-gray-600 flex flex-col p-20 rounded-2xl gap-3">
             <FaArrowLeft className="text-white"/>
             <input type="text" name="email" placeholder="enter your email" onChange={(e) => setEmail(e.target.value)} className="p-3 rounded-lg text-black dark:text-white  outline-none border border-gray-600" />
             {error && <span className="text-red-500">{error}</span>}
             <button className="bg-blue-500 p-3 rounded-lg text-white cursor-pointer" type="submit">verify email</button>
           </form>}

            {
              isshowotpform && (
                <div className="flex gap-2 border border-white p-20 flex-col">
                    <div className="justify-between flex">
                      <FaArrowLeft className="text-white cursor-pointer" onClick={() => setIsShowOtpForm(false)} />
                      <span className="text-white">OTP</span>
                      <div className="w-8"></div>
                    </div>
                    <div>
                        <input type="text" onChange={(e) => setNewPassword(e.target.value)} value={newpassword} placeholder="new password" className="p-3 rounded-lg border border-gray-600 outline-none dark:text-white text-black" />
                    </div>
                    <div className="flex gap-2">
                   {
                    mockNumber.map((item) => (
                        <div key={item}>
                          <input placeholder="0" className="rounded-4xl text-center dark:text-white text-black p-3 border-white border h-10 w-10" onChange={(e) => setUserOtp(e.target.value)} />
                        </div>
                    ))
                   }
                   </div>
                   {
                    error === "otp sent successfully" && <span className="text-green-500">check your email for otp</span>
                   }
                   <button className="bg-blue-500 text-white p-3 rounded-lg cursor-pointer" onClick={handleValidateOtp}>Verify Otp</button>
                </div>
            
              )
            }
        </div>
    )
}