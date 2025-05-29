import "./globals.css";

export const metadata = {
  title: "Jool",
  description: "Desarrollado por la División de Software de AAAIMX",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col gap-4">{children}</body>
    </html>
  );
}
