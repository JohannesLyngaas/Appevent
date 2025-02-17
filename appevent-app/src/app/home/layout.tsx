import { Layout } from "@/components/layout/Layout"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <main className="container mx-auto mt-8 px-4">{children}</main>
    </Layout>
  )
}