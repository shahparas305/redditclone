const posts = document.querySelector('.posts') 
const search = document.querySelector('.search')
const filterHot = document.querySelector('.filter__hot--c')
const filterNew = document.querySelector('.filter__new--c')
const filterControversial = document.querySelector('.filter__controversial--c')
const filterRising = document.querySelector('.filter__rising--c')
const filterTop = document.querySelector('.filter__top--c')
const filters = document.querySelectorAll('.filter--c')
const commentsButton = document.querySelector('.comments')
const modal_container = document.getElementById('modal_container')
const close = document.getElementById('close')
const comments_post_content = document.querySelector('.comments_post_content')
const comments_container = document.querySelector('.comments_container')
const dummycontainer = document.querySelector('.dummycontainer')
const dummysection = document.querySelector('.dummysection')
let subreddit
let postsArray = []
let postDataForComments = []
let comments = []
let filter = ''

const array = ['ravens', 'nfl', 'wallstreetbets', 'webdev', 'popular', 'all']


search.addEventListener("keyup", function(e) {
    e.preventDefault();
    dummysection.innerHTML = ''
    const searchWord = e.target.value
    const newFilter = array.filter((value) => {
        return value.toLowerCase().includes(searchWord.toLowerCase())
    })
    if(searchWord !== '') {
        dummycontainer.classList.remove('dummyhide')
        newFilter.forEach((i) => {
            dummysection.insertAdjacentHTML('beforeend', 
            `<div onClick="changeSubreddit('${i}')">r/${i}</div>`)
        })
        if(newFilter.length === 0) dummycontainer.classList.add('dummyhide')
    } else {
        dummycontainer.classList.add('dummyhide')
    }
    
    if (e.keyCode === 13) {
        search.blur();
        subreddit = search.value;
        postsArray = []
        posts.innerHTML = ''
        filter = ''
        removeActiveFilter()
        dummycontainer.classList.add('dummyhide')
        filterHot.classList.add('filter__active')
        getPosts();
    }
});

const changeSubreddit = (i) => {
    subreddit = i
    search.value = i
    postsArray = []
    posts.innerHTML = ''
    filter = ''
    removeActiveFilter()
    dummycontainer.classList.add('dummyhide')
    filterHot.classList.add('filter__active')
    getPosts()
}

const setFilter = (f) => {
    removeActiveFilter()
    if(f === 1) filter = '', filterHot.classList.toggle('filter__active')
    if(f === 2) filter = 'new', filterNew.classList.toggle('filter__active')
    if(f === 3) filter = 'rising', filterRising.classList.toggle('filter__active')
    if(f === 4) filter = 'controversial', filterControversial.classList.toggle('filter__active')
    if(f === 5) filter = 'top', filterTop.classList.toggle('filter__active')

    postsArray = []
    posts.innerHTML = ''
    getPosts();
}

const removeActiveFilter = () => {
    for (let i = 0; i < 5; i++) {
        filters[i].classList.remove('filter__active')
      }
}

const getPosts = () => {
    if(!subreddit) subreddit = 'ravens'

    fetch(`https://cors-anywhere.herokuapp.com/https://reddit.com/r/${subreddit}/${filter}.json`)
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
                "thumbnail": item.data.thumbnail,
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
                        <a class="comments__num" onClick="makeModal('${item.permalink}')">${item.comments} comments</a>
                    </div>
                </div>`
            )
        })
    })
}

const makeModal = (permalink) => {
    modal_container.classList.add('show')
    document.body.style.overflow = "hidden";

    fetch(`https://cors-anywhere.herokuapp.com/https://reddit.com/${permalink}.json`)
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
                "thumbnail": data[0].data.children[0].data.thumbnail,
                "domain": data[0].data.children[0].data.domain,
                "subreddit": data[0].data.children[0].data.subreddit
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
                `<div class="post__comments">
                    <div class="post__comments__header">
                        <div class="post__comments__info">
                            <div class="post__comments__subreddit">r/${postDataForComments[0].subreddit}</div>
                            <div class="post__comments__author">Posted by ${postDataForComments[0].author}</div>
                        </div>
                        <button id="close" class="close">Close me</button>
                    </div>
                    <h1 class="post__comments__title">${postDataForComments[0].title}</h1>
                    <div class="post__media">
                        ${postDataForComments[0].is_self ? `<div class="selftext">${postDataForComments[0].selftext}</div>`: ''}
                        ${postDataForComments[0].domain === 'i.redd.it' ? `<img class='image' src='${postDataForComments[0].image}'>` : ''}
                        ${postDataForComments[0].domain === 'v.redd.it' ? `<img class='media' src='${postDataForComments[0].thumbnail}'>` : ''}
                        ${postDataForComments[0].domain !== 'i.redd.it' && postDataForComments[0].domain !== 'v.redd.it' && postDataForComments[0].is_self === false ? `<img class='media' src='${postDataForComments[0].thumbnail}'>`: ''}
                    </div>
                    <div class="stats-con">
                        <div class="upvotes">&hearts; ${postDataForComments[0].upvotes}</div>
                        <a class="comments">&hardcy; ${postDataForComments[0].comments}</a>
                    </div>
                </div>`
            )

            comments.forEach(item => {
                comments_container.insertAdjacentHTML('beforeend',
                `<div class="comments">
                    <div class="comments__heading">
                        <div class="comments__author">${item.author}</div>
                        <div class="comments__upvotes">${item.upvotes} points</div>
                    </div>
                    <div class="comments__text">${item.body}</div>
                </div>`
                )
            })
        })      
}

modal_container.addEventListener("click", function(event) {
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


//things to do with this project still
//make sidebar, style modal window, responsiveness (slide out menu), fine tuning styling
//nested comments, OAUTH, media 

//Other things 
//Tidy up portfolio website, make line on the robinhood application, do something with 
//weatherlites 
//make the react version of this project 


//Do the sidebar and styling of modal 
//tidy up portfolio website 
//quickly finish the weatherlites very simply
//work on react version and OAUTH




//Things to work on with portfolio
//Arrows, page transitions

//Reddit clone 
//OAUTH, Authorization headers (CORS), NESTED COMMENTS, MEDIA


//Try to make react version work as it is now 
//OAUTH


//Simple, no effect approach
//CORS, responsive, style, media, comments 
//


//nodeJS cors, nested comments, picture media sizes, video playback, 
//self text/ comments formatting, add more posts after scrolling down 
