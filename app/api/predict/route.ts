import { NextResponse } from 'next/server';
import * as fs from 'fs';
import { IncomingForm } from 'formidable';
import { promisify } from 'util';
import { parse as parseCSV } from 'csv-parse/sync';
import path from 'path';

// Disable automatic Next.js body parsing
export const config = {
	api: {
		bodyParser: false,
	},
};

// Dynamically load ONNX Runtime
let session: any = null;

const loadModel = async () => {
	if (!session) {
		const onnx = await import('onnxruntime-node');
		const modelPath = path.join(process.cwd(), 'models', 'parkinsons_prediction_model.onnx');
		session = await onnx.InferenceSession.create(modelPath);
		console.log("Model loaded successfully");
	}
	return session;
};

// Parse CSV to array of numbers
const parseCSVData = (csvData: Buffer): number[][] => {
	try {
		const rows: number[][] = parseCSV(csvData.toString(), {
			skip_empty_lines: true,
			cast: true,
		});
		return rows;
	} catch (error) {
		console.error("Failed to parse CSV data:", error);
		throw new Error("CSV parsing failed");
	}
};

// Handle POST request for file upload and prediction
export async function POST(request: Request) {
	const form = new IncomingForm();
	const parseForm = promisify(form.parse);

	try {
		// Parse the form data to get the file
		const { files } = await parseForm(request);
		if (!files || !files.file) {
			throw new Error("No file uploaded or incorrect form field name");
		}
		const file = files.file as formidable.File;

		// Read and parse CSV file content
		let csvData: Buffer;
		try {
			csvData = fs.readFileSync(file.filepath);
		} catch (error) {
			console.error("Failed to read CSV file:", error);
			throw new Error("File reading failed");
		}

		const data = parseCSVData(csvData);

		// Check if data contains enough columns
		if (data.length === 0 || data[0].length < 28) {
			throw new Error("CSV file does not contain the required number of columns (at least 28)");
		}

		// Prepare inputs for ONNX model
		const profileData = data[0].slice(0, 4);
		const movementData = data[0].slice(4, 28).map((value) => [value]);

		// Convert inputs to tensors
		let profileTensor, movementTensor;
		try {
			const onnx = await import('onnxruntime-node');
			profileTensor = new onnx.Tensor(new Float32Array(profileData), 'float32', [1, 4]);
			movementTensor = new onnx.Tensor(new Float32Array(movementData.flat()), 'float32', [1, 24, 1]);
		} catch (error) {
			console.error("Failed to convert inputs to tensors:", error);
			throw new Error("Tensor conversion failed");
		}

		// Load model and run inference
		const session = await loadModel();
		let output;
		try {
			output = await session.run({
				profile_input: profileTensor,
				movement_input: movementTensor,
			});
		} catch (error) {
			console.error("Model inference failed:", error);
			throw new Error("Model inference failed");
		}

		// Extract prediction
		const prediction = output.output.data[0];
		const predictionClass = prediction > 0.5 ? 'Parkinson' : 'No Parkinson';

		return NextResponse.json({
			Parkinsons_Likelihood: prediction,
			Prediction: predictionClass,
		});
	} catch (error) {
		// Log the error and return a generic failure message to the user
		console.error("Prediction error:", error);
		return NextResponse.json({ error: 'Prediction failed. Please check the uploaded file.' }, { status: 500 });
	}
}
