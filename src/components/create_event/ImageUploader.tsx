// components/avatar-uploader.tsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  onDeleteSuccess?: () => void;
}

export function ImageUploader({ onUploadSuccess, onDeleteSuccess }: ImageUploaderProps) {

  const [uploadConfirmed, setUploadConfirmed] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(undefined);
  const [publicId, setPublicId] = useState<string | undefined>(undefined);
  
  const handleDeleteImage = async () => {
    if (publicId) {
      try {
        const response = await fetch('/api/delete-cloudinary-image', {
          method: 'POST',
          body: JSON.stringify({ publicId }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success) {
          //Reset alt
          setUploadedImageUrl(undefined); 
          setPublicId(undefined); 
          setUploadConfirmed(false); 

          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
        } else {
          alert("Error deleting image from Cloudinary.");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error deleting image.");
      }
    }
  };

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={async (result) => {
        if (typeof result.info === "object" && "secure_url" in result.info) {
          const imageUrl = result.info.secure_url;
          const publicId = result.info.public_id;

          setUploadedImageUrl(imageUrl);
          setPublicId(publicId);
          onUploadSuccess(result.info.secure_url);
          setUploadConfirmed(true);
        }
      }}
      options={{
        singleUploadAutoClose: true,
      }}
    >
      {({ open }) => (
        <div className="flex items-center gap-4">
          {/* Custom File Upload Label */}
          {!uploadConfirmed ? (
            <label
            onClick={() => open()} // Opens Cloudinary upload widget
            className="cursor-pointer bg-[#FEFFF4] border border-border rounded-md p-3 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#96A074]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-text">Velg bilde</span>
          </label>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Image
                src={uploadedImageUrl!}
                alt="Uploaded image"
                width={150}
                height={150}
                className="rounded-md max-w-[200px] max-h-[200px] object-cover"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="text-red-500 hover:text-white hover:bg-red-500 bg-transparent border border-red-500 rounded-md py-1 px-4 mt-2"
                disabled={false}
              >
                Slett bilde og erstatt
              </button>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
}
