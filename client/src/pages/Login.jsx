import React, { useState, useEffect } from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader"
import axios from 'axios';
import Cookies from 'js-cookie'


export default function Login() {
   const requestUrl = `http://localhost:4000/login`;
   let navigate = useNavigate();
   // user data states
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
   // event states
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleLogin = async (event) => {
      event.preventDefault();
      setLoading(true);
      setError('');

      try {
         const response = await axios.post(requestUrl, {
            email: email,
            password: password,
         });

         const { role, token, error } = response.data;

         if (!error) {

            Cookies.set('token', token, {
               secure: true,
               sameSite: 'strict',
               expires: 1,
               path: '/',
            });
            Cookies.set('role', role, { expires: 1 })


            if (role === 'student') {
               navigate('/Attendy');
            } else if (role === 'admin') {
               navigate('/AdminDashboard');
            }
         } else {
            setError('Incorrect email or password');
         }
      } catch (error) {
         console.log(error)
         setError('An error occurred. Please try again later.');
      } finally {
         setLoading(false);
      }
   }
   //!  {======================= RENDER STARTS HERE =========================}
   return (
      <section className="h-screen">
         <div className=" h-full">
            <div className=" flex max-w-sm dark:border-white-10 border-2 p-20 m-40 rounded-lg ">

               {/* Right column container */}
               <div className="mb-12">
                  <form onSubmit={handleLogin}>
                     <p className="mx-4 font-semibold dark:text-white">
                        Log-in
                     </p>
                     {/* Email input */}
                     <TEInput
                        type="email"
                        label="Email address"
                        className="my-3"
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           setError(null)
                        }}
                        size="sm"
                     ></TEInput>
                     {/*Password input */}
                     <TEInput
                        type="password"
                        label="Password"
                        className="my-3"
                        value={password}
                        onChange={(e) => {
                           setPassword(e.target.value);
                           setError(null)
                        }}
                        size="sm"
                     ></TEInput>
                     {/* Login button */}
                     <TERipple rippleColor="light">
                        <button
                           type="submit"
                           className=" inline-block rounded bg-primary px-1.5 py-1 text-sm font-medium text-white " >
                           LOGIN
                        </button>
                     </TERipple>


                     {/*  Register link */}
                     <p className=" dark:text-white mb-0 mt-2 pt-1 text-sm font-semibold ">
                        Don't have an account?{" "}
                        <Link to="/Register" onClick={() => { setEmail(''); setPassword(''); }}>Register</Link>
                     </p>
                     {loading ? <Loader /> : (error && <p className=" text-red-500 mt-10">{error}</p>)}
                  </form>
               </div>
            </div>

            {/* =========================== END ========================== */}
         </div>
      </section>
   );
}