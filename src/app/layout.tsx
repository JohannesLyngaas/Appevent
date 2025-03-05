import '@/styles/globals.css'

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/Header";
import { SESSION_COOKIE_NAME } from '@/lib/constants'; // added

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({
  children,
}: DefaultLayoutProps) {

  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;

  return (
    <html lang="no"
    className='size-full scroll-smooth'
    >
      <body className='antialiased size-full'>
        <div className='flex flex-col size-full'>
          <Header session={session} />
          <main className='~px-4/24 mx-auto w-full max-w-screen-2xl flex-grow py-6'>
            {children}
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
