import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Card } from "./card";

interface CodeBlockProps {
	code: string;
	language?: string;
	className?: string;
}

export function CodeBlock({
	code,
	language = "React",
	className,
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	return (
		<Card
			variant="filled"
			className={cn(
				"p-0 overflow-hidden max-w-full bg-m3-surface-container-high",
				className,
			)}
		>
			<div className="bg-m3-surface-container-highest px-4 py-2 border-b border-m3-outline-variant flex justify-between items-center">
				<span className="text-xs font-mono text-m3-on-surface-variant">
					{language}
				</span>
				<Button
					type="button"
					onClick={copyToClipboard}
					title="Copy code"
					colorStyle="text"
				>
					{copied ? (
						<>
							<Check className="w-3.5 h-3.5" />
							<span className="text-[10px] font-bold uppercase tracking-wider">
								Copied!
							</span>
						</>
					) : (
						<>
							<Copy className="w-3.5 h-3.5" />
							<span className="text-[10px] font-bold uppercase tracking-wider">
								Copy
							</span>
						</>
					)}
				</Button>
			</div>
			<pre className="p-4 overflow-x-auto text-sm font-mono text-m3-on-surface">
				{code}
			</pre>
		</Card>
	);
}
