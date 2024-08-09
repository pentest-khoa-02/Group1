import express, { json }  from "express";
import axios from 'axios';
const Route = express.Router()

Route.get('/', async (req,res) =>{
    const data = req.query.s1
    // console.log(data)
    axios.post('http://127.0.0.1:3000/setting', data, {
        headers: {
            'Cookie' : req.headers['cookie'],
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 10  
        }
    })
    .then(data => {
        // console.log(data);
        return res.send('1')
    })
    .catch(error => {
        console.error(error);
    });

})

export default Route