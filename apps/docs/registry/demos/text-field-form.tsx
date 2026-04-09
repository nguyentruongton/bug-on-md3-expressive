"use client";

import { Icon, TextField } from "@bug-on/md3-react";
import * as React from "react";

export default function TextFieldFormDemo() {
	const [formData, setFormData] = React.useState({
		name: "",
		email: "",
		password: "",
		bio: "",
	});
	const [submitted, setSubmitted] = React.useState(false);
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	const validate = () => {
		const next: Record<string, string> = {};
		if (!formData.name.trim()) next.name = "Name is required";
		if (!formData.email.includes("@")) next.email = "Enter a valid email";
		if (formData.password.length < 8)
			next.password = "Password must be at least 8 characters";
		return next;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const errs = validate();
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			return;
		}
		setErrors({});
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-m3-surface-container text-center">
				<Icon name="check_circle" className="text-m3-primary text-5xl" />
				<p className="text-m3-on-surface font-medium">Form submitted!</p>
				<button
					type="button"
					onClick={() => {
						setSubmitted(false);
						setFormData({ name: "", email: "", password: "", bio: "" });
					}}
					className="text-m3-primary text-sm underline"
				>
					Reset
				</button>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-5 w-full max-w-sm"
			aria-label="Sign up form"
			noValidate
		>
			<TextField
				label="Full name"
				required
				value={formData.name}
				onChange={(v: string) => setFormData((p) => ({ ...p, name: v }))}
				error={!!errors.name}
				errorText={errors.name}
				leadingIcon={<Icon name="person" />}
			/>

			<TextField
				label="Email address"
				type="email"
				required
				value={formData.email}
				onChange={(v: string) => setFormData((p) => ({ ...p, email: v }))}
				error={!!errors.email}
				errorText={errors.email}
				leadingIcon={<Icon name="mail" />}
			/>

			<TextField
				label="Password"
				type="password"
				required
				trailingIconMode="password-toggle"
				value={formData.password}
				onChange={(v: string) => setFormData((p) => ({ ...p, password: v }))}
				error={!!errors.password}
				errorText={errors.password}
				supportingText="At least 8 characters"
			/>

			<TextField
				variant="outlined"
				label="Bio (optional)"
				type="textarea"
				rows={3}
				maxLength={200}
				value={formData.bio}
				onChange={(v: string) => setFormData((p) => ({ ...p, bio: v }))}
				supportingText="Tell us about yourself"
			/>

			<button
				type="submit"
				className="w-full py-3 rounded-full bg-m3-primary text-m3-on-primary font-medium transition-opacity hover:opacity-90"
			>
				Create account
			</button>
		</form>
	);
}
