"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { useState } from "react"

interface CloseButtonProps {
  onClick?: () => void
  publicId?: string | null
}

function CloseButton({ onClick, publicId }: CloseButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClick = async () => {
    // If there's an image to delete
    if (publicId) {
      try {
        setIsDeleting(true)
        // Delete the image from Cloudinary
        const response = await fetch("/api/delete-cloudinary-image", {
          method: "POST",
          body: JSON.stringify({ publicId }),
          headers: { "Content-Type": "application/json" },
        })

        const data = await response.json()
        if (!data.success) {
          console.error("Failed to delete image from Cloudinary")
        }
      } catch (error) {
        console.error("Error deleting image:", error)
      } finally {
        setIsDeleting(false)
      }
    }

    // Call the original onClick handler if provided
    if (onClick) {
      onClick()
    }
  }

  return (
    <Link
      href="/home"
      className="flex justify-end"
      onClick={(e) => {
        // Prevent navigation until we've handled the image deletion
        if (publicId) {
          e.preventDefault()
          handleClick().then(() => {
            // Navigate after deletion is complete
            window.location.href = "/home"
          })
        } else if (onClick) {
          e.preventDefault()
          onClick()
          window.location.href = "/home"
        }
      }}
    >
      <Button
        className="hover:bg-slate-500 text-lg font-semibold hover:scale-105 w-52"
        variant={"destructive"}
        disabled={isDeleting}
      >
        {isDeleting ? "Sletter..." : "Avbryt"}
      </Button>
    </Link>
  )
}

export { CloseButton }
