const getComponentPage = (req,res) => {
    res.render('components',{layout:false})
}
export {getComponentPage}