import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function mytimeline(req,res){
    return res.redirect(`/timeline?id=${req.decoded.id}`)
}

async function logout(req,res){
    return res.clearCookie('jwt').redirect('/form-login')
}

async function pagedata(req,res){
    const fullname = req.fulldata.data.firstname + ' ' + req.fulldata.data.lastname
    const username = req.fulldata.data1.username
    const avatar = req.fulldata.data.avatar
    res.json({ fullname: fullname, username: username, avatar: avatar })
}

export default {mytimeline, logout, pagedata}