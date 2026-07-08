"use client";
import React, { ReactNode } from "react";

interface AdminLayoutProps {
	children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-blue-600 text-white p-4 font-bold text-xl">
				Admin Panel
			</header>
			<main className="p-4">{children}</main>
		</div>
	);
};

export default AdminLayout;
