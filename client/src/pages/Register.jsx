import React, { useState } from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { useNavigate } from "react-router-dom";
import DropDownComponent from '../components/genral/DropDownComponent'
import axios from "axios";
import Loader from "../components/genral/Loader";
import IP from "../IP";


export default function Register() {
   const requestUrl = `${IP.IP}signup`;
   const navigate = useNavigate();
   // user data states
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [gender, setGender] = useState("");
   // event states
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const saveVal = (e) => {
      setGender(e);
   };


   const handleRegisterClick = async () => {
      setLoading(true);
      setError("");

      if (!firstName || !lastName || !email || !password || !gender) {
         setError("All fields are compulsory 🙄 ");
         setLoading(false);
         return;
      }

      try {
         const studentData = {
            firstName,
            lastName,
            email,
            password,
            sex: gender.toLowerCase(),
         };

         const res = await axios.post(requestUrl, studentData);

         if (res.data.student) {
            navigate("/");
         }
      } catch (err) {
         //console.log('error:  ', err.response.data.message);
         !err.response.data.error
            ? setError(err.response.data.message)
            : setError("Network problem");
      } finally {
         setLoading(false); // Ensure loading is set to false regardless of success or error
      }
   };


   //!  {======================= RENDER STARTS HERE =========================}
   return (
      <section className="flex h-screen items-center justify-center ">
         <div className="block max-w-sm dark:border-white-10 border-2 p-20 rounded-lg">
            <form>
               <p className="my-4 font-semibold dark:text-white">Register</p>
               {/* Name input */}
               <div className="grid grid-cols-2 gap-1">
                  <TEInput type="text" label="First Name" size="sm"
                     value={firstName} onChange={(e) => { setFirstName(e.target.value); setError(null); }}
                  />
                  <TEInput type="text" label="Last Name" size="sm"
                     value={lastName} onChange={(e) => { setLastName(e.target.value); setError(null); }}
                  />
               </div>

               {/* Email input */}
               <TEInput type="email" label="Email" className="my-3" size="sm"
                  value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }}
               />

               {/* Password input */}
               <TEInput type="password" label="Password" className="my-3" size="sm"
                  value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }}
               />

               {/* Gender dropdown */}
               <DropDownComponent
                  saveVal={saveVal}
                  fields={{ title: gender ? gender : 'Gender', option1: 'Male', option2: 'Female', option3: 'Others' }}
                  from="RR"
               />

               {/* Register button */}
               <div className="text-center mt-5">
                  <TERipple rippleColor="light">
                     <button
                        type="button"
                        onClick={handleRegisterClick}
                        className="relative rounded bg-primary px-1.5 py-1 text-sm font-medium text-white "
                     >
                        Register
                     </button>
                  </TERipple>
               </div>
               {loading ? <Loader /> : (error && <p className=" text-red-500 mt-10">{error}</p>)}
               {/* =========================== END ========================== */}
            </form>
         </div>
      </section>
   );
}
