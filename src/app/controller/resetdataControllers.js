import {main} from '../../config/resetdata.js'

const index =(req,res) =>{
    main();
    res.send("ok");
}
export {index}
