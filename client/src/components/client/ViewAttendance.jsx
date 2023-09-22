import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IP from '../../IP';
import Cookies from 'js-cookie';
import Loader from '../genral/Loader';

export default function ViewAttendance({ userData }) {
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
            <td
               className={`px-4 py-2 ${entry.leaveRequest ? ' font-semibold bg-zinc-200 text-primary-700' : ''
                  } dark:border-neutral-500 boarder-l-2`}
            >
               {entry.leaveRequest ? 'Pending' : ''}
            </td>
         </tr>
      ));
   }

   function renderAttendanceTotals(totals) {
      return (
         <tr className="border-b dark:border-black  bg-stone-500">
            <td className="px-4 py-2 text-white border-r font-medium ">Total</td>
            <td className="px-4 py-2 text-white ">{totals.presents ? totals.presents : 0}</td>
            <td className="px-4 py-2 text-white ">{totals.absents ? totals.absents : 0}</td>
            <td className="px-4 py-2 text-white">{totals.leaves ? totals.leave : 0}</td>
            <td className="px-4 py-2 border-2 bg-amber-300 border-red-800  text-slate-700 ">Total: {totals.leaves + totals.presents + totals.absents}</td>
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
         <div className=" w- mx-2">
            <div className="inline-block min-w-20  py-1 px-3">
               {isLoading ? (
                  <div className="text-center my-8">
                     <Loader />
                  </div>
               ) : (
                  <div className="overflow-y-auto max-h-96">
                     <table className="min-w-full  text-center text-sm  shadow-inner shadow-neutral-900">
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
                              <th scope="col" className="px-6 py-4">
                                 Leaves Request
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

