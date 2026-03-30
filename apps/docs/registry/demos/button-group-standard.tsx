"use client";

import { Button, ButtonGroup } from "@bug-on/md3-react";

export default function ButtonGroupStandardDemo() {
	return (
		<div className="flex flex-col items-center justify-center gap-8 py-4">
			<div className="flex flex-col items-center gap-2">
				<span className="text-xs font-medium text-m3-on-surface-variant uppercase tracking-widest mb-4">
					Try clicking and holding
				</span>
				<ButtonGroup variant="standard" className="flex-wrap justify-center">
					<Button colorStyle="tonal" className="min-w-28 mb-2">
						Cancel
					</Button>
					<Button colorStyle="filled" className="min-w-28 mb-2">
						Save Changes
					</Button>
				</ButtonGroup>
			</div>

			<div className="flex flex-col items-center gap-2 mt-8">
				<span className="text-xs font-medium text-m3-on-surface-variant uppercase tracking-widest mb-4">
					Without Morphing Effect
				</span>
				<ButtonGroup
					variant="standard"
					morphingWidth={false}
					className="flex-wrap justify-center"
				>
					<Button colorStyle="tonal" className="min-w-28 mb-2">
						Cancel
					</Button>
					<Button colorStyle="filled" className="min-w-28 mb-2">
						Save Changes
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}
