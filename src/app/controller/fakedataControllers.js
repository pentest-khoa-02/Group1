import {main} from  "../helper/initdata.js"
//bây giờ ở đọc data từ db import 
const getFakedata = (req,res) => 
 {
    main()
    .then(data => {
      //res.send("FAKED DATA")
      res.json(data);
   })
    
 }
 export {getFakedata}