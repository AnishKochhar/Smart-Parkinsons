import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Home, Settings, Users } from "lucide-react"

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Smart PD",
	description: "SMART PD",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="fixed h-screen w-64 bg-white border-r border-gray-200 p-4">
					<div className="mb-6">
						<h1 className="text-2xl font-bold text-blue-600">Smart PD</h1>
					</div>
					<nav className="space-y-2 h-full">
						{[
							{ icon: Home, label: "Dashboard" },
							{ icon: Users, label: "Patients" },
							{ icon: Settings, label: "Settings" },
						].map((item) => (
							<button
								key={item.label}
								className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
							>
								<item.icon className="h-5 w-5" />
								{item.label}
							</button>
						))}
					</nav>
				</div>
				<div className="ml-64 p-4">
					{children}

				</div>
			</body>
		</html>
	);
}
