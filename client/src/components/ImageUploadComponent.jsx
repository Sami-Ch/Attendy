import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import IP from '../IP';
import Loader from './Loader';


export default function ImageUploadComponent({ _id, getStudent }) {
   const requestUrl = `${IP.IP}updateprofile`;
   let imageData
   // Data states
   const [message, setMessage] = useState('');
   const [error, setError] = useState(false);
   const [loading, setLoading] = useState(false); // Added loading state

   const fileInputRef = useRef();

   useEffect(() => {
      if (message || error) {
         // Clear message and error after 5 seconds
         const timer = setTimeout(() => {
            setMessage('');
            setError(false);

         }, 5000);

         return () => {
            clearTimeout(timer);
         };
      }
   }, [message, error]);

   const handleFileInputChange = () => {
      setMessage('');
      setError(false);
      fileInputRef.current.click();
   };

   const handleProfileUpdate = async (e) => {
      try {
         setLoading(true); // Set loading state when the request is sent

         const formData = new FormData();
         formData.append('_id', _id);
         formData.append('file', e.target.files[0]);

         const response = await axios.post(requestUrl, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });

         await getStudent();

         setMessage('Image saved successfully. It may take time to render.');
         setError(response.data.error);
      } catch (error) {
         setError(true);
         setMessage(`${error.response ? error.response.data.message : error.message}`);
      } finally {
         setLoading(false); // Clear loading state when the response is received
      }
   };

   return (
      <div className='mt-3'>
         <input
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleProfileUpdate}
         />
         <button
            type="file"
            onClick={handleFileInputChange}
            className="inline-block rounded px-2 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700"
         >
            Edit image
         </button>
         {loading ? <div className='mt-2'><Loader /> </div> : null} {/* Display loader while loading */}
         {message && <p>{message}</p>}
         {error && <p style={{ color: 'red' }}>Error occurred.</p>}
      </div>
   );
}
