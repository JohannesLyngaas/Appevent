interface EventPageLayoutProps {
  children: React.ReactNode;
}

export function EventPageLayout({ children }: EventPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 px-4">
        {children}
      </div>
    </div>
  );
}
