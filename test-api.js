/* eslint-disable */
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testAnalyzeAPI() {
    try {
        const formData = new FormData();
        const filePath = path.join(__dirname, 'test_counter.v');

        formData.append('file', fs.createReadStream(filePath));

        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders(),
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Test Error:', error.message);
        console.error('Full Error:', error);
    }
}

testAnalyzeAPI();
