import { IPFS_HOST, IPFS_PORT } from "../confs";

const fs = require('fs');
const http = require('http');
const formData = require('form-data');

async function uploadFileFoIpfs(filePath:string):Promise<string>{
  return new Promise((resolve, reject) => {
    // Read file data
    const fileData = fs.readFileSync(filePath);

    // Create a new form data object
    const form = new formData();

    // Add the file to the form data
    form.append('file', fileData);



    // Set up the request options
    const options = {
      method: 'POST',
      hostname: IPFS_HOST,
      port: IPFS_PORT,
      path: '/api/v0/add',
      headers: form.getHeaders(),
    };

    // Make the request
    const req = http.request(options, (res: any) => {
      let data = '';

      // Collect the response data
      res.on('data', (chunk:string) => {
        data += chunk;
      });

      // Handle the response
      res.on('end', () => {
        console.log(`Response status code: ${res.statusCode}`);

        try {
          const response = JSON.parse(data);
          const ipfsHash = response.Hash;
          console.log(`File uploaded to IPFS with hash: ${ipfsHash}`);
          resolve(ipfsHash);
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(error);
        }
      });
    });

    // Handle request errors
    req.on('error', (error:Error) => {
      console.error('Request error:', error);
      reject(error);
    });

    // Send the form data
    form.pipe(req);
  });
}

// not working
export async function createDirectory(jsonData:any) {
  try {
    const { path, objects } = jsonData;
    const links = objects.map(({ path: linkPath, hash }) => ({
      Name: linkPath,
      Hash: hash,
      Tsize: 0, // You can set the actual size if known
    }));

    const requestBody = {
      Data: '',
      Links: links,
    };

    // Send a POST request to the IPFS node's object/put API
    const response = await fetch(`http://${IPFS_HOST}:${IPFS_PORT}/api/v0/object/put`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(response);

    // Get the response data
    const data = await response.json();

    // The hash of the directory structure is in data.Hash
    console.log(`Directory created with hash: ${data.Hash}`);
    return data.Hash;
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Usage example
export {uploadFileFoIpfs}

const test={
  "path": "myfiles/dsfs",
  "objects": [
    {
      "path": "script1.js",
      "hash": "QmcZbo3YJhAhtABDPnBEGZdPdUzYFNhTMSTHjDg8am5Vdv"
    }, {
      "path": "script2.js",
      "hash": "QmU5SniaTgDfEPqABUeuFX4BMnsPdrX8W8uRwFTgtnNFYU"
    }
  ]
}

// createDirectory(test).then(console.log).catch(console.error)