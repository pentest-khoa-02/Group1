import db from "../config/database.js"

// [GET] /settings
const setting = async (req,res) => {
    const query = `SELECT name, status FROM public."vulnerable"`
    await db.Client.query(query, (err, result) =>{
        if(err) res.send('Error!')
        else{
            let vuls = result.rows
            res.render('settingvul',{ vul: vuls, layout: false })
        }
    }) 
}

// [PUT] /settings/submit
const submit = async (req, res) => {
    const obj = req.body
    for(const key in obj){
        const query = `UPDATE vulnerable SET status = '${obj[key]}' WHERE name = '${key}'`
        await db.Client.query(query, (err, result) => {
            if(err) console.log("ERROR!")
            else{
            }
        })
    }
    setTimeout(() => {
        res.redirect('/settings')
    }, 3000)
}

export default {setting, submit}