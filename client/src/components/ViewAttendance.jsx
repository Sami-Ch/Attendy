import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IP from '../IP';
import Cookies from 'js-cookie';
import Loader from './Loader';

export default function ViewAttendance({ userData, getStudent }) {
   const [attendanceData, setAttendanceData] = useState([]);
   const [totals, setTotals] = useState({ totalAttendance: 0, presents: 0, absents: 0, leaves: 0 });
   const [isLoading, setIsLoading] = useState(true);

   function renderAttendanceRows(attendanceData) {

      return attendanceData.map((entry, index) => (

         <tr key={index} className="border-b dark:border-neutral-500">
            <td className=" border-r px-4 py-2 font-medium dark:border-neutral-500">
               {new Date(entry.date).toLocaleDateString()}
            </td>
            <td
               className={`px-4 py-2 ${entry.status === 'present' ? 'bg-success' : ''
                  } dark:border-neutral-500`}
            >
               {entry.status === 'present' ? 'Present' : ''}
            </td>
            <td
               className={`px-4 py-2 ${entry.status === 'absent' ? ' bg-red-500' : ''
                  } dark:border-neutral-500`}
            >
               {entry.status === 'absent' ? 'Absent' : ''}
            </td>
            <td
               className={`px-4 py-2 ${entry.status === 'leave' ? 'bg-primary' : ''
                  } dark:border-neutral-500`}
            >
               {entry.status === 'leave' ? 'Leave' : ''}
            </td>
         </tr>
      ));
   }

   function renderAttendanceTotals(totals) {
      return (
         <tr className="border-b dark:border-neutral-500  bg-gray-600">
            <td className="px-4 py-2  border-r font-medium ">Total</td>
            <td className="px-4 py-2  ">{totals.presents ? totals.presents : 0}</td>
            <td className="px-4 py-2  ">{totals.absents ? totals.absents : 0}</td>
            <td className="px-4 py-2  ">{totals.leaves ? totals.leave : 0}</td>
         </tr>
      );
   }

   useEffect(() => {
      // Fetch total counts
      const fetchData = async () => {
         try {
            const response = await axios.get(`${IP.IP}getcount/${Cookies.get('_id')}`);
            setTotals(response.data);
         } catch (error) {
            console.error('Error fetching total counts:', error);
         }
      };
      fetchData();

      if (userData.attendance) {
         setAttendanceData(userData.attendance);
      }
      setTimeout(() => { setIsLoading(false); }, [totals])

   }, [userData]);

   return (
      <div className="flex flex-col">
         <div className="mx-6">
            <div className="inline-block min-w-full py-2 sm:px-6 px-8">
               {isLoading ? (
                  <div className="text-center my-8">
                     <Loader />
                  </div>
               ) : (
                  <div className="overflow-y-auto max-h-96">
                     <table className="min-w-full  text-center text-sm ">
                        <thead className="border-b font-medium ">
                           <tr>
                              <th scope="col" className=" px-6 py-4">
                                 Date
                              </th>
                              <th scope="col" className="px-6 py-4 ">
                                 Presents
                              </th>
                              <th scope="col" className="px-6 py-4 ">
                                 Absents
                              </th>
                              <th scope="col" className="px-6 py-4">
                                 Leaves
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {renderAttendanceRows(attendanceData)}
                           {renderAttendanceTotals(totals)}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

