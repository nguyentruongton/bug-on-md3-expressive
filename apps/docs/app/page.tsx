import { Icon } from "@bug-on/md3-react";
import Link from "next/link";

export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center min-h-full p-6 md:p-12 text-center">
			<div className="max-w-2xl">
				<span className="text-m3-primary font-medium tracking-wide uppercase text-xs md:text-sm">
					MATERIAL DESIGN 3
				</span>
				<h1 className="text-4xl md:text-6xl font-normal tracking-tight mt-2 mb-4 md:mb-6 text-m3-on-surface">
					Expressive Components
				</h1>
				<p className="text-lg md:text-xl text-m3-on-surface-variant leading-relaxed mb-8 md:mb-12">
					Build beautiful, interactive interfaces with the latest Material
					Design 3 components. Experience fluid motion, adaptive depth, and
					dynamic color schemes.
				</p>

				<Link
					href="/components"
					className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-m3-primary text-m3-on-primary rounded-full text-base md:text-lg font-medium hover:shadow-lg transition-all active:scale-95"
				>
					Explore Components
					<Icon name="arrow_forward" size={20} />
				</Link>
			</div>
		</div>
	);
}
