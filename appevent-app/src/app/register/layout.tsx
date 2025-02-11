
type RegistrationLayoutProps = {
  children: React.ReactNode;
};

export default async function RegistrationLayout({
  children,
}: RegistrationLayoutProps) {

  return (
    <>
    <div className="flex items-center justify-center size-full">
      {children}
    </div>
    </>
  )
}