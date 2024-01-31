import { Coordinates, Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { CropperRef } from "react-advanced-cropper";
import { Button, Input } from "@nextui-org/react";

import { Image } from "@/models/index";

interface Props {
  image: Image | null;
  handleSetImage: (image: Image | null) => void;
}
export default function UploadImage(props: Props) {
  const cropperRef = useRef<CropperRef>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [tempImage, setTempImage] = useState<Image | null>(props.image);

  const onCrop = () => {
    if (cropperRef.current) {
      setCoordinates(cropperRef.current.getCoordinates());
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        props.handleSetImage({
          src: canvas.toDataURL(canvas.toDataURL()),
          type: props.image?.type,
        });
      }
    }
  };

  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files[0]) {
      const blob = URL.createObjectURL(files[0]);

      props.handleSetImage({
        src: blob,
        type: files[0].type,
      });
      setTempImage({
        src: blob,
        type: files[0].type,
      });
    }
    event.target.value = "";
  };

  useEffect(() => {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    return () => {
      if (tempImage && tempImage.src) {
        URL.revokeObjectURL(tempImage.src);
      }
    };
  }, [tempImage]);

  return (
    <div className="upload-example">
      {props.image !== null && (
        <Cropper
          ref={cropperRef}
          className=""
          src={tempImage && tempImage.src}
        />
      )}
      {props.image === null && (
        <Input
          onInput={onLoadImage}
          type="file"
          accept="image/*"
          onChange={onLoadImage}
        />
      )}
      <div className="mt-2 flex justify-center  gap-2 ">
        <Button
          size="sm"
          onClick={() => {
            props.handleSetImage(null);
            console.log("upload");
          }}
        >
          Reset
        </Button>

        <Button
          size="sm"
          onClick={() => {
            onCrop();
          }}
        >
          Resize
        </Button>
      </div>
    </div>
  );
}