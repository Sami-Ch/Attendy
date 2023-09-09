import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageCompressor } from 'image-compressor';

const imageCompressor = new ImageCompressor;
const compressorSettings = {
   toWidth: 170,
   toHeight: 170,
   quality: 1,

   speed: 'low'
};

const url = 'http://localhost:4000';

function CircularImage({ imageData }) {
   if (!imageData) {
      return null;
   }

   console.log(imageData)
   return (
      <div>
         <h2>Image Display</h2>
         <img
            style={{ flex: 1, height: 170, width: 170, borderRadius: '50%' }}
            src={`data:image/webp;base64,${imageData}`}
            alt=""
         />
      </div>
   );
}

export default function ImageComponent() {
   const [imageData, setImageData] = useState(null);
   const [editing, setEditing] = useState(false);
   const [newImageData, setNewImageData] = useState(null);

   useEffect(() => {
      // Perform the Axios request when the component mounts
      axios
         .post(`${url}/getstudent`, { email: 'sami@gmail.com' })
         .then((response) => {
            const buffer = response.data.student.profileImage.imageData.data;
            setImageData(btoa(String.fromCharCode(...new Uint8Array(buffer))));
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   }, []);

   const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = async (e) => {
            try {
               const imageData = e.target.result;
               // Compress the selected image file before setting it in state
               await imageCompressor.run(imageData, compressorSettings, (data) => { console.log(data.split(',')[1]); setNewImageData(data) });
               // setNewImageData(imageData);
            } catch (error) {
               console.error('Error:', error);
            }
         };
         reader.readAsDataURL(file);
      }
   };

   const handleEditImage = () => {
      setEditing(true);
   };

   const handleSaveImage = async () => {
      if (newImageData) {
         try {
            const base64 = newImageData.split(',')[1];
            await axios.post(`${url}/updateprofile`, {
               email: 'sami@gmail.com',
               imageData: base64,
            }).then((res) => {
               setImageData(res.data.imageData);
               setEditing(false);
            });

            // Update the displayed image with the new data


         } catch (error) {
            console.error('Error:', error);
         }
      }
   };

   return (
      <div>
         <CircularImage imageData={imageData} />
         {editing ? (
            <div>
               <input type="file" accept="image/*" onChange={handleImageUpload} />
               <button onClick={handleSaveImage}>Save Image</button>
            </div>
         ) : (
            <button onClick={handleEditImage}>Edit Image</button>
         )}
      </div>
   );
}

