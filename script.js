const posts = document.querySelector('.posts') 
const search = document.querySelector('.search')
const filterHot = document.querySelector('.filter__hot')
const filterNew = document.querySelector('.filter__new')
const filterControversial = document.querySelector('.filter__controversial')
const filterRising = document.querySelector('.filter__rising')
const filterTop = document.querySelector('.filter__Top')
const commentsButton = document.querySelector('.comments')
const modal_container = document.getElementById('modal_container')
const close = document.getElementById('close')
const comments_post_content = document.querySelector('.comments_post_content')
const comments_container = document.querySelector('.comments_container')
let subreddit
let postsArray = []
let postDataForComments = []
let comments = []
let filter = ''




search.addEventListener("keyup", function(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
        search.blur();
        subreddit = search.value;
        postsArray = []
        posts.innerHTML = ''
        filter = ''
        getPosts();
    }
});

const setFilter = (f) => {
    if(f === 1) filter = ''
    if(f === 2) filter = 'new'
    if(f === 3) filter = 'rising'
    if(f === 4) filter = 'controversial'
    if(f === 5) filter = 'top'

    postsArray = []
    posts.innerHTML = ''
    getPosts();
}


const getPosts = () => {
    if(!subreddit) subreddit = 'ravens'

    fetch(`https://reddit.com/r/${subreddit}/${filter}.json`)
    .then(res => res.json())
    .then(data => {
        data.data.children.forEach(item => {
            postsArray.push({
                "title": item.data.title,
                "author": item.data.author,
                "upvotes": item.data.ups,
                "comments": item.data.num_comments,
                "stickied": item.data.stickied,
                "is_self": item.data.is_self,
                "selftext": item.data.selftext,
                "permalink":item.data.permalink,
                "domain": item.data.domain,
                "image": item.data.url,
                "thumbnail": item.data.thumbnail
            })
        });

        postsArray.forEach((item) => {
            posts.insertAdjacentHTML('beforeend', 
                `<div class="post">
                    <div class="author ${(item.stickied) ? 'stickied' : ''}">submitted by ${item.author}</div>
                    <div class="title">${item.title}</div>
                    ${item.is_self ? `<div class="selftext">${item.selftext}</div>`: ''}
                    ${item.domain === 'i.redd.it' ? `<img class='image' src='${item.image}'>` : ''}
                    ${item.domain === 'v.redd.it' ? `<img class='media' src='${item.thumbnail}'>` : ''}
                    ${item.domain !== 'i.redd.it' && item.domain !== 'v.redd.it' && item.is_self === false ? `<img class='media' src='${item.thumbnail}'>`: ''}
                    <div class="stats-con">
                        <div class="upvotes">${item.upvotes} upvotes</div>
                        <a class="comments" onClick="makeModal('${item.permalink}')">${item.comments} comments</a>
                    </div>
                </div>`
            )
        })
    })
}

const makeModal = (permalink) => {
    modal_container.classList.add('show')
    document.body.style.overflow = "hidden";

    fetch(`https://reddit.com/${permalink}.json`)
        .then(res => res.json())
        .then(data => {
            postDataForComments.push({
                "title": data[0].data.children[0].data.title,
                "author": data[0].data.children[0].data.author,
                "upvotes": data[0].data.children[0].data.ups,
                "comments": data[0].data.children[0].data.num_comments,
                "stickied": data[0].data.children[0].data.stickied,
                "is_self": data[0].data.children[0].data.is_self,
                "selftext": data[0].data.children[0].data.selftext,
                "permalink": data[0].data.children[0].data.permalink,
                "image": data[0].data.children[0].data.url,
                "thumbnail": data[0].data.children[0].data.thumbnail
            })

            data[1].data.children.forEach(item => {
                comments.push({
                    "body": item.data.body,
                    "author": item.data.author,
                    "upvotes": item.data.ups,
                    "replies": item.data.replies,                    
                })
            })

            comments_post_content.insertAdjacentHTML('beforeend', 
                `<div class="post">
                    <div class="author">submitted by ${postDataForComments[0].author}</div>
                    <div class="title">${postDataForComments[0].title}</div>
                    <div class="stats-con">
                        <div class="upvotes">${postDataForComments[0].upvotes} upvotes</div>
                        <a class="comments">${postDataForComments[0].comments} comments</a>
                    </div>
                </div>`
            )

            comments.forEach(item => {
                comments_container.insertAdjacentHTML('beforeend',
                `<div class="comments">
                    <div class="comments__author">${item.author}</div>
                    <div class="comments__content">${item.body}</div>
                    <div class="comments__stats-c">
                        <div class="comments__upvotes">${item.upvotes}</div>
                    </div>
                </div>`
                )
            })
        })       
}


modal_container.addEventListener("click", function (event) {
    if (
        !event.target.closest(".modal") ||
        event.target.matches('.close')
    ) {
        closeModal();
    }
});

function closeModal() {
    modal_container.classList.remove('show')
    postDataForComments = []
    comments = []
    comments_container.innerHTML = ''
    comments_post_content.innerHTML = ''
    document.body.style.overflow = "";

}

getPosts()



//goes through all comments in comments array 
//if there is a comment with a reply, then go through all those comments and display them 




//should be an array of objects 
//when youre going through the posts, if the posts end then stop the function 


//post hint can tell you whether or not the post is selftext ('') link ('link') 
//image ('image') or hosted:video ('hosted:video')
//use this info to make the title a link or not 
//make content under the title a selftext open tab, image, or video 

//post hint doesnt work consistently with subreddits 
//get if a post is a self post or not
//use domain "i.redd.it" or "v.redd.it" to determine if reddit post
//if not then it is an outside link

//want to add self text functionality, which is you click a button to see entire self text


//ok so getting an error with import/export the javascript variable between js pages
//some reason the import is reading the entire javascript and not just whatever we 
//imported. 

//this problem could be solved with storing the variable in local host however 
//im just going to take the easy route and just make the comment post in a modal 

//so basically we want where we click the comments 
//open the modal
//make a function of makeModal() with the permalink as parameter 
//fetch the post data (author, title, media, comments, upvotes)
//display the comments and try to do the nesting lol 
//when you click out of the modal, then clear all the data out 


//conditionally go to the replies element
            //if there are replies
            //create a new array and loop through the replies.children.data array
            //put the contents of them into the new array
            //put that new array into the comments element
            // comments.forEach(item => {
            //     if(item.replies !== "" && item.replies !== undefined) {
            //         item.replies.data.children.forEach(item => {
            //             nestedReplies.push({

            //             })
            //         })
            //         }
                    
            // comments.forEach(item => {
            //     if(item.replies !== "" && item.replies !== undefined) {
            //         nest = item.replies.data.children.forEach(item => {
            //             nest1 = comments.map(v => ({...comments, replies2: item.data.body}))
            //         })
            //         // const nest = item.replies.data.children.forEach(item => {
            //         //     console.log(item.data.body)
            //         // })
            //         // console.log(nest)
            //     }
            // })





            
            //this is sorting all the comments that have replies
            
                    // item.replies.data.children.forEach(item => {
                    //    console.log(item)
                    // })
                    // data[1].data.children.forEach(item => {
                    //     console.log(item.data.replies.data.children.data.body)
                    // })
                    
             

            // console.log(comments)




            // comments.forEach(item => {
//     if(item.replies !== "" && item.replies !== undefined) {
//         item.replies.data.children.forEach(item => {
//     }
// })


//conditionally go to the replies element
//if there are replies create a new array and loop through the replies.children.data array
//put the contents of them into the new array
//put that new array into the comments element