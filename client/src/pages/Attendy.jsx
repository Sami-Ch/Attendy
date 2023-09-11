import React, { useState, useEffect } from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { useNavigate } from "react-router-dom";
import ImageUploadComponent from "../components/ImageUploadComponent";
import Cookies from 'js-cookie';
import Loader from "../components/Loader";
import Logout from "../components/Logout";


export default function Attendy() {
   let navigate = useNavigate();
   const [authorized, setAuthorized] = useState(true);

   useEffect(() => {

      const token = Cookies.get('token');
      const role = Cookies.get('role');
      if (role === 'student' && token) {
         setAuthorized(true);
      } else {
         setAuthorized(null);
         setTimeout(() => {
            navigate('/');
         }, 1500);
      }
   }, [navigate]);

   return (
      <div>
         {authorized ? (
            <>
               <ImageUploadComponent _id={"64feeca2eaf7c4a17f4cd84a"} />
               <Logout />
            </>

         ) : (
            <>
               <div
                  className="mb-3 inline-flex w-full items-center rounded-lg bg-danger-100 px-6 py-5 text-base text-danger-700"
                  role="alert">
                  <span className="mr-2">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5">
                        <path
                           fillRule="evenodd"
                           d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                           clipRule="evenodd" />
                     </svg>
                  </span>
                  Redirecting to login page 😓
               </div>
               <Loader />
            </>
         )}
      </div>
   );
}