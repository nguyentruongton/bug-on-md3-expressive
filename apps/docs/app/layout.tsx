import { MaterialSymbolsPreconnect, MD3ThemeProvider } from "@bug-on/md3-react";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { LayoutProvider } from "@/lib/layout-context";
import { TocProvider } from "@/lib/toc-context";
import "@bug-on/md3-react/material-symbols-cdn.css";
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
			<head>
				<MaterialSymbolsPreconnect
					variants={["outlined", "rounded", "sharp"]}
				/>
			</head>
			<body
				suppressHydrationWarning
				className="antialiased bg-mesh-gradient text-m3-on-surface font-md3-expressive overflow-x-hidden"
			>
				<MD3ThemeProvider
					sourceColor="#6750A4"
					defaultMode="system"
					persistToLocalStorage
					enableSnackbar
				>
					<LayoutProvider>
						<TocProvider>
							<LayoutWrapper>{children}</LayoutWrapper>
						</TocProvider>
					</LayoutProvider>
				</MD3ThemeProvider>
			</body>
		</html>
	);
}
