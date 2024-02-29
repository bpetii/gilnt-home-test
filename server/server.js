import express from 'express';
import { spawn } from 'child_process';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/climate_data', (req, res) => {
  const {longitude, latitude} = req.query
	const process = spawn('python3', ["server/python.py", latitude.toString(), longitude.toString()] );
	let data = '';
	
	process.stdout.on('data', (chunk) => {
		data += chunk.toString();
	});

	process.on('close', () => {
		try {
			const result = JSON.parse(data);
			const {max_value: maxValue, unit} = result;
			const processedData = parseFloat(maxValue);
	
			if (!isNaN(processedData)) {
				res.json({ hmax: processedData, unit: unit });
			} else {
				res.status(500).json({ error: 'Internal Server Error' });
			}
		} catch (error) {
			res.status(500).json({ error: 'Internal Server Error' });
		}
	});

  process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });
});
  
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});