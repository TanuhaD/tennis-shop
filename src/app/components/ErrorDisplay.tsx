"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Wrench, PackageX } from "lucide-react";

interface ErrorDisplayProps {
	statusCode?: number;
	title?: string;
	message?: string;
}

export default function ErrorDisplay({
	statusCode = 404,
	title,
	message,
}: ErrorDisplayProps) {
	let defaultTitle = "Щось пішло не так";
	let defaultMessage =
		"Виникла несподівана помилка. Будь ласка, спробуйте ще раз або зверніться до служби підтримки.";

	let Icon = AlertTriangle;
	let colorClass = "text-error";

	if (statusCode === 404) {
		defaultTitle = "404 - Сторінка не знайдена";
		defaultMessage = "На жаль, ми не змогли знайти сторінку, яку ви шукаєте.";
		Icon = PackageX;
		colorClass = "text-warning";
	} else if (statusCode >= 500) {
		defaultTitle = `Помилка Сервера (${statusCode})`;
		defaultMessage =
			"Наші сервери наразі зайняті або виникла внутрішня проблема.";
		Icon = Wrench;
		colorClass = "text-error";
	}

	const displayTitle = title ?? defaultTitle;
	const displayMessage = message ?? defaultMessage;

	return (
		<div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
			<div className="card w-full max-w-xl bg-base-100 shadow-xl text-center p-8 sm:p-12 border-t-4 border-primary">
				<div className="flex justify-center mb-6">
					<Icon size={72} className={`${colorClass} animate-pulse`} />
				</div>

				<h1 className="text-6xl sm:text-7xl font-extrabold mb-4">
					{statusCode}
				</h1>

				<h2 className="text-3xl font-bold mb-4">{displayTitle}</h2>

				<p className="text-lg text-gray-500 mb-8">{displayMessage}</p>

				<div className="space-y-4">
					<Link href="/" className="btn btn-primary btn-lg w-full">
						На головну сторінку
					</Link>
					<button
						className="btn btn-ghost w-full"
						onClick={() => window.location.reload()}>
						Спробувати знову
					</button>
				</div>
			</div>
		</div>
	);
}
