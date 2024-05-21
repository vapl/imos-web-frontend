import { writeFile } from 'fs/promises'; // Import writeFile from fs/promises
import sql from 'mssql';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'; // Import dirname from path
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Specify the directory where you want to save the JSON file
const filePath = path.join(__dirname, 'data', 'material_data.json');

// Create a database connection
const config = {
    user: 'Lietotājs',
    password: 'parole',
    server: 'Servera nosaukums',
    database: 'iX_1033',
    options: {
        encrypt: false,
    }
};

async function main() {
    try {
        // Create a connection pool
        const pool = await sql.connect(config);

        console.log('The connection established successfully');

        // Update list query
        const readQuery = fs.readFileSync('data/matData.sql', 'utf-8');
        // Fetch data from the database
        const result = await pool.request().query(readQuery);

        // Process the data and convert it to JSON
        const jsonData = JSON.stringify(result.recordset, null, 2); // null and 2 are for formatting

        // Write the JSON data to a file
        await writeFile(filePath, jsonData);

        console.log(`JSON data has been saved to ${filePath}`);

        // Close the database connection
        await pool.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the main function
main();
