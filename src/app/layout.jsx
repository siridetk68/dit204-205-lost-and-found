import './globals.css';

export const metadata = {
  title: 'RSU IT Lost & Found - ระบบบอร์ดแจ้งของหายและตามหาเจ้าของ',
  description: 'โครงงานวิชา DIT204 Information System Project Management วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต จัดทำโดย นายสิริเดช เกตานนท์',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

