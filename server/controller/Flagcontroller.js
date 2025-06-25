const Flag= require("../model/Flagmodel");

const createFlag= async (req,res)=>
{
try{
const flag = await Flag.create(req.body);
res.status(200).json(flag);
}
catch (error){
res.status(500).json({ message: error.message });
}
};

 module.exports = {
createFlag
 };