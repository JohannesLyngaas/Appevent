import { Facebook, Instagram, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navbar border-t  ">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 flex flex-col items-center text-center">
        {/* Grid for links, funksjoner og kontakt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* 🔗 Lenker */}
          <div className="flex flex-col items-center ">
            <h3 className="text-lg font-semibold mb-4">Lenker</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/om-oss"
                  className="text-muted-foreground hover:text-primary">
                  Om oss
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="text-muted-foreground hover:text-primary">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* 🎯 Funksjoner */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Funksjoner</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/home"
                  className="text-muted-foreground hover:text-primary">
                  Utforsk arrangementer
                </Link>
              </li>
            </ul>
          </div>

          {/* 📞 Kontaktinfo */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Kontakt oss</h3>
            <p className="text-muted-foreground">E-post: kontakt@Appevent.no</p>
            <p className="text-muted-foreground">Telefon: 123 45 678</p>

            {/* 🌐 Sentret sosiale medier */}
            <div className="flex justify-center space-x-6 mt-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition transform hover:scale-110">
                <Facebook className="h-7 w-7" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition transform hover:scale-110">
                <Instagram className="h-7 w-7" />
              </a>
              <a
                href="mailto:kontakt@arrangeit.no"
                className="text-muted-foreground hover:text-primary transition transform hover:scale-110">
                <Mail className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
