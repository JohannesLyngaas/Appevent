"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

interface ImageUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  onDeleteSuccess?: () => void;
  isOptional?: boolean;
}

export function ImageUploader({
  onUploadSuccess,
  onDeleteSuccess,
  isOptional = true,
}: ImageUploaderProps) {
  const defaultImageUrl =
  "https://res.cloudinary.com/dxeluefou/image/upload/v1741608101/cat_iytvus.jpg";

  const [uploadConfirmed, setUploadConfirmed] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    defaultImageUrl
  );
  const [publicId, setPublicId] = useState<string | undefined>(undefined);

  const handleDeleteImage = async () => {
    if (publicId) {
      try {
        const response = await fetch("/api/delete-cloudinary-image", {
          method: "POST",
          body: JSON.stringify({ publicId }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.success) {
          //Reset alt
          setUploadedImageUrl(defaultImageUrl);
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
          onUploadSuccess(imageUrl, publicId);
          setUploadConfirmed(true);
        }
      }}
      options={{
        singleUploadAutoClose: true,
      }}
    >
      {({ open }) => (
        <div className="flex flex-col items-center gap-1">
          {!uploadConfirmed ? (
            <div className="flex flex-col items-center gap-1">
              {isOptional && (
                <p className="text-sm text-muted-foreground mt-1">
                  Valgfritt. Standard bilde vil brukes hvis ingen lastes opp.
                </p>
              )}
              <div className="mt-2">
                <Image
                  src={defaultImageUrl}
                  alt="Default image"
                  width={150}
                  height={150}
                  className="rounded-md w-full h-60 object-cover border"
                />
              </div>

              <label
                onClick={() => open()} // Opens Cloudinary upload widget
                className="cursor-pointer border border-border hover:scale-105 rounded-md p-3 flex items-center gap-2"
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
                <span className="text-text">Last opp eget bilde</span>
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Image
                src={uploadedImageUrl! || defaultImageUrl}
                alt="Uploaded image"
                width={150}
                height={150}
                className="rounded-md max-w-[200px] max-h-[200px] object-cover"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => open()}
                  className="text-blue-500 hover:text-white hover:bg-blue-500 bg-transparent border border-blue-500 rounded-md py-1 px-4"
                >
                  Bytt bilde
                </button>
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="text-red-500 hover:text-white hover:bg-red-500 bg-transparent border border-red-500 rounded-md py-1 px-4"
                >
                  Slett bilde
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
}
