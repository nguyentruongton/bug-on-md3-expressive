"use client";

import { Icon } from "@bug-on/md3-react";
import { motion } from "motion/react";
import Link from "next/link";
import * as React from "react";

interface ComponentCardProps {
	title: string;
	description: string;
	icon: string;
}

const MotionLink = motion.create(Link);

export const ComponentCard = React.memo(function ComponentCard({
	title,
	description,
	icon,
}: ComponentCardProps) {
	const slug = title.toLowerCase().replace(/\s+/g, "-");

	return (
		<MotionLink
			href={`/components/${slug}`}
			whileHover={{ y: -4 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className="group cursor-pointer flex flex-col gap-4"
		>
			<div className="aspect-3/2 rounded-3xl bg-[#EADDFF] flex items-center justify-center overflow-hidden transition-colors group-hover:bg-[#D0BCFF]">
				<Icon
					name={icon}
					size={64}
					className="text-[#4F378B] opacity-40 transition-transform duration-300"
				/>
			</div>
			<div className="px-1">
				<h3 className="text-lg font-medium text-m3-on-surface mb-1">{title}</h3>
				<p className="text-sm text-m3-on-surface-variant leading-relaxed">
					{description}
				</p>
			</div>
		</MotionLink>
	);
});
