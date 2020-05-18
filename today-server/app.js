const express = require ('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

let credentials = JSON.parse(fs.readFileSync('credential.json', 'utf8'));
let connection = mysql.createConnection(credentials);
connection.connect();


function rowToObject(row){
	return {
		id:row.id,
		year: row.year,
		month: row.month,
		day: row.day,
		message: row.message,
	};

}

app.get('/memories', (request, response) => {
	const query = 'SELECT * FROM memory';
	connection.query(query,(error, rows) => {
		response.send({
			ok: true,
			memories: rows.map(rowToObject),
		});
	});
});


app.post('/add', (request, response) => {
        const query = 'INSERT INTO memory(year, month, day, message) VALUES (?, ?, ?, ?)';
        const params = [request.body.year, request.body.month, request.body.day, request.body.message];
        connection.query(query, params, (error, result) => {
                response.send({
                        ok: true,
			id: result.insertId,

                });
        });
});



app.delete('/memories/:id', (request, response) => {
        const query = 'DELETE FROM memory WHERE id=?';
        const params = [request.params.id];
        connection.query(query, params, (error, result) => {
                response.send({
                        ok: true,

                });
        });
});



const port = 3443;
app.listen(port, () => {
	console.log(`we're live on port ${port}!`);
});
