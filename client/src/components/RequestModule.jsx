import React, { useState, useEffect } from 'react';
import DropDownComponent from './DropdownComponent';
import { TERipple } from 'tw-elements-react';
import IP from '../IP';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function RequestModule({ studentsData, getStudents }) {
   const [status, setStatus] = useState('');
   const [selectedStudent, setSelectedStudent] = useState(null);
   const [successMessage, setSuccessMessage] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const [showSaveButton, setShowSaveButton] = useState(false);
   const [hasTodayAttendance, setHasTodayAttendance] = useState(false);

   const saveVal = (val, studentData) => {
      setStatus(val);
      setSelectedStudent(studentData);
      setShowSaveButton(true); // Show the save button
   };

   const handleSaveAttendance = async () => {
      const requestUrl = `${IP.IP}editattandance`;
      const headers = {
         Authorization: Cookies.get('token'),
      };

      try {
         const response = await axios.post(
            requestUrl,
            {
               attendance: {
                  date: selectedStudent.date,
                  status: status.toLowerCase(),
               },
               _id: selectedStudent.student._id,
            }, {
            headers: { Authorization: Cookies.get('token') },

         },

         );

         //console.log('Response:', response);

         // Display success message and hide save button
         setSuccessMessage('Attendance saved successfully');
         await getStudents()
         // Reset the status and selectedStudent
         setStatus('');
         setSelectedStudent(null);

         // Hide the success message after 2000ms
         setTimeout(() => {
            setSuccessMessage('');
            setShowSaveButton(false);
         }, 2000);
      } catch (error) {
         console.error('Error:', error);

         // Display error message and hide save button
         setErrorMessage('Failed to save attendance');
         setShowSaveButton(false);

         // Hide the error message after 2000ms
         setTimeout(() => {
            setErrorMessage('');
         }, 2000);
      }
   };

   const checkLeaveRequest = (student) => {
      return (
         student.attendance &&
         student.attendance.some(
            (attendance) =>
               new Date(attendance.date).toDateString() === new Date().toDateString() &&
               attendance.leaveRequest !== undefined
         )
      );
   };

   useEffect(() => {
      const hasAttendance = studentsData.students.some(checkLeaveRequest);
      setHasTodayAttendance(hasAttendance);
   }, [studentsData.students]);

   const renderAttendance = (attendances, student) => {
      const currentDate = new Date().toDateString();
      const todayAttendance = attendances.find(
         (attendance) =>
            new Date(attendance.date).toDateString() === currentDate &&
            attendance.leaveRequest !== undefined
      );

      if (todayAttendance) {
         return (
            <div className='flex flex-row'>
               <div className="px-3 py-2 border-r">
                  <p>Date: {new Date(todayAttendance.date).toLocaleDateString()}</p>
               </div>
               <div className="px-3 py-2 border-r">
                  <DropDownComponent
                     saveVal={saveVal}
                     fields={{
                        title: status ? status : 'Mark attendance',
                        option1: 'Absent',
                        option2: 'Present',
                        option3: 'Leave',
                     }}
                     from="RQ"
                     studentData={{
                        student: student,
                        date: todayAttendance.date,
                     }}
                     style={{ zIndex: 9999 }} // Set a higher z-index value
                  />
               </div>
            </div>
         );
      }
   };

   const renderStudent = () => {
      return studentsData.students
         .filter(checkLeaveRequest)
         .map((student) => {
            return (
               <tr
                  key={student._id}
                  className="border-b transition duration-300 ease-in-out"
               >
                  <td className="px-3 py-2 border">
                     {`${student.firstName} ${student.lastName}`}
                  </td>
                  <td className="px-3 py-2 border">{student.email}</td>
                  <td>
                     {renderAttendance(student.attendance, student)}
                  </td>
               </tr>
            );
         });
   };

   return (
      <div className="flex flex-col">
         {hasTodayAttendance ? (
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
               <table className="min-w-full text-left text-md font-light">
                  <thead className="border-b font-medium">
                     <tr>
                        <th scope="col" className="px-3 py-2">
                           Name
                        </th>
                        <th scope="col" className="px-3 py-2">
                           email
                        </th>
                        <th className="px-3 py-2">Date</th>
                     </tr>
                  </thead>
                  <tbody>{renderStudent()}</tbody>
               </table>
            </div>
         ) : (
            <div className="text-center my-6">
               {studentsData.students.length > 0 ? (
                  <p>No Requests for today </p>
               ) : (
                  <p>No attendance data available</p>
               )}
            </div>
         )}

         {successMessage && (
            <div className="text-green-600 mt-2">{successMessage}</div>
         )}

         {errorMessage && (
            <div className="text-red-600 mt-2">{errorMessage}</div>
         )}

         {showSaveButton && (
            <TERipple rippleColor="light">
               <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="relative rounded mt-2 bg-primary px-1.5 py-1 text-sm font-medium text-white"
               >
                  SAVE
               </button>
            </TERipple>
         )}
      </div>
   );
}
