import { prisma } from '../config/prisma.js';

const pagedata = async(req,res,next) => {
    try {
        let id = Number(req.decoded.id)
        if (isNaN(id)) {
            res.clearCookie('jwt')
            next()
        }
        const data = await prisma.user_info.findUnique({
            where: {
            userid: id,
            },
        })
        const data1 = await prisma.user.findUnique({
            where: {
            id: id,
            },
        })
        if (data === null && data1 === null)
            next()
        req.fulldata = { data: data, data1: data1 };
        next()
    } catch (error) {
        res.clearCookie('jwt')
        next()
    }
}

export {pagedata}