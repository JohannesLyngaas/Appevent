// Her defineres header, main-innhold og footer
// Header inneholder en enkel navigasjon med logg inn / registrer deg-knapper
// Main viser innholdet til hver side, og footer har en enkel copyright-tekst

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Appevent</h1>
          <nav>
            <Link href="/login">
              <Button variant="ghost">Logg inn</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="ml-2">
                Registrer deg
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">{children}</main>

      <footer className="bg-muted text-muted-foreground py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Appevent. Alle rettigheter reservert.</p>
        </div>
      </footer>
    </div>
  )
}