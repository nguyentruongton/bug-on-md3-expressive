import { Button, Icon } from "@bug-on/md3-react";
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

				<Button
					size="lg"
					asChild
					icon={<Icon name="arrow_forward" size={20} />}
				>
					<Link href="/components">Explore Components</Link>
				</Button>
			</div>
		</div>
	);
}
