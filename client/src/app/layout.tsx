import "./style.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "~/app/components/footer";
import { Header } from "~/app/components/header";
import { AuthProvider } from "~/app/contexts/auth-context";

const font = Inter({
  variable: "--main-font",
  subsets: ["latin"],
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={font.variable}>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <AuthProvider>
          <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto] gap-8 px-4 py-6 md:px-6 md:py-8">
            <Header />
            <div className="w-full">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default Layout;
