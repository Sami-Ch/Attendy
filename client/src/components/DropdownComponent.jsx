import React, { useState, useEffect, useRef } from "react";
import { TERipple } from "tw-elements-react";

function DropdownMenu({ isOpen, toggleDropdown, handleMenuItemClick, feilds }) {
   const dropdownRef = useRef(null);
   const optionStyle = "block py-0 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200"
   // event listener to handle clicks
   useEffect(() => {
      const handleOutsideClick = (e) => {
         if (isOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            toggleDropdown();
         }
      };

      window.addEventListener("click", handleOutsideClick);

      return () => {
         window.removeEventListener("click", handleOutsideClick);
      };
   }, [isOpen, toggleDropdown]);

   //!  {======================= RENDER STARTS HERE =========================}
   return (
      <div className="relative" ref={dropdownRef}>
         <button
            onClick={toggleDropdown}
            className="flex items-center rounded bg-primary pl-1 py-1 text-sm font-medium text-white"
            style={{ width: "5rem" }}
         >
            <span className="flex-grow">{feilds.title}</span>
            <div className="pl-3">
               {isOpen ?
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                     className="w-4 h-4 pr-1">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                     className="w-4 h-4 pr-1" >
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>}
            </div>
         </button>


         {isOpen && (
            <div className=" relative right-0 mt-0 w-32 rounded-md bg-white dark:bg-gray-800 ring-1">
               <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
               >
                  <a

                     onClick={() => { handleMenuItemClick(feilds.option1); }}
                     className={optionStyle}
                  >
                     {feilds.option1}
                  </a>
                  <a

                     onClick={() => { handleMenuItemClick(feilds.option2); }}
                     className={optionStyle}
                  >
                     {feilds.option2}
                  </a>
                  <a

                     onClick={() => { handleMenuItemClick(feilds.option3); }}
                     className={optionStyle}
                  >
                     {feilds.option3}
                  </a>
               </div>
            </div>
         )
         }
      </div>
   );
}

export default DropdownMenu;
