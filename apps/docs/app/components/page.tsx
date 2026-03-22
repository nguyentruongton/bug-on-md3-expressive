"use client";

import Link from "next/link";
import { ComponentCard } from "@/components/ComponentCard";
import { componentCategories } from "@/lib/data";

export default function ComponentsOverviewPage() {
	return (
		<div className="min-h-screen bg-m3-surface">
			{/* Hero Section */}
			<section className="bg-[#F4F0EC] px-6 py-12 md:px-8 md:py-24 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
				<div className="max-w-2xl flex-1 text-center md:text-left">
					<h1 className="text-4xl md:text-[64px] font-normal tracking-tight text-[#1D192B] mb-4 md:mb-6 leading-tight">
						Components
					</h1>
					<p className="text-base md:text-xl text-[#49454F] leading-relaxed max-w-xl mx-auto md:mx-0">
						Material Design components are interactive building blocks for
						creating a user interface.
					</p>
				</div>
				<div className="w-full max-w-[400px] aspect-square relative flex-shrink-0">
					{/* Abstract geometric shapes to mimic the hero graphic */}
					<div className="absolute inset-0 bg-[#EADDFF] rounded-full overflow-hidden flex items-center justify-center">
						<div className="w-3/4 h-3/4 bg-white rounded-2xl shadow-sm flex flex-col gap-3 p-4 rotate-12 translate-x-4">
							<div className="w-full h-8 bg-[#EADDFF] rounded-lg" />
							<div className="w-2/3 h-4 bg-[#D0BCFF] rounded-full" />
							<div className="w-1/2 h-4 bg-[#D0BCFF] rounded-full" />
							<div className="mt-auto flex justify-end gap-2">
								<div className="w-8 h-8 rounded-full bg-[#4F378B] opacity-20" />
								<div className="w-16 h-8 rounded-full bg-[#4F378B]" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Components Grid */}
			<div className="px-6 md:px-8 lg:px-20 py-12 md:py-16 max-w-[1600px] mx-auto">
				{componentCategories.map((category) => (
					<section key={category.title} className="mb-16 md:mb-20">
						<h2 className="text-2xl md:text-[32px] font-normal text-[#1D192B] mb-8 md:mb-10">
							{category.title}
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-12">
							{category.items.map((item) => (
								<ComponentCard
									key={item.name}
									title={item.name}
									description={item.description}
									icon={item.icon}
								/>
							))}
						</div>
					</section>
				))}
			</div>

			{/* Footer */}
			<footer className="border-t border-m3-outline-variant/30 px-6 md:px-8 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-m3-on-surface-variant">
				<div className="flex items-center gap-8">
					<span className="font-medium text-lg text-m3-on-surface tracking-tight">
						Google
					</span>
					<div className="flex items-center gap-6">
						<Link
							href="#privacy"
							className="hover:text-m3-on-surface transition-colors"
						>
							Privacy
						</Link>
						<Link
							href="#terms"
							className="hover:text-m3-on-surface transition-colors"
						>
							Terms
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
