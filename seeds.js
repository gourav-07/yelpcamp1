// Run the seeds file every time the server starts . It provides some initial data after removing everything from the database.

//error driven development

const mongoose=require('mongoose');
const Campground=require('./models/campground');
const Comment=require('./models/comment');

const data=[
	{
		name:'Cloud rest',
		image:'https://farm8.staticflickr.com/7341/12899401984_3ba1c2d539.jpg',
		description:'loreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu loreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinid imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinid'
	},
	{
		name:'Cloud rest',
		image:'https://farm5.staticflickr.com/4276/34972409455_9f2f01e9c3.jpg',
		description:'loreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinid'
	},
	{
		name:'Cloud rest',
		image:'https://farm9.staticflickr.com/8076/8289725322_0d6fc08a95.jpg',
		description:'loreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinidloreu imdos sdjfils difin indnfidn disljdfisjd idinid'
	}
];

function seedDB() {
	// Remove all camps
	Campground.remove({},function(err) {
		if(err) {
			console.log(err);
		}
		console.log('removed camps');
	// add new camps
		data.forEach(function(seed) {
			Campground.create(seed,function(err,campground){
				if(err) {
					console.log(err);
				} else{
					console.log('added a camp');
					// create a comment
					Comment.create({
						text:'great place',
						author:'Hamer'
					},function(err,comment) {
						if(err) {
							console.log(err);
						} else {
							campground.comments.push(comment);
							campground.save();
							console.log('created a new comment');
						}
						
					})
				}
			});
		});
	});
}

module.exports=seedDB;