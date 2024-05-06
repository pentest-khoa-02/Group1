import jwt from "jsonwebtoken"

const token  = jwt.sign({"isadmmin" : "true"},"supersecure",{algorithm : "none"})
console.log(token)
// const token = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc2FkbW1pbiI6InRydWUiLCJpYXQiOjE3MTQyMTMxMDd9.U9c2k1dHJrlHYRJ8i-fUH5m_v6n_CqQlvuynyzlDUqQ'
const decode = jwt.verify(token)
console.log(decode)