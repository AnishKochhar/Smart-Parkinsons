"use client";

import DemoComponent from '@/app/components/demo'
import UploadCSV from '../components/upload-data'

export default function DemoPage() {
	return (
		<div className='overflow-y-scroll snap-y snap-mandatory'>
			<DemoComponent />

			<div className='min-h-screen'>
				<h1 className="text-4xl md:text-5xl font-bold text-center mb-16">
					The GP's view
				</h1>
				<UploadCSV />
			</div>
		</div>
	)
}