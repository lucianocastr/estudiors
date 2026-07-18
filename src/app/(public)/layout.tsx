import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LegalServiceSchema } from "@/components/seo/legal-service-schema";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <LegalServiceSchema />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
