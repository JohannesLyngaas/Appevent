import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  return (
    <div className="bg-navbar p-4 flex border-b justify-between items-center">
      <Link href="/home" className="text-2xl font-semibold text-primary">
        AppEvent
      </Link>

      <div className="flex space-x-4">
        <Link href="/create_event" className="px-3 py-1 text-white hover:underline">
          Opprett arrangement
        </Link>
        <Link href="/login" className="text-primary bg-white px-3 py-1 rounded hover:bg-primary/90 hover:text-white">
          Logg inn
        </Link>
        <Link href="/register" className="text-white bg-primary px-3 py-1 rounded hover:bg-secondary/80 hover:text-primary">
          Registrer deg
        </Link>
      </div>
    </div>
  )
}

export { Navbar };