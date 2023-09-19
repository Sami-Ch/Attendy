import React, { useState, useRef, useEffect } from "react";
import {
   TETabs,
   TETabsContent,
   TETabsItem,
   TETabsPane,
   TERipple,
   TECollapse
} from "tw-elements-react";
import ViewAttendance from "./ViewAttendance";
import Logout from "./Logout";
import axios from "axios";
import IP from "../IP";
import Cookies from "js-cookie";
import Loader from "./Loader";

export default function StudentTabs({ userData, getStudent }) {
   const [justifyActive, setJustifyActive] = useState("View Attendance");
   const [message, setMessage] = useState('');
   const [attendanceDisabled, setAttendanceDisabled] = useState(false);
   const [loading, setLoading] = useState(true);
   const url = IP.IP;
   const textareaRef = useRef(null);

   useEffect(() => {
      findMatchingAttendanceIndex(); // Initial check
   }, []);

   const markPresent = async () => {
      setLoading(true);
      await findMatchingAttendanceIndex(); // Check before marking attendance
      if (!attendanceDisabled) {
         try {
            await axios.get(`${url}markattendance/${Cookies.get('_id')}`);
            setAttendanceDisabled(true); // Disable attendance after marking
            setMessage("Attendance marked successfully. Hooray!");
            setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
         } catch (error) {
            console.error('Error marking attendance:', error);
            setMessage("Oops! Failed to mark attendance.");
            setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
         }
      }
   };

   const findMatchingAttendanceIndex = async () => {
      try {
         await getStudent(userData);
         setLoading(false);

         const currentDate = new Date();
         const currentYear = currentDate.getFullYear();
         const currentMonth = currentDate.getMonth();
         const currentDay = currentDate.getDate();

         const matchingIndex = userData.attendance.findIndex((attend) => {
            const attendanceDate = new Date(attend.date);
            const attendanceYear = attendanceDate.getFullYear();
            const attendanceMonth = attendanceDate.getMonth();
            const attendanceDay = attendanceDate.getDate();

            // Compare year, month, and day components
            return (
               currentYear === attendanceYear &&
               currentMonth === attendanceMonth &&
               currentDay === attendanceDay
            );
         });
         if (matchingIndex === -1) {
            setAttendanceDisabled(false); // Enable attendance if not found
         } else {
            setAttendanceDisabled(true); // Disable attendance if found
         }
      } catch (error) {
         console.error('Error finding matching attendance index:', error);
      }
   };

   const sendLeaveRequest = async () => {
      const textareaValue = textareaRef.current.value;
      setLoading(true); // Start loading

      await findMatchingAttendanceIndex(); // Check before sending leave request
      if (!attendanceDisabled) {
         const requestUrl = `${url}leaverequest`;
         const requestBody = {
            _id: Cookies.get('_id'),
            leaveRequest: textareaValue,
         };
         try {
            await axios.post(requestUrl, requestBody);
            setAttendanceDisabled(true)
            setMessage("Leave request sent successfully. Enjoy your break!");
            setTimeout(() => setMessage(''), 1000); // Clear message after 2 seconds
         } catch (error) {
            console.error('Error sending leave request:', error);
            setMessage("Oops! Failed to send leave request.");
            setTimeout(() => setMessage(''), 1000); // Clear message after 2 seconds
         }
      }
   };

   const handleJustifyClick = (value) => {
      if (value === justifyActive) {
         return;
      }
      setJustifyActive(value);
   };

   return (
      <div>
         <TETabs justify>
            <TETabsItem
               className="py-3"
               onClick={() => handleJustifyClick("Mark Attendance")}
               active={justifyActive === "Mark Attendance"}
            >
               Mark Attendance
            </TETabsItem>
            <TETabsItem
               className="py-3"
               onClick={() => handleJustifyClick("View Attendance")}
               active={justifyActive === "View Attendance"}
            >
               View Attendance
            </TETabsItem>
            <TETabsItem
               className="py-3"
               onClick={() => handleJustifyClick("Leave Request")}
               active={justifyActive === "Leave Request"}
            >
               Leave Request
            </TETabsItem>
         </TETabs>
         {loading ? (
            <div className="col-span-1 flex justify-center my-40 items-center">
               <Loader />
            </div>
         ) : (
            <TETabsContent>
               <TETabsPane show={justifyActive === "Mark Attendance"}>
                  <section className="my-40">
                     <div className="grid grid-cols-3">
                        <div className="col-span-1 flex justify-center items-center">
                           <TERipple rippleColor="light">
                              <button
                                 type="submit"
                                 onClick={markPresent}
                                 disabled={attendanceDisabled || loading} // Disable if attendanceDisabled or loading
                                 className={attendanceDisabled ? 'bg-red-500 rounded px-1.5 py-1 text-sm font-medium text-white' : 'bg-success rounded px-1.5 py-1 text-sm font-medium text-white'}
                              >
                                 {attendanceDisabled ? 'MARKED' : 'PRESENT'}
                              </button>
                           </TERipple>
                        </div>
                        {/* Empty second column */}
                        <div className="col-span-1"></div>
                        {/* Empty third column */}
                        <div className="col-span-1"></div>
                     </div>
                  </section>
                  {message && <div>{message}</div>}
               </TETabsPane>

               <TETabsPane show={justifyActive === "View Attendance"}>
                  <section>
                     <div className="ml-4 col-span-1 justify-center flex-row items-center">
                        <ViewAttendance userData={userData} />
                     </div>
                  </section>
                  <section></section>
               </TETabsPane>
               {/* leave request starts here */}
               <TETabsPane show={justifyActive === "Leave Request"}>
                  <section>
                     <div className="grid grid-cols-3">
                        <div className="col-span-1"></div>
                        {/* Empty first column */}
                        <div className="col-span-1"></div>
                        {/* Empty second column */}
                        <div className="grid grid-rows-1 justify-center items-center">
                           <TECollapse show={!attendanceDisabled}>
                              <div className="relative">
                                 <label className="my-3 text-red-500">
                                    Admin Alert: Tread Lightly! 😉
                                 </label>
                                 <textarea
                                    ref={textareaRef}
                                    className="peer flex flex-row h-[15rem] w-[20rem] rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear text-sm"
                                    rows="4"
                                    placeholder="Write Your reason"
                                 ></textarea>
                              </div>
                              <TERipple rippleColor="light" className="my-3">
                                 <button
                                    type="submit"
                                    className={attendanceDisabled ? 'bg-red-500 rounded my-40 px-1.5 py-1 text-sm font-medium text-white' : 'bg-success rounded px-1.5 text-sm font-medium text-white'}
                                    disabled={attendanceDisabled || loading} // Disable if attendanceDisabled or loading
                                    onClick={sendLeaveRequest} // Add the click event handler
                                 >
                                    REQUEST LEAVE
                                 </button>
                              </TERipple>
                           </TECollapse>
                           {attendanceDisabled && <TERipple rippleColor="light" className="my-3">
                              <button
                                 type="submit"
                                 className={attendanceDisabled ? 'bg-red-500 rounded my-40 px-1.5 py-1 text-sm font-medium text-white' : 'bg-success rounded px-1.5 text-sm font-medium text-white'}
                                 disabled={attendanceDisabled || loading} // Disable if attendanceDisabled or loading
                                 onClick={sendLeaveRequest} // Add the click event handler
                              >
                                 MARKED
                              </button>
                           </TERipple>}
                        </div>
                     </div>
                  </section>
                  {message && <div>{message}</div>}
               </TETabsPane>
            </TETabsContent>
         )}
      </div>
   );
}
