import React, { useState, useEffect, useRef } from "react";
import { TERipple } from "tw-elements-react";

function DropDownComponent({ saveVal, fields, from, studentData }) {
   const dropdownRef = useRef(null);
   const optionStyle = "block w-full whitespace-nowrap bg-transparent px-4 pd-1 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
   const [isOpen, setIsOpen] = useState(false)

   const handleMenuItemClick = (e) => {
      event.preventDefault();
      setIsOpen(!isOpen);
      if (from === "RQ") {
         saveVal(e, studentData)
         return;
      }

      saveVal(e);

   };

   const toggleDropdown = () => {

      event.preventDefault();
      setIsOpen(!isOpen);


   };

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
      <div className=" origin-top-right  rounded-md  " ref={dropdownRef}>
         <button
            onClick={toggleDropdown}
            className="flex items-center rounded dark:bg-slate-300 bg-slate-600 pl-1 py-1 text-sm font-medium text-white "

         >
            <span className="flex-grow">
               {fields.title}
            </span>

            <div className="ml-2 w-2">
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
            <div
               className="absolute z-[1000] w-32 max-h-60 overflow-y-auto rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg"
               style={{ zIndex: 9999, userSelect: 'none' }} // Set user-select to 'none'
            >
               <div className="" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div
                     className=""
                     role="menu"
                     aria-orientation="Vertical"
                     aria-labelledby="options-menu"
                  >
                     <a
                        onClick={() => { handleMenuItemClick(fields.option1); }}
                        className={optionStyle}
                     >
                        {fields.option1}
                     </a>
                     <a
                        onClick={() => { handleMenuItemClick(fields.option2); }}
                        className={optionStyle}
                     >
                        {fields.option2}
                     </a>
                     <a
                        onClick={() => { handleMenuItemClick(fields.option3); }}
                        className={optionStyle}
                     >
                        {fields.option3}
                     </a>
                  </div>
               </div>
            </div>

         )}

      </div>
   );
}

export default DropDownComponent;
