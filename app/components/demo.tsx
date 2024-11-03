"use client"

import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Component() {
	const [visibleWatches, setVisibleWatches] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setVisibleWatches(prev => Math.min(prev + 1, 3))
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	return (
		<section className="min-h-screen p-8 flex flex-col justify-center items-center snap-start">
			<h1 className="text-4xl md:text-5xl font-bold text-center mb-16">
				The patient journey
			</h1>

			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className={`transform transition-all duration-1000 ${visibleWatches >= 1
						? 'translate-y-0 opacity-100'
						: 'translate-y-20 opacity-0'
					}`}>
					<Watch type="logo" />
				</div>

				<div className={`transform transition-all duration-1000 ${visibleWatches >= 2
						? 'translate-y-0 opacity-100'
						: 'translate-y-20 opacity-0'
					}`}>
					<Watch type="metrics" />
				</div>

				<div className={`transform transition-all duration-1000 ${visibleWatches >= 3
						? 'translate-y-0 opacity-100'
						: 'translate-y-20 opacity-0'
					}`}>
					<Watch type="alert" />
				</div>
			</div>
		</section>
	)
}

function Watch({ type }: { type: 'logo' | 'metrics' | 'alert' }) {
	return (
		<div className="relative w-64 h-80 mx-auto bg-zinc-900 rounded-3xl shadow-lg flex items-center justify-center">
			<div className="absolute inset-2 rounded-2xl bg-black flex items-center justify-center overflow-hidden">
				<WatchFace type={type} />
			</div>
			<div className="absolute right-0 top-16 w-2 h-12 bg-gray-300 rounded-l-full" />
		</div>
	)
}

function WatchFace({ type }: { type: string }) {
	const generateData = (baseValue: number, variance: number) => {
		return Array.from({ length: 24 }, () =>
			baseValue + (Math.random() * variance * 2 - variance)
		)
	}

	const sleepData = generateData(7, 1)  // 7 hours of sleep on average, +/- 1 hour
	const movementData = generateData(50, 10)  // 50 units of movement on average, +/- 10 units

	return (
		<div className="w-full h-full">
			{type === 'logo' && (
				<div className="w-full h-full flex items-center justify-center bg-green-500">
					<div className="text-4xl font-bold text-white">PD</div>
				</div>
			)}

			{type === 'metrics' && (
				<div className="w-full h-full p-4 bg-black">
					<div className="h-full flex flex-col justify-between">
						<LineGraph title="Sleep" data={sleepData} color="rgb(34 211 238)" />
						<LineGraph title="Movement" data={movementData} color="rgb(74 222 128)" />
					</div>
				</div>
			)}

			{type === 'alert' && (
				<div className="w-full h-full flex flex-col items-center justify-center p-6 bg-black text-white">
					<Bell className="w-16 h-16 text-red-500 mb-4" />
					<div className="text-center">
						<div className="text-red-500 text-xl font-bold mb-4">Risk Detected</div>
						<div className="text-lg">
							Risk of Parkinson's detected - please contact your GP
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

function LineGraph({ title, data, color }: { title: string; data: number[]; color: string }) {
	const min = Math.min(...data)
	const max = Math.max(...data)

	return (
		<div className="flex-1 flex flex-col">
			<div className="text-sm font-semibold mb-2" style={{ color }}>{title}</div>
			<div className="flex-1 relative">
				<svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
					<polyline
						points={data.map((value, index) =>
							`${(index / (data.length - 1)) * 100},${100 - ((value - min) / (max - min)) * 100}`
						).join(' ')}
						fill="none"
						stroke={color}
						strokeWidth="2"
					/>
				</svg>
			</div>
		</div>
	)
}