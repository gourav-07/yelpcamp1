const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
	text:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'User' // refers to the model
		},
		username:String
	}
});

module.exports=mongoose.model('Comment',commentSchema);