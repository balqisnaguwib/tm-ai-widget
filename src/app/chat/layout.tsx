import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TM AI Day - Chat",
  description: "Chat with the TM AI Day assistant",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      {children}
    </div>
  );
}