import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploadComponent from "../components/ImageUploadComponent";
import Cookies from 'js-cookie';
import Loader from "../components/Loader";
import axios from "axios";
import IP from "../IP";
import StudentTabs from "../components/StudentTabs";
import Logout from "../components/Logout";

export default function Attendy() {
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

      if (role === 'student') {
         setAuthorized(true);
      } else {
         setAuthorized(false);
         setTimeout(() => {
            navigate('/');
         }, 2000);
      }
   };

   const getStudent = async () => {
      const _id = Cookies.get('_id');

      if (_id) {
         const url = `${requestUrl}/${_id}`;
         try {
            const response = await axios.get(url);
            //console.log('getstudent in attendy');
            setUserData(response.data.student);
            setImage(`${IP.IP}${response.data.student.profileImage.imageUrl}`);
         } catch (error) {
            console.error('Error fetching student data:', error);
         } finally {
            setIsLoading(false);
         }
      }
   };

   useEffect(() => {
      isAuthorized();
      getStudent();
   }, []); // Run once when the component mounts

   return (
      <div>
         {isLoading ? ( // Display loader if isLoading is true
            <Loader />
         ) : authorized ? (
            <section className="h-full mt-3">
               <div className=" w-[10rem]">
                  <div className=" ">
                     <div className=" -mt-3 -mb-0"><Logout /> </div>  {/* Move Logout component here */}
                  </div>
               </div>
               <span className="flex h-full items-center justify-center">
                  <img
                     src={image}
                     className="max-w-48 max-h-48 rounded-lg"
                     alt="Avatar"
                  />
               </span>
               <ImageUploadComponent
                  _id={Cookies.get('_id')}
                  setImage={setImage}
                  image={image}
                  getStudent={getStudent}
               />
               <p>{userData.firstName}</p>
               <div className="border-t border-primary-600 mt-2"></div>
               <StudentTabs userData={userData} getStudent={getStudent} />
            </section>
         ) : (
            <>
               <div className="grid grid-rows-2 gap-3 my-20 px-6 py-5 text-base text-danger-700" role="alert">
                  😓 Redirecting to the login page
               </div>
               <Loader />
            </>
         )}
      </div>
   );
}
