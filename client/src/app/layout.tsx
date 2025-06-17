import "./style.css";
import { Footer } from "~/app/components/footer";
import { Header } from "~/app/components/header";
import { AuthProvider } from "~/app/contexts/auth-context";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const font = Inter({
  variable: "--main-font",
  subsets: ["latin"],
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={font.variable}>
      <body className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
        <AuthProvider>
          <div className="min-h-screen px-4 py-6 md:px-6 md:py-8 grid grid-rows-[auto,_1fr,_auto] gap-8">
            <Header />
            <div className="w-full">
              {children}
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default Layout;
