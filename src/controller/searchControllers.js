import db from "../config/database.js"

const search2 = async (req, res) => {
    const obj = req.query
    var chr = ["'", "-", '"', "union", "select", "drop"]
    let kiemtra = true
    for(let i = 0; i < chr.length; i++)
    {
        let check = obj.name.indexOf(chr[i])
        if(check != -1) 
        {
            kiemtra = false
            break
        }
    }
    if(!kiemtra){
        return res.send("Error Input!!!")
    }
    else{
        const query = `SELECT firstname, lastname, university, live, job FROM public."user_info" where lastname LIKE '%${obj.name}%'`
        const query2 = `SELECT firstname, lastname, university FROM public."user_info"`
        let lowercaseNames
        await db.Client.query(query2, (err, result) => {
            if(err) console.log('Error!')
            else{
                lowercaseNames = result.rows
            }
        })
        const findUser = await db.Client.query(query, (err, result) => {
            if(err) console.error("Error!")
            else{
                var fUser = lowercaseNames.filter( (lowercaseName) => {
                    return (lowercaseName.lastname).toLowerCase().indexOf(obj.name.toLowerCase()) !== -1
                })

                if(obj.name != '')
                {
                    res.send(fUser)
                }
            }
            
        })
    }
}

const search = async (req, res) => {
    const obj = req.query
    var chr = ["'", "-", '"', "union", "select", "drop", "#", ")"]
    let kiemtra = true
    for(let i = 0; i < chr.length; i++)
    {
        let check = obj.name.indexOf(chr[i])
        if(check != -1) 
        {
            kiemtra = false
            break
        }
    }
    const query = `SELECT firstname, lastname, university, live, job FROM public."user_info" where lastname LIKE '%${obj.name}%'`
    const query2 = `SELECT firstname, lastname, live, university FROM public."user_info"`
    let lowercaseNames
    await db.Client.query(query2, (err, result) => {
        if(err) console.log('Error!')
        else{
            lowercaseNames = result.rows
        }
    })
    let checkStatus = "";
    const sql = await db.Client.query(`SELECT status FROM public."vulnerable" WHERE name = 'SQL Injection'`, (err, result) => {
        if(err)
            { 
                console.log('ERROR!')
                return;
            }
        else{
            var checkS = result.rows
            checkStatus = checkS[0].status 
            if(checkStatus == "No"){
                console.log("No SQL Injection")
                
                if(!kiemtra) {
                    let fUser = lowercaseNames.filter( (lowercaseName) => {
                        return (lowercaseName.lastname).toLowerCase().indexOf(obj.name.toLowerCase()) !== -1
                    })
                    res.render('search', {userinfo: fUser, check: true, checkChar: true})
                }
                else{
                    const findUser = db.Client.query(query, (err, result2) => {
                        if(err) {
                            console.log("Error!")
                            return;
                            }
                        else{
                            let fUser = lowercaseNames.filter( (lowercaseName) => {
                                return (lowercaseName.lastname).toLowerCase().indexOf(obj.name.toLowerCase()) !== -1
                            })
                            if(obj.name != '')
                            {
                                res.render('search', {userinfo: fUser, check: true, checkChar: false})
                            }
                            else {
                                res.render('search', {userinfo: fUser, check: false, checkChar: false})
                            }
                        }   
                    })
                }
            }
            else{
                const findUser = db.Client.query(query, (err, result2) => {
                    if(err) {
                        console.log("Error!");
                        console.log(err)
                        return res.send("Something went wrong");
                    }
                    else{
                        let fUser = lowercaseNames.filter( (lowercaseName) => {
                            return (lowercaseName.lastname).toLowerCase().indexOf(obj.name.toLowerCase()) !== -1
                        })
                        let arrUser = result2.rows
                        if(obj.name.search("'") >= 0) res.render('search', {userinfo: arrUser, check: true, checkChar: false})
                        else res.render('search', {userinfo: fUser, check: true, checkChar: false})
                    }   
                })
            }
        }
    })
}

export default {search, search2}