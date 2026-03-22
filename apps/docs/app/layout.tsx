import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Global styles
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Bug Ổn MD3 Expressive Components",
	description: "A UI component library based on Material Design 3 Expressive",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
			<body
				suppressHydrationWarning
				className="antialiased bg-m3-surface-container text-m3-on-surface font-sans"
			>
				<ThemeProvider>
					<LayoutWrapper>{children}</LayoutWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
