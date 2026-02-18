import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="min-h-screen text-white antialiased">{children}</body>
    </html>
  );
}
