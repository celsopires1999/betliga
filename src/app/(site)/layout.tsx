import ThemeRegistry from "@/frontend/components/ThemeRegistry/ThemeRegistry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betliga - build your own Liga with your friends",
  description:
    "Who knows football better among your friends? Now you will be able to know it!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
