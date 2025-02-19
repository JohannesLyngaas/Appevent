import '@/styles/globals.css'

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import { Footer } from "@/components/layout/footer";
import { Navbar as Header} from "@/components/layout/Navbar";
import { SESSION_COOKIE_NAME } from '@/lib/firebase/constants'; // added

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: DefaultLayoutProps) {
  return (
    <html lang="en"
    className='size-full scroll-smooth'
    >
      <body className='antialiased size-full'>
        <div className='flex flex-col size-full'>
          <Header />
          <main className='~px-4/24 mx-auto w-full max-w-screen-2xl flex-grow py-6'>
            {children}
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
