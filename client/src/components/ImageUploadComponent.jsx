import React, { useState } from 'react';
import axios from 'axios';

export default function ImageUploadComponent({ _id }) {
   const requestUrl = `http://localhost:4000/updateprofile`;
   // data states
   const [selectedFile, setSelectedFile] = useState(null);
   const [message, setMessage] = useState('');
   const [error, setError] = useState(false);

   const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
   };

   const handleProfileUpdate = async () => {
      try {

         const formData = new FormData();
         formData.append('_id', _id); // Assuming you have an input field for student ID
         formData.append('file', selectedFile);

         const response = await axios.post(requestUrl, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         // setImage(response.data.imageUrl)
         setMessage(response.data.message);
         setError(response.data.error);
      } catch (error) {
         setError(true);
         setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      }
   };

   return (
      <div>
         <p>Profile Update</p>
         <input type="file" onChange={handleFileChange} />
         <button onClick={handleProfileUpdate}>Update Profile</button>
         {message && <p>{message}</p>}
         {error && <p style={{ color: 'red' }}>Error occurred.</p>}
      </div>
   );
}


