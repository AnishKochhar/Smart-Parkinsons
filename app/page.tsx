'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ArrowRight, Smartphone, Watch } from 'lucide-react'

export default function Component() {
	const controls = useAnimation()
	const [isVisible, setIsVisible] = useState({
		stats: false,
		solution: false,
		devices: false
	})

	useEffect(() => {
		const observers = []
		const elements = {
			stats: document.getElementById('stats'),
			solution: document.getElementById('solution'),
			devices: document.getElementById('devices')
		}

		Object.entries(elements).forEach(([key, element]) => {
			if (element) {
				const observer = new IntersectionObserver(
					([entry]) => {
						if (entry.isIntersecting) {
							setIsVisible(prev => ({ ...prev, [key]: true }))
						}
					},
					{ threshold: 0.1 }
				)
				observer.observe(element)
				observers.push(observer)
			}
		})

		return () => observers.forEach(observer => observer.disconnect())
	}, [])

	useEffect(() => {
		if (isVisible.devices) {
			controls.start('visible')
		}
	}, [isVisible.devices, controls])

	return (
		<div className="min-h-screen bg-background text-foreground overflow-y-auto snap-y snap-mandatory scroll-snap-type-y-mandatory">
			<section className="min-h-screen flex flex-col space-y-10 text-center items-center justify-center p-6 snap-start">
				<h1 className="text-4xl md:text-6xl font-bold text-center max-w-4xl">
					Unlocking the power of lifestyle data for healthcare
				</h1>
				<p className="mb-8">
					Parkinson's disease affects ~2% of people over 60, with <strong>1.2 million cases</strong> in Europe set to rise sharply.
					Diagnosis comes too late — after <strong>50% of dopaminergic neurons are lost</strong> — due to reliance on motor symptoms.
				</p>
				<p className="font-semibold">Early signs are missed, delaying treatment.</p>
			</section>

			<section id="stats" className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 snap-start">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="max-w-2xl text-lg text-center"
				>
					<h2 className="text-4xl md:text-6xl font-bold text-center max-w-4xl sticky">
						Our Solution
					</h2>
				</motion.div>
				<motion.div
					initial={{ opacity: 0 }}
					animate={isVisible.stats ? { opacity: 1 } : {}}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="w-full max-w-3xl"
				>
					<img
						src="/parkinsons-graph.webp?height=600&width=800"
						alt="Parkinson's disease progression graph"
						className="w-full h-auto"
					/>
					<p className="text-sm text-center mt-2 text-muted-foreground">
						Source: UK Dementia Research Institute 2023
					</p>
				</motion.div>
			{/* </section> */}

			{/* <section id="solution" className="min-h-screen flex flex-col items-center justify-center p-6 space-y-12 snap-start"> */}

				<p className='text-center'>
					Research identifies prodromal markers of Parkinson's risk that can be detected <strong>up to 7 years before</strong> clinical symptoms appear.
				</p>

				<div id="devices" className="w-full max-w-2xl">
					<motion.div
						initial="hidden"
						animate={controls}
						variants={{
							hidden: { opacity: 0 },
							visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
						}}
						className="flex flex-row items-center space-y-8"
					>
						<motion.div
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0 }
							}}
							className="text-center"
						>
							<p className="text-lg mb-4">Your lifestyle data</p>
							<div className="flex justify-center space-x-6">
								<Smartphone className="h-16 w-16" />
								<Watch className="h-16 w-16" />
							</div>
						</motion.div>

						<motion.div
							variants={{
								hidden: { opacity: 0, scale: 0.8 },
								visible: { opacity: 1, scale: 1 }
							}}
							className='flex w-full justify-center'
						>
							<ArrowRight className="h-8 w-8" />
						</motion.div>

						<motion.div
							variants={{
								hidden: { opacity: 0, scale: 0.8 },
								visible: { opacity: 1, scale: 1 }
							}}
							className="text-center flex flex-col w-full items-center"
						>
							<p className="text-lg mb-4">Your risk analysis</p>
							<div className="relative w-28 h-28 rounded-full bg-green-700 flex items-center justify-center">
								<span className="text-2xl font-bold text-white">23%</span>
							</div>
							<p className="mt-2 font-bold">Low risk of Parkinson's detected</p>
						</motion.div>
					</motion.div>
				</div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={isVisible.devices ? { opacity: 1 } : {}}
					transition={{ duration: 0.6, delay: 1.2 }}
					className="max-w-2xl text-lg text-center"
				>
					Our algorithm identifies these prodromal markers in lifestyle data already captured by your smartphone and smartwatch,
					to develop a <span className="font-semibold">personalized early risk screen for Parkinson's disease</span>
				</motion.p>
			</section>

			<div className="flex justify-center">
				<motion.a
					href="/demo"
					initial={{ scale: 1 }}
					whileHover={{ scale: 1.4 }}
					className="my-8 inline-block px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
				>
					<span className='flex flex-row space-x-2'>
					To The Demo <ArrowRight className='ml-2' />
					</span>
				</motion.a>
			</div>

		</div>
	)
}
