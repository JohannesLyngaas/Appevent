"use client"

import Link from "next/link"
import { Button } from "../ui/button"

interface CloseButtonProps {
  onClick?: () => void
}

function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <Link href="/home" className="flex justify-end">
      <Button
        onClick={(e) => {
          if (onClick) {
            onClick()
          }
        }}
        className="hover:bg-slate-500 text-lg font-semibold hover:scale-105 w-52"
        variant={"destructive"}
      >
        Avbryt
      </Button>
    </Link>
  )
}

export { CloseButton }

