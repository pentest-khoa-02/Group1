import db from '../config/database.js'
import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getTimelinePage(req,res){
    const { id } = req.query
    if (!id) {
        return res.render('timelineerror', {data: "Missing id parameter"})
    }
    const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='SQL Injection'`
    if (setting.status === 'Easy'){
        try {
            const result = await prisma.$queryRawUnsafe(`SELECT * FROM \"user_info\" WHERE userid = '${id}'`)
            const blacklist = ['select', 'SELECT', 'union', 'UNION', 'drop', 'DROP', 'OR', 'and', 'AND', 'substring', 'SUBSTRING', 'pg_sleep', 'PG_SLEEP', '-', '#']
            for (let i = 0; i < blacklist.length; i++) {
                if (id.includes(blacklist[i])) {
                    return res.render('timelineerror', {data: "NO SQLi !!"})
                }
            }
            if (result.length === 0) {
                return res.render('timelineerror', {data: "User not found"})
            }
            const data = result[0]
            return res.render('timeline', {data})
        } catch (err) {
            return res.render('timelineerror', {data: "Error executing query"})
        }
    }
    if (setting.status === 'None'){
        const id1 = Number(id)
        if (isNaN(id1))
            return res.render('timelineerror', {data: "id is not valid"})
        try {
            const data = await prisma.user_info.findUnique({
                where: {
                userid: id1,
                },
            })
            if (data === null)
                next()
            return res.render('timeline', {data})
        } catch (error) {
            return res.render('timelineerror', {data: "User not found"})
        }
    }
}

async function index(req,res){
    const { id } = req.id
    const id1 = Number(id)
    if (isNaN(id1))
    {
        console.log("1")
        return res.render('timelineerror', {data: "id is not valid"})

    }
    try {
        const data = await prisma.user_info.findUnique({
            where: {
            userid: id1,
            },
        })
        if (data === null)
            next()
        
            console.log("2")
        return res.render('timeline', {data: data})
    } catch (error) {
        
        console.log("3")
        return res.render('timelineerror', {data: "User not found"})
    }
}

export default {getTimelinePage, index}