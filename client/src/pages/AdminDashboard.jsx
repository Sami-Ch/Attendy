import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploadComponent from "../components/ImageUploadComponent";
import {
   TETabs,
   TETabsContent,
   TETabsItem,
   TETabsPane,
} from "tw-elements-react";
import Cookies from 'js-cookie';
import Loader from "../components/Loader";
import Logout from "../components/Logout";
import axios from "axios";
import IP from "../IP";
import StudentTabs from "../components/StudentTabs";
import StudentRecords from "../components/StudentRecords";
import RequestModue from "../components/requestModule";
import AttendanceForm from "../components/AttendanceForm";


export default function AdminDashboard() {
   const requestUrl = `${IP.IP}getstudent`;
   let navigate = useNavigate();

   // Data states
   const [studentsData, setStudentsData] = useState(null);


   // Event states
   const [isLoading, setIsLoading] = useState(true);
   const [verticalActive, setVerticalActive] = useState("Student Records");


   const isAuthorized = async () => {
      try {
         const role = Cookies.get('role');
         if (role === 'admin') {
            return true;
         } else {
            throw new Error('Unauthorized');
         }
      } catch (error) {
         console.error(error.message);
         navigate('/');
         return false;
      }
   };

   const getStudents = async () => {
      try {
         const isAuth = await isAuthorized();
         if (!isAuth) {
            setIsLoading(false);
            return;
         }

         const requestUrl = `${IP.IP}getallstudents`;

         const res = await axios.get(requestUrl, { headers: { Authorization: Cookies.get('token') } });

         setStudentsData(res.data);
         setIsLoading(false);

         //console.log(res.data);
      } catch (error) {
         console.error(error.message);
         setIsLoading(false);
      }
   };

   const handleVerticalClick = (value) => {
      if (value === verticalActive) {
         return;
      }
      setVerticalActive(value);
   };

   useEffect(() => {
      getStudents();

   }, []);

   return (
      <section className="h-screen">
         <div className="flex h-full">
            <div className="flex w-40 h-full bg-black items-start">
               <TETabs vertical>
                  <p className=" w-40 pt-3 h-12  bg-slate-500">Dashboard</p>
                  <div className=" border-t-2 mb-2 border-primary-600 items-center"></div>
                  <TETabsItem
                     className="py-3 my-2"
                     onClick={() => handleVerticalClick("Student Records")}
                     active={verticalActive === "Student Records"}
                  >
                     Student Records
                  </TETabsItem>
                  <TETabsItem
                     className="py-3 my-2"
                     onClick={() => handleVerticalClick("Request Module")}
                     active={verticalActive === "Request Module"}
                  >
                     Request module
                  </TETabsItem>
                  <TETabsItem
                     className="py-3 my-2"
                     onClick={() => handleVerticalClick("Create Form")}
                     active={verticalActive === "Create Form"}
                  >
                     Attendance Form
                  </TETabsItem>
                  <div className=" mt-6">

                     <Logout />
                  </div>
               </TETabs>
            </div>
            <div className="w-screen mx-auto">
               <div className="bg-slate-500 border-l-2 border-primary-600 pt-3 pl-10 w-full h-12 min-w-full font-bold text-left">
                  {verticalActive}
               </div>
               <div className="-mr-4 border-t-2 border-primary-600"></div>
               <div className="flex items-center justify-center">
                  <TETabsContent>
                     <TETabsPane show={verticalActive === "Student Records"}>
                        {isLoading ? (
                           <Loader />
                        ) : (
                           <StudentRecords studentsData={studentsData} />
                        )}
                     </TETabsPane>
                     <TETabsPane show={verticalActive === "Request Module"}>
                        {isLoading ? (
                           <Loader />
                        ) : (
                           <RequestModue
                              studentsData={studentsData}
                              getStudents={getStudents} />
                        )}
                     </TETabsPane>
                     <TETabsPane show={verticalActive === "Create Form"}>
                        {isLoading ? (
                           <Loader />
                        ) : (
                           <AttendanceForm />
                        )}

                     </TETabsPane>
                  </TETabsContent>
               </div>
            </div>
         </div>
      </section>

   );

}
