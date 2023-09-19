import React from 'react';

export default function StudentRecords({ studentsData }) {


   const renderStudent = () => {
      return studentsData.students.map((student, index) => (
         <tr
            key={student._id}
            className="border-b  ease-in-out"
         >
            <td className=" px-6 py-4 border">
               {index + 1}
            </td>
            <td className=" px-4 py-2 border">
               {`${student.firstName} ${student.lastName}`}
            </td>
            <td className=" px-6 py-4 border">{student.email}</td>

            <td className=" px-6 py-4 border">
               {student.attendanceCount?.presents || 0}
            </td>
            <td className=" px-6 py-4 border">
               {student.attendanceCount?.absents || 0}
            </td>
            <td className=" px-6 py-4 border">
               {student.attendanceCount?.leaves || 0}
            </td>
            <td className=" px-6 py-4 border">
               {student.grade}
            </td>
            <td className=" px-6 py-4 border">

            </td>
            {/* <td>
               <button
                  type="file"
                  onClick={handleSelectedStudent(student)}
                  className="inline-block rounded px-2 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
               >
                  Edit image
               </button>
            </td> */}
         </tr>
      ));
   };

   return (
      <div className="flex flex-col ">
         <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="">
               <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium">
                     <tr>
                        <th scope="col" className="pl-6 py-2">
                           #
                        </th>
                        <th scope="col" className="px-12 py-2">
                           Name
                        </th>
                        <th scope="col" className="px-24 py-2">
                           email
                        </th>
                        <th scope="col" className="px-3 py-2">
                           Present
                        </th>
                        <th scope="col" className="px-3 py-2">
                           Absent
                        </th>
                        <th scope="col" className="px-3 py-2">
                           Leave
                        </th>
                        <th scope="col" className="px-3 py-2">
                           Grade
                        </th>
                     </tr>
                  </thead>
                  <tbody>{renderStudent()}</tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
