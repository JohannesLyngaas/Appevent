type LoginLayoutProps = {
  children: React.ReactNode;
};

export default async function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="flex items-center justify-center size-full">
      {children}
    </div>
  );
}