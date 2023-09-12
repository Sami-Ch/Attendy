import React, { useState, useRef, useEffect } from "react";
import {
   TETabs,
   TETabsContent,
   TETabsItem,
   TETabsPane,
   TERipple,
} from "tw-elements-react";
import ViewAttendance from "./ViewAttendance";
import Logout from "./Logout";
import axios from "axios";
import IP from "../IP";
import Cookies from "js-cookie";
import Loader from "./Loader";

export default function StudentTabs({ userData, getStudent }) {
   const [justifyActive, setJustifyActive] = useState("tab2");
   const [message, setMessage] = useState("");
   const [attendanceMarked, setAttendanceMarked] = useState(false);
   const [leaveRequest, setLeaveRequest] = useState("");
   const url = IP.IP;
   const textareaRef = useRef(null);

   useEffect(() => {
      // Check if attendance is marked for today
      const checkAttendance = async () => {
         try {
            const response = await axios.get(`${url}markattendance/${Cookies.get('_id')}`);
            setAttendanceMarked(response.data.attendanceMarked);
         } catch (error) {
            console.error("Error checking attendance:", error);
         }
      };
      checkAttendance();
   }, [url]);

   const markPresent = async () => {
      try {
         const response = await axios.get(`${url}markattendance/${Cookies.get('_id')}`);
         console.log(response);
         setAttendanceMarked(true);
         setMessage("Attendance marked successfully.");
      } catch (error) {
         console.error("Error marking attendance:", error);
         setMessage("Failed to mark attendance.");
      }
   };

   const handleLeaveRequestClick = async () => {
      try {
         const requestUrl = `${url}leaverequest`;
         const requestBody = {
            _id: Cookies.get('_id'),
            leaveRequest,
         };
         const response = await axios.post(requestUrl, requestBody);
         console.log(response);
         setMessage("Leave request sent successfully.");
      } catch (error) {
         console.error("Error sending leave request:", error);
         setMessage("Failed to send leave request.");
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
               onClick={() => handleJustifyClick("tab1")}
               active={justifyActive === "tab1"}
            >
               Mark Attendance
            </TETabsItem>
            <TETabsItem
               className="py-3"
               onClick={() => handleJustifyClick("tab2")}
               active={justifyActive === "tab2"}
            >
               View Attendance
            </TETabsItem>
            <TETabsItem
               className="py-3"
               onClick={() => handleJustifyClick("tab3")}
               active={justifyActive === "tab3"}
            >
               Leave Request
            </TETabsItem>
         </TETabs>

         <TETabsContent>
            <TETabsPane show={justifyActive === "tab1"}>
               <section className="my-40">
                  <div className="grid grid-cols-3">
                     <div className="col-span-1 flex justify-center  items-center">
                        <TERipple rippleColor="light">
                           <button
                              type="submit"
                              onClick={markPresent}
                              className={`rounded bg-success px-1.5 py-1 text-sm font-medium text-white ${attendanceMarked ? "pointer-events-none" : ""
                                 }`}
                           >
                              {attendanceMarked ? "Presented" : "PRESENT"}
                           </button>
                        </TERipple>
                     </div>
                     <div className="col-span-1"></div>
                     <div className="col-span-1"></div>
                  </div>
               </section>
               {message && <div>{message}</div>}
            </TETabsPane>

            <TETabsPane show={justifyActive === "tab2"}>
               <section>
                  <div className="ml-4 col-span-1 justify-center flex-row items-center">
                     <ViewAttendance userData={userData} />
                  </div>
               </section>
               <section></section>
            </TETabsPane>

            <TETabsPane show={justifyActive === "tab3"}>
               <section>
                  <div className="grid grid-cols-3">
                     <div className="col-span-1"></div>
                     <div className="col-span-1"></div>
                     <div className="grid grid-rows-1 justify-center items-center">
                        <div className="relative" data-te-input-wrapper-init>
                           <label className="my-3 text-red-500">
                              Admin Alert: Tread Lightly! 😉
                           </label>
                           <textarea
                              ref={textareaRef}
                              className="peer flex flex-row h-[15rem] w-[20rem] rounded border-2 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear text-sm"
                              rows="4"
                              placeholder="Write Your reason"
                              value={leaveRequest}
                              onChange={(e) => setLeaveRequest(e.target.value)}
                           ></textarea>
                        </div>
                        <TERipple rippleColor="light" className="my-3">
                           <button
                              type="submit"
                              className="rounded bg-success px-1.5 py-1 text-sm font-medium text-white"
                              style={{ margin: "0.1rem" }}
                              onClick={handleLeaveRequestClick}
                           >
                              REQUEST LEAVE
                           </button>
                        </TERipple>
                     </div>
                  </div>
               </section>
               {message && <div>{message}</div>}
            </TETabsPane>
         </TETabsContent>
         <div className={justifyActive === "tab3" ? "-mt-[0rem]" : (justifyActive === "tab2" ? "mt-[0px]" : "mt-[0px]")}>
            <Logout />
         </div>
      </div>
   );
}
