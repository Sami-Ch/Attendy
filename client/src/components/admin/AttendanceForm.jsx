import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import IP from "../../IP";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../genral/Loader";


export default function AttendanceForm() {
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [studentsbyDate, setStudentsbyDate] = useState(null);
   const [selectedFromDate, setSelectedFromDate] = useState(null);
   const [selectedToDate, setSelectedToDate] = useState(null);

   const inputFromRef = useRef(null);
   const inputToRef = useRef(null);

   const handleFromChange = (date) => {
      setSelectedFromDate(date);
   };

   const handleToChange = (date) => {
      setSelectedToDate(date);
   };


   const getStudentsByDate = async () => {
      setLoading(true);
      const fromDate = selectedFromDate ? selectedFromDate : new Date();
      const toDate = selectedToDate ? selectedToDate : new Date();

      const headers = {
         Authorization: Cookies.get('token'),
      };
      const requestUrl = `${IP.IP}getstudentsbydate`;
      try {
         const response = await axios.get(requestUrl, {
            headers,
            params: {
               fromDate: fromDate,
               toDate: toDate,
            },
         });
         setStudentsbyDate(response.data);
      } catch (err) {
         setError(err);
      } finally {
         setLoading(false); // Set loading to false when data is fetched (whether successful or not)
      }
   };

   useEffect(() => {

      getStudentsByDate();
   }, [selectedFromDate, selectedToDate]);


   return (
      <div className="flex flex-col h-screen">
         <div className="my-5">
            <div className="grid grid-cols-2 gap-4">
               <div >
                  <label htmlFor="fromDate" className="block mb-1">
                     From
                  </label>
                  <DatePicker
                     id="fromDate"
                     selected={selectedFromDate}
                     onChange={handleFromChange}
                     className="block w-full rounded-lg border px-3 py-0 focus:outline-none"
                     placeholderText="Select a date"
                  />
               </div>
               <div >
                  <label htmlFor="toDate" className="block mb-1">
                     To
                  </label>
                  <DatePicker
                     id="toDate"
                     selected={selectedToDate}
                     onChange={handleToChange}
                     className="block w-full rounded-lg border px-3 py-0 focus:outline-none"
                     placeholderText="Select a date"
                  />
               </div>
            </div>
         </div>
         {loading ? (
            <Loader />
         ) : error ? (
            <div>Error: {error.message}</div>
         ) : (
            <table className=" text-sm font-light">
               <thead className="border-b font-medium">
                  <tr>
                     <th scope="col" className=" py-2">
                        #
                     </th>
                     <th scope="col" className="px-12 py-2">
                        Date
                     </th>
                     <th scope="col" className="px-12 py-2">
                        Name
                     </th>
                     <th scope="col" className="px-24 py-2">
                        Email
                     </th>
                     <th scope="col" className="px-3 py-2">
                        Status
                     </th>
                  </tr>
               </thead>
               <tbody className="overflow-auto min-h-screen  h-screen overflow-y-visible" >
                  {studentsbyDate.map((student, index) => (
                     <tr key={student._id} className="border-b ease-in-out  shadow-inner drop-shadow-sm shadow-neutral-900">
                        <td className="px-6 py-3 border-r ">{index + 1}</td>
                        <td className="px-10 py-2 border-r">{new Date(student.date).toLocaleDateString()}</td>
                        <td className="px-10 py-2 border-r">{`${student.firstName} ${student.lastName}`}</td>
                        <td className="px-14 py-2 border-r">{student.email}</td>
                        <td className="px-3 py-2 ">{student.status ? student.status : 'Pending'}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
}