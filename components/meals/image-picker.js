'use client';
import { useRef, useState } from 'react';
import classes from './image-picker.module.css';
import Image from 'next/image';

export default function ImagePicker({ name, label }) {
  const [pickedImage, setPickedImage] = useState();
  const imageInput = useRef();
  function handlePickImage() {
    imageInput.current.click();
  }
  function handleImageChange(event) {
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0];
      if (!pickedFile) {
        setPickedImage(null);
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPickedImage(fileReader.result);
      };
      fileReader.readAsDataURL(pickedFile);
      // you can also do something with the picked file, e.g., upload it or display a preview
    }
  }
  return (
    <>
      <div className={classes.picker}>
        <label htmlFor={name}>{label}</label>
        <div className={classes.controls}>
          <div className={classes.preview}>
            {!pickedImage && <p>No image picked yet.</p>}
            {pickedImage && <Image src={pickedImage} alt="Picked" fill />}
          </div>
          <input
            type="file"
            id={name}
            name={name}
            accept="image/*"
            className={classes.input}
            ref={imageInput}
            onChange={handleImageChange}
            required
          />
          <button
            className={classes.button}
            type="button"
            onClick={handlePickImage}
          >
            {' '}
            Pick an Image{' '}
          </button>
        </div>
      </div>
    </>
  );
}
