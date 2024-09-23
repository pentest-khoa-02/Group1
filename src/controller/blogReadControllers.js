import axios from 'axios';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
const getBlogReadPage =  async (req,res) => {
    //get comment 
    let comment  = await prisma.$queryRaw`SELECT * FROM post_comment join user_info on post_comment.authorid = user_info.userid where postid = 12  ORDER BY commentid DESC`
    // console.log(comment)

    res.render('blog-read',{comments : comment})
}

const forwardRequestCommand = async (req,res) =>{
    const {comment,value,name} = req.body
    const user_id = req.fulldata.data.userid 
    const  cookie = req.headers.cookie
    const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='HTTP Smuggling'`
    //handle
    if (setting.status != 'None'){
        const response = await axios.post('http://localhost:3000/blog-read/handlecomment',{'content':comment,'authorid':user_id,'postid':12},{
            headers:{
                'cookie' : cookie,
                'Content-Type': 'application/json',
                [name] : value 
            }
        })
    }
    const response = await axios.post('http://localhost:3000/blog-read/handlecomment',{'content':comment ,[name]:value,'authorid':user_id,'postid':12},{
        headers:{
            'cookie' : cookie,
            'Content-Type': 'application/json',
        }
    })
    
    return res.send(req.body)
}
export default {getBlogReadPage,forwardRequestCommand}