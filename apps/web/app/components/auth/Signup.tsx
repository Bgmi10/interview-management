"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import axios from "axios";
import { Loader } from "@/components/ui/Loader";

export default function Signup() {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isValidForm, setIsValidForm] = useState(false);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isNameValid, setIsNameValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isNameShake, setIsNameShake] = useState(false);
    const [isEmailShake, setIsEmailShake] = useState(false);
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoader(true);
            const response = await axios.post("/api/auth", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                action: "signup",
            });
            if (response.status === 200) {
                router.push("/dashboard");
            }
        } catch (e: any) {
            console.log(e);
            setEmailError(e.response?.data?.error || "An error occurred");
        } finally {
            setLoader(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "name") {
            const isValidName = value.trim().length > 0;
            setIsNameValid(isValidName);
            if (!isValidName && value !== "") {
                setNameError("Name is required");
                setIsNameShake(true);
            } else {
                setNameError("");
                setIsNameShake(false);
            }
        }

        if (name === "email") {
            const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            setIsEmailValid(isValidEmail);
            if (!isValidEmail && value !== "") {
                setEmailError("Invalid email format");
                setIsEmailShake(true);
            } else {
                setEmailError("");
                setIsEmailShake(false);
            }
        }
    };

    useEffect(() => {
        setIsValidForm(isNameValid && isEmailValid && formData.password.length > 0);
    }, [isNameValid, isEmailValid, formData.password]);

    const handleShowPassword = () => {
        setIsShowPassword((prev) => !prev);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b bg-white dark:bg-black">
            <div className="w-full max-w-md px-6 py-8 border border-gray-300 dark:border-gray-700 overflow-hidden rounded-2xl">
                <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Signup
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="name"
                            className={`block text-sm font-medium ${
                                isNameValid ? "text-green-600 dark:text-green-400" : nameError ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                placeholder="John Doe"
                                required
                                className={`dark:text-white text-black appearance-none block w-full px-3 py-2 border ${
                                    isNameValid ? "border-green-500" : nameError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                    isNameShake ? "animate-shake focus:ring-red-500 focus:border-red-500" : ""
                                }`}
                                onChange={handleChange}
                                onAnimationEnd={() => setIsNameShake(false)}
                            />
                        </div>
                        {nameError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{nameError}</p>}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className={`block text-sm font-medium ${
                                isEmailValid ? "text-green-600 dark:text-green-400" : emailError ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="example@gmail.com"
                                required
                                className={`dark:text-white text-black appearance-none block w-full px-3 py-2 border ${
                                    isEmailValid ? "border-green-500" : emailError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                    isEmailShake ? "animate-shake focus:ring-red-500 focus:border-red-500" : ""
                                }`}
                                onChange={handleChange}
                                onAnimationEnd={() => setIsEmailShake(false)}
                            />
                        </div>
                        {emailError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{emailError}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                name="password"
                                type={isShowPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="dark:text-white text-black appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={handleShowPassword}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                {isShowPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <button
                             onClick={() => router.push("/login")}
                             className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                            >
                               Have an account? Login here
                            </button>
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="dark:text-white text-black block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.role}   
                                onChange={(e: any) => handleChange(e)}
                            >
                                <option value="candidate">Candidate</option>
                                <option value="recruiter">Recruiter</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={!isValidForm}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white outline-none ${
                                isValidForm
                                    ? "bg-gradient-to-r from-blue-600 to-blue-800 cursor-pointer"
                                    : "from-gray-900 bg-gradient-to-b to-gray-800 cursor-not-allowed"
                            }`}
                        >
                            {loader ? <Loader /> : "Signup"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}