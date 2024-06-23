import { prisma } from '../config/prisma.js';
import pug from 'pug';

const getStatusPage = async (req,res) => {
    const { id } = req.query
    if (!id) {
        return res.render('timelineerror', {data: "Missing id parameter"})
    }
    const id1 = Number(id)
    if (isNaN(id1))
        return res.render('timelineerror', {data: "id is not valid"})

    try {
        //fetch data name and avatar
        const data = await prisma.post.findUnique({
            where: {
            id: id1,
            },
        })
        if (data === null)
            next()

        //fetch data status
        let data1 = await prisma.$queryRaw`
        SELECT * FROM \"post\" INNER JOIN \"user_info\" ON post.authorid=user_info.userid WHERE post.id=${id1}` 
        let data4 = await prisma.$queryRaw`
        SELECT * FROM \"post\" INNER JOIN \"user_info\" ON post.authorid=user_info.userid WHERE post.id=${id1}` 
        //fetch my data
        let data2 = await prisma.$queryRaw`SELECT * FROM \"user_info\" WHERE userid=${req.decoded.id}`
        //fetch comment data
        for (let i = 0; i < data1.length; ++i) {
            let data3 = await prisma.$queryRaw`
            SELECT * FROM "post_comment" INNER JOIN "user_info" ON post_comment.authorid=user_info.userid WHERE postid=${data1[i].id} ORDER BY commentid ASC`
            if (data3[0]) {
                data1[i].comment = data3
                for (let j = 0; j < data3.length; ++j) {
                    data3[j].content = pug.render(`|${data3[j].content}`)
                }
            }
        }
        //time
        const now = new Date()
        for (let i = 0; i < data1.length; ++i) {
            const specificTime = new Date(data1[i].create_at);
            const diffInSeconds = Math.floor((now - specificTime) / 1000);
            const seconds = diffInSeconds % 60;
            const minutes = Math.floor(diffInSeconds / 60) % 60;
            const hours = Math.floor(diffInSeconds / (60 * 60)) % 24;
            const days = Math.floor(diffInSeconds / (60 * 60 * 24));
            if (days > 0) {
                data1[i].post_time = `${days} days ago`;
            }
            else if (hours > 0) {
                data1[i].post_time = `${hours} hours ago`;
            }
            else if (minutes > 0) {
                data1[i].post_time = `${minutes} minutes ago`;
            }
            else {
                data1[i].post_time = `${seconds} seconds ago`;
            }
        }
        return res.render('statuspost1', {data, data1, data2: data2[0], data4})
        
    } catch (error) {
        //console.error("Error: ", error.message);
        return res.render('timelineerror', {data: "Status not found"})
    }
}

export default {getStatusPage}