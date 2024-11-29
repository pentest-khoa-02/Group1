import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import md5 from 'md5'
import { faker } from '@faker-js/faker/locale/vi';

const getRegisterPage = async (req,res) =>{
    return res.render('form-register', { layout: false })
}

const getLastestId = async function() {
    const LastestId = await prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
    if (LastestId.length > 0) {
      return LastestId[0].id;
    } else {
      return 1;
    }
}

const handleRegister = async (req,res) =>{
    
    try {
        const LastestId = await getLastestId() + 1
        const {firstname, lastname, email, username, password} = await req.body
        //console.log(firstname, lastname, email, username, password, LastestId)
        await prisma.$queryRaw`INSERT INTO \"user\" (id, username, email, password, passwordnotsecret)
        VALUES (${LastestId}, ${username}, ${email}, ${md5(password)}, ${password})`
        //console.log(faker.company.name(), faker.location.city(), faker.person.jobTitle(), faker.lorem.sentence())
        await prisma.$queryRaw`INSERT INTO \"user_info\" (firstname, lastname, university, live, job, avatar, userid, bio)
        VALUES (${firstname}, ${lastname}, ${faker.company.name()}, ${faker.location.city()}, ${faker.person.jobTitle()}, 'https://i.imgur.com/g66u9dV.jpeg', ${LastestId} ,${faker.lorem.sentence()})`
        return res.redirect('/login')

    } catch (err) {
        return res.status(500).send({ error: 'Internal Server Error' });
    }

}

const checkemail = async (req,res) =>{
    try {
        const { email, username } = req.body;
        const data1 = await prisma.user.findUnique({
            where: {
            email: email,
            },
        })
        const data2 = await prisma.user.findUnique({
            where: {
            username: username,
            },
        })
        const emailExists = (data1 !== null)
        const usernameExists = (data2 !== null)
        return res.json({ emailExists: emailExists, usernameExists: usernameExists });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default {getRegisterPage, handleRegister, checkemail}