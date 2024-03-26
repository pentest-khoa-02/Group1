const getLoginPage =(req,res) =>{
    res.render('form-login', { layout: false })
}
export {getLoginPage}