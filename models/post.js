const mongoose=require('mongoose');

const postSchema=mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    title:String,
    caption:String,
    description:String,
    author:String,
},{collection:'newOtpDatas'});

const postModel=mongoose.model('Post',postSchema);
module.exports=postModel 