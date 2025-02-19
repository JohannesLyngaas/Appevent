interface EventPageLayoutProps {
  children: React.ReactNode;
}

export function EventPageLayout({ children }: EventPageLayoutProps) {
  return (
    <div className="relative min-h-screen min-w-screen bg-[#E9EDC9] grid grid-cols-1">
      <div className="absolute inset-0 bg-[url('/festningen.jpg')] bg-cover bg-center bg-fixed opacity-20" />
      <div className="relative">{children}</div>
    </div>
  );
}
