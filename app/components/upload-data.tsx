"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const UploadCSV = () => {
	const [file, setFile] = useState<File | null>(null);
	const [prediction, setPrediction] = useState<any | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Custom Card component
	const Card = ({ children, title, description }: { children: React.ReactNode; title?: string; description?: string }) => (
		<div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-3xl">
			{title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
			{description && <p className="text-gray-500 mb-4">{description}</p>}
			{children}
		</div>
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError(null);
		if (e.target.files) {
			setFile(e.target.files[0]);
			setPrediction(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		setLoading(true);
		setError(null);

		try {
			const response = await fetch("http://localhost:8000/predict", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to get prediction. Please try again.");
			}

			const data = await response.json();
			setPrediction(data);
		} catch (error: any) {
			setError(error.message || "An error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-100 p-10">
			<h1 className="text-3xl font-bold text-gray-800 mt-8">Parkinson's Disease Prediction</h1>

			<Card title="Upload Patient Data" description="Upload a CSV file with the patient's smartwatch data to predict Parkinson's likelihood.">
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<label htmlFor="file-upload" className="text-sm font-semibold text-gray-700">Upload CSV File</label>
					<input id="file-upload" type="file" onChange={handleFileChange} accept=".csv" className="p-2 border rounded-lg" />
					<button type="submit" disabled={!file || loading} className="bg-blue-500 text-white font-semibold rounded-lg px-6 py-2">
						{loading ? "Processing..." : "Analyse"}
					</button>
				</form>
				{file && <p className="text-sm text-gray-500 mt-2">File uploaded: {file.name}</p>}
			</Card>

			{error && <div className="text-red-500 font-semibold mt-4">{error}</div>}

			{prediction && (
				<div className="w-full max-w-3xl space-y-8">
					<Card title="Patient Information">
						<p><strong>Name:</strong> John Doe</p>
						<p><strong>ID:</strong> PD12345</p>
						<p><strong>Age:</strong> {prediction.Age}</p>
						<p><strong>Gender:</strong> Male</p>
					</Card>

					<Card title="Prediction Results" description="Likelihood and risk assessment">
						<div className="flex items-center justify-between mb-4">
							<span className="text-md font-semibold">Predicted risk of developing clinical symptoms of Parkinson's: {(prediction.Parkinsons_Likelihood * 100).toFixed(2)}%</span>
							<div className="w-1/2 bg-gray-300 rounded-full h-2">
								<div
									className={`h-2 rounded-full ${prediction.Parkinsons_Likelihood > 0.5 ? "bg-red-500" : "bg-green-500"}`}
									style={{ width: `${prediction.Parkinsons_Likelihood * 100}%` }}
								></div>
							</div>
						</div>
					</Card>

					<Card title="Justification of Prediction">
						<div className="space-y-4">
							<p>
								<strong>REM Sleep Percentage:</strong> {prediction["REM Sleep Percentage"]}% - Studies show that 70% of early-stage Parkinson's patients have a reduced REM sleep percentage, affecting their sleep quality.
							</p>
							<p>
								<strong>Deep Sleep Percentage:</strong> {prediction["Deep Sleep Percentage"]}% - Low deep sleep is common in Parkinson's, with patients averaging 20% less deep sleep compared to healthy adults.
							</p>
							<p>
								<strong>Exercise Frequency:</strong> {prediction["Exercise Frequency"]} times per day - Reduced physical activity is a common prodromal symptom, especially as motor symptoms progress.
							</p>
						</div>
					</Card>

					<Card title="Movement Analysis" description="Activity levels over a 24-hour period">
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={prediction["Movement Time Series"].map((value: number, index: number) => ({ time: index, activity: value }))}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="time" label={{ value: "Time", position: "insideBottomRight", offset: -5 }} />
								<YAxis label={{ value: "Activity", angle: -90, position: "insideLeft" }} />
								<Tooltip />
								<Legend />
								<Line type="monotone" dataKey="activity" stroke="#8884d8" name="Activity Level" />
							</LineChart>
						</ResponsiveContainer>
					</Card>


					<h2 className="text-2xl md:text-52l font-bold text-center mt-16 mb-20">
						Doctor Diagnosis
					</h2>
					<Card title="Clinical Stage of Parkinson's Disease" description="Select the stage of Parkinson's disease that best matches the patient's symptoms.">
						<div className="flex flex-col space-y-2">
							<label htmlFor="parkinsons-stage" className="font-semibold text-gray-700">Select Stage</label>
							<input
								id="parkinsons-stage"
								type="range"
								min="0"
								max="2"
								step="1"
								className="w-full"
								onChange={(e) => {
									const stage = parseInt(e.target.value, 10);
									let stageText = "No Risk";
									if (stage === 1) stageText = "Prodromal Symptoms";
									else if (stage === 2) stageText = "Clinical Symptoms";
									document.getElementById("stage-label")!.innerText = stageText;
								}}
							/>
							<div id="stage-label" className="text-center font-semibold text-gray-700 mt-2">Prodromal Symptoms</div>
						</div>
					</Card>
				</div>
			)}

		</div>
	);
};

export default UploadCSV;
