import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploadComponent from "../components/ImageUploadComponent";
import Cookies from 'js-cookie';
import Loader from "../components/Loader";
import Logout from "../components/Logout";
import axios from "axios";
import IP from "../IP";
import StudentTabs from "../components/StudentTabs";

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
            console.log('getstudent in attendy');
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
               <h2 className=" dark:text-white text-lg mb-2">Welcome {userData.firstName} {userData.lastName}</h2>
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
               <div className="border-t border-primary-600 mt-2"></div>
               <StudentTabs userData={userData} getStudent={getStudent} />
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
