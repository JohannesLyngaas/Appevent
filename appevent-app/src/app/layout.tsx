import '@/styles/globals.css'

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
          {children}
        </div>
      </body>
    </html>
  );
}
