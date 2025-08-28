import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-[1440px] border-2 my-6 min-h-screen">

      {children}
      </div>
      {/* <footer>hello</footer> */}
    </>
  );
}
