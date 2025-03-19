import '@/styles/globals.css'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import { cookies } from 'next/headers';
import { Toaster } from "sonner"
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/Header";
import { SESSION_COOKIE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({
  children,
}: DefaultLayoutProps) {

  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;

  return (
    <html lang="no"
    className={cn('size-full scroll-smooth', GeistSans.className)}
    >
      <body className='antialiased size-full'>
        <div className='flex flex-col size-full'>
          <Header session={session} />
          <main className='~px-4/24 mx-auto w-full max-w-screen-2xl flex-grow py-6'>
            {children}
          </main>
          <Toaster position="top-center" theme="system" duration={5000} closeButton/>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
