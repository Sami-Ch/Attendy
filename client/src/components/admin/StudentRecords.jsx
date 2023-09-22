import React from 'react';

export default function StudentRecords({ studentsData }) {


   function handleSelectedStudent(student) {
      console.log('====================================');
      console.log(student.firstName);
      console.log('====================================');
   }

   const renderStudent = () => {
      return studentsData.students.map((student, index) => (
         <tr
            key={student._id}
            className="border-b  ease-in-out "
         >
            <td className=" px-6 py-3 border-r">
               {index + 1}
            </td>
            <td className=" px-3 py-2 border">
               {`${student.firstName} ${student.lastName}`}
            </td>
            <td className=" px-6 py-3 border">{student.email}</td>

            <td className=" px-6 py-3 border">
               {student.attendanceCount?.presents || 0}
            </td>
            <td className=" px-6 py-3 border">
               {student.attendanceCount?.absents || 0}
            </td>
            <td className=" px-6 py-3 border">
               {student.attendanceCount?.leaves || 0}
            </td>
            <td className=" px-6 py-3 ">
               {student.grade}
            </td>
            <td className=" px-3 py-2 ">

               <button
                  type="button"
                  onClick={() => handleSelectedStudent(student)}
                  className="inline-block rounded px-2  text-xs font-medium uppercase leading-normal text-primary hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
               >
                  View Attendance
               </button>

            </td>
         </tr>
      ));
   };

   return (
      <div className="flex flex-col ">
         <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="">
               <table className=" mt-5 text-sm font-light ">
                  <thead className="border-b font-medium">
                     <tr >
                        <th scope="col" className="">
                           #
                        </th>
                        <th scope="col" className=" px-12 py-3">
                           Name
                        </th>
                        <th scope="col" className="px-24 py-3">
                           email
                        </th>
                        <th scope="col" className="px-3 py-3">
                           Present
                        </th>
                        <th scope="col" className="px-3 py-3">
                           Absent
                        </th>
                        <th scope="col" className="px-3 py-3">
                           Leave
                        </th>
                        <th scope="col">
                           Grade
                        </th>
                     </tr>
                  </thead>
                  <tbody className='  shadow-inner shadow-neutral-900 overflow-auto'>{renderStudent()}</tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
