import { TypographyProvider } from "@bug-on/md3-react";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutProvider } from "@/lib/layout-context";
import "@bug-on/md3-react/typography.css";
import "./globals.css";
import type { Metadata } from "next";

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
		<html lang="en" suppressHydrationWarning>
			<body
				suppressHydrationWarning
				className="antialiased bg-mesh-gradient text-m3-on-surface font-md3-expressive overflow-x-hidden"
			>
				<ThemeProvider>
					<LayoutProvider>
						<TypographyProvider>
							<LayoutWrapper>{children}</LayoutWrapper>
						</TypographyProvider>
					</LayoutProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
