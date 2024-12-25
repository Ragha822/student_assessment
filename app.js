const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Replace with your MySQL password if needed
  database: 'student_assessment', // Ensure this matches your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Ensure uploads/ directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const upload = multer({ dest: uploadDir });

// Endpoint to upload CSV
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path; // This is where the uploaded file path is used

  const results = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      if (results.length === 0) {
        fs.unlinkSync(filePath); // Cleanup
        res.status(400).send('CSV file is empty');
        return;
      }

      // Insert data into the 'students_data' table
      const sql = 'INSERT INTO students_data (name, usn, semester, roll_number) VALUES ?';
      const values = results.map((row) => [
        row.name,        // Ensure the CSV header is 'name'
        row.usn,         // Ensure the CSV header is 'usn'
        row.semester,    // Ensure the CSV header is 'semester'
        row.roll_number  // Ensure the CSV header is 'roll_number'
      ]);

      db.query(sql, [values], (err) => {
        fs.unlinkSync(filePath); // Cleanup
        if (err) {
          console.error('Error inserting data:', err.message);
          res.status(500).send('Error inserting data');
          return;
        }

        console.log('Data successfully inserted');
        res.send('CSV data successfully uploaded and inserted into the database');
      });
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err.message);
      fs.unlinkSync(filePath); // Cleanup
      res.status(500).send('Error reading CSV file');
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
