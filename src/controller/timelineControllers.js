import db from '../config/database.js'
import jwt from 'jsonwebtoken';

async function getTimelinePage(req,res){
    const { id } = req.query;
    let data, result
    if (!id) {
        return res.render('timelineerror', {data: "Missing id parameter"})
    }
    try {
        result = await db.Client.query(`SELECT * FROM \"user_info\" WHERE userid = '${id}'`)
        if (result.rows.length === 0) {
          res.render('timelineerror', {data: "User not found"})
        }
        data = result.rows[0]
        res.render('timeline', {data})
    } catch (err) {
        res.render('timelineerror', {data: "Error executing query"})
    }    
}

async function getTimelinePagev2(req,res){
    const { id } = req.query;
    let data, result
    if (!id) {
        return res.render('timelineerror', {data: "Missing id parameter"})
    }
    try {
        const keywords = ['select', 'union', 'or', 'and', 'drop', '-', '\'', '#'];
        for (let i = 0; i < keywords.length; i++) {
            if (id.includes(keywords[i])) {
                res.render('timelineerror', {data: "NO SQL"})
            }
        }
        result = await db.Client.query(`SELECT * FROM \"user_info\" WHERE userid = '${id}'`)
        if (result.rows.length === 0) {
          res.render('timelineerror', {data: "User not found"})
        }
        data = result.rows[0]
        res.render('timeline', {data})
    } catch (err) {
        res.render('timelineerror', {data: "Error executing query"})
    }
}

async function index(req,res){
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SecretJWT, (err, decoded) => {
            if (err) {
                res.status(401).send('Invalid token');
            } else {
                res.redirect(`/timeline?id=${decoded.id}`)
            }
        });
    } else {
        res.status(401).send('No token provided');
    }
}

export default {getTimelinePage, getTimelinePagev2, index}