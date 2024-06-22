import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function mytimeline(req,res){
    return res.redirect(`/timeline?id=${req.decoded.id}`)
}

async function logout(req,res){
    res.clearCookie('csrfToken')
    return res.clearCookie('jwt').redirect('/form-login')
}

async function pagedata(req,res){
    const fullname = req.fulldata.data.firstname + ' ' + req.fulldata.data.lastname
    const username = req.fulldata.data1.username
    const avatar = req.fulldata.data.avatar
    res.json({ fullname: fullname, username: username, avatar: avatar })
}

async function setting(req,res){
    const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='Broken Authentication'`
    if (setting.status === 'Easy' || setting.status === 'Medium' ){
        return res.redirect(`/setting?id=${req.decoded.id}`)
    }
    else {
        return res.redirect(`/setting`)
    }
}

export default {mytimeline, logout, pagedata, setting}