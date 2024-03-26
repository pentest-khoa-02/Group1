
const getRegisterPage = (req,res) => {
    res.render('form-register', { layout: false })
}

/*const postRegisterPage = (req,res) => {
    console.log("6666");
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const text = `insert into form_register (first_name, last_name, email, password) values (${first_name}, ${last_name}, ${email}, ${password})`;
    const res1 = client.query(text);
    console.log(res1.rows);
}*/

export {getRegisterPage}
