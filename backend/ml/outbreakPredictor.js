import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Executes the Python ML model to predict outbreak probability
 * @param {Object} features - The feature object
 * @returns {Promise<Object>} - Prediction result { probability, risk_level, top_drivers }
 */
export const predictOutbreak = (features) => {
  return new Promise((resolve, reject) => {
    // Correct path to the Python script in root/ml/predict.py
    // Assuming this file is in root/backend/ml/outbreakPredictor.js
    const scriptPath = path.resolve(__dirname, '../../ml/predict.py');
    const pythonPath = path.resolve(__dirname, '../../ml/env/Scripts/python.exe');

    // Spawn python process
    // We use the virtual environment python interpreter to ensure dependencies exist
    const pythonProcess = spawn(pythonPath, [scriptPath]);

    let dataString = '';
    let errorString = '';

    // Send input features as JSON via stdin
    pythonProcess.stdin.write(JSON.stringify(features));
    pythonProcess.stdin.end();

    // Collect data from stdout
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    // Collect error messages
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`ML Prediction Error: ${errorString}`);
        return reject(new Error(`ML model exited with code ${code}`));
      }

      try {
        const result = JSON.parse(dataString);
        if (result.error) {
          return reject(new Error(result.error));
        }
        resolve(result);
      } catch (e) {
        console.error('Failed to parse ML output:', dataString);
        reject(new Error('Invalid output from ML model'));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
};
