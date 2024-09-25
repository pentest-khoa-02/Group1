import axios from 'axios';
import {prisma} from "../config/prisma.js"
import qs from 'qs';
import e from 'cors';
const getBlogReadPage =  async (req,res) => {
    //get comment 
    let comment  = await prisma.$queryRaw`SELECT * FROM post_comment join user_info on post_comment.authorid = user_info.userid where postid = 12  ORDER BY commentid DESC`
    // console.log(comment)

    res.render('blog-read',{comments : comment})
}

const forwardRequestCommand = async (req,res) =>{
    const {comment,value,name} = req.body
    // console.log(req.body)
    const user_id = req.fulldata.data.userid 
    const  cookie = req.headers.cookie
    const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='HTTP Smuggling'`
    //handle
  try {
    if (setting.status != 'None'){
        console.log('work')
        let data = decodeURI(qs.stringify({'authorid':user_id,'postid':12,'content':comment}))
        data = decodeURIComponent(data)
        // console.log(data)
        const response = await axios.post('http://localhost:3000/blog-read/handlecomment',data,{
            headers:{
                'cookie' : cookie,
                'Content-Type': 'application/x-www-form-urlencoded',
                [name] : value 
            }
        })
    }else {
    const response = await axios.post('http://localhost:3000/blog-read/handlecomment',{'content':comment ,[name]:value,'authorid':user_id,'postid':12},{
        headers:{
            'cookie' : cookie,
            'Content-Type': 'application/json',
        }
    })
   }
  } catch (error) {
    console.log(error)
  }
   return res.json({'Result' : 'Success'})
    // console.log(response.data)
    // const data = await response.json()
    // return res.json(data)
}
export default {getBlogReadPage,forwardRequestCommand}