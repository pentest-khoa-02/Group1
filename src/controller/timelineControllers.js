import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import nunjucks from 'nunjucks';
import ejs from 'ejs';

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
            //data name and avatar of user by id
            const data = result[0]
            const id1 = data.id

            //data status have comment
            let data1 = await prisma.$queryRaw`
            SELECT * FROM \"post\" INNER JOIN \"user_info\" ON post.authorid=user_info.userid WHERE post.authorid=${id1} ORDER BY post.id DESC`
            
            //data status no comment (handle XSS vul)
            let data4 = await prisma.$queryRaw`
            SELECT * FROM \"post\" INNER JOIN \"user_info\" ON post.authorid=user_info.userid WHERE post.authorid=${id1} ORDER BY post.id DESC`
            
             //my data (name + avatar)
            let data2 = await prisma.$queryRaw`SELECT * FROM \"user_info\" WHERE userid=${req.decoded.id}`
            
            //code fetch comment data
            for (let i = 0; i < data1.length; ++i) {
                //data3 is comment (add data3 to data1)
                let data3 = await prisma.$queryRaw`
                SELECT * FROM "post_comment" INNER JOIN "user_info" ON post_comment.authorid=user_info.userid WHERE postid=${data1[i].id} ORDER BY commentid ASC`
                if (data3[0])
                    data1[i].comment = data3
            }

            //handle time
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
            return res.render('timeline', {data, data1, data2: data2[0], data4})

        } catch (err) {
            console.log(err)
            return res.render('timelineerror', {data: "Error executing query"})
        }
    }
    else {
        const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='SSTI'`
        const id1 = Number(id)
        if (isNaN(id1))
            return res.render('timelineerror', {data: "id is not valid"})
        try {

            //data name and avatar of user by id
            const data = await prisma.user_info.findUnique({
                where: {
                userid: id1,
                },
            })
            if (data === null)
                next()

            //code vul SSTI in view bio
            if (setting.status === 'Easy'){
                try {
                    data.bio = nunjucks.renderString(data.bio);
                } catch (error) {
                }
            }
            else if (setting.status === 'Hard'){
                try {
                    data.bio = ejs.render(data.bio);
                } catch (error) {
                }
            }

            //data status have comment
            let data1 = await prisma.$queryRaw`
            SELECT * FROM \"post\" INNER JOIN \"user_info\" ON post.authorid=user_info.userid WHERE post.authorid=${id1} ORDER BY post.id DESC`
            
            //data status no comment (handle XSS vul)
            let data4 = await prisma.$queryRaw`
            SELECT * FROM \"post\" INNER JOIN \"user_info\" ON post.authorid=user_info.userid WHERE post.authorid=${id1} ORDER BY post.id DESC`
            
            //my data (name + avatar)
            let data2 = await prisma.$queryRaw`SELECT * FROM \"user_info\" WHERE userid=${req.decoded.id}`
            
            //code fetch comment data
            for (let i = 0; i < data1.length; ++i) {
                //data3 is comment (add data3 to data1)
                let data3 = await prisma.$queryRaw`
                SELECT * FROM "post_comment" INNER JOIN "user_info" ON post_comment.authorid=user_info.userid WHERE postid=${data1[i].id} ORDER BY commentid ASC`
                if (data3[0])
                    data1[i].comment = data3
            }

            //handle time
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
            return res.render('timeline', {data, data1, data2: data2[0], data4})

        } catch (error) {
            return res.render('timelineerror', {data: "User not found"})
        }
    }
}

export default {getTimelinePage}