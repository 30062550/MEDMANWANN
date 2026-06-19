import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
