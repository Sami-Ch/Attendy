import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploadComponent from "../components/ImageUploadComponent";
import Cookies from 'js-cookie';
import Loader from "../components/Loader";
import Logout from "../components/Logout";
import axios from "axios";
import IP from "../IP";
import StudentTabs from "../components/StudentTabs";


export default function AdminDashboard() {
   const requestUrl = `${IP.IP}getstudent`;
   let navigate = useNavigate();

   // Data states
   const [userData, setUserData] = useState(null);
   const [image, setImage] = useState('');

   // Event states
   const [authorized, setAuthorized] = useState(true);
   const [isLoading, setIsLoading] = useState(true);

   // Checking authorization of student
   const isAuthorized = () => {
      const role = Cookies.get('role');
      console.log(role);
      if (role === 'admin') {
         setAuthorized(true);
         setIsLoading(false)
      } else {
         setAuthorized(false);
         setTimeout(() => {
            // setIsLoading(false)
            navigate('/');
         }, 2000);
      }
   };


   useEffect(() => {
      isAuthorized();
   }, []); // Run once when the component mounts

   return (
      <div>
         {isLoading ? ( // Display loader if isLoading is true
            <Loader />
         ) : authorized ? (
            <section className="h-full mt-3">
               <h2 className=" dark:text-white text-lg mb-2">Welcome </h2>

               {/* <Logout /> */} 

            </section>
         ) : (
            <>
               <div className="grid grid-rows-2 gap-3 my-20 px-6 py-5 text-base text-danger-700" role="alert">
                  😓 Redirecting to login page
               </div>
               <Loader />
            </>
         )}
      </div>
   );

}

