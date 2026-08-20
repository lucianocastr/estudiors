import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LegalServiceSchema } from "@/components/seo/legal-service-schema";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { VisitTracker } from "@/components/analytics/visit-tracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <GoogleAnalytics />
      <VisitTracker />
      <LegalServiceSchema />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
