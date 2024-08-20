import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getRegisterPage = async (req,res) =>{
    return res.render('form-register', { layout: false })
}

const handleRegister = async (req,res) =>{
    const {firstname, lastname, email, password} = await req.body
    /*const user = await prisma.user.create({
        data: {
          email: 'elsa@prisma.io',
          name: 'Elsa Prisma',
        },
    })*/
    //console.log(firstname, lastname, email, password)

}

const checkemail = async (req,res) =>{
    try {
        const { email } = req.body;
        const data = await prisma.user.findUnique({
            where: {
            email: email,
            },
        })
        if (data === null) {
            return res.json({ exists: false });
        } else {
            return res.json({ exists: true });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default {getRegisterPage, handleRegister, checkemail}