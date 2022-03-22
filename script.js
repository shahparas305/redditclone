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

let data = ''

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

            console.log(comments)

            comments_post_content.insertAdjacentHTML('beforeend', 
                `<div class="post__comments">
                    <div class="post__comments__header">
                        <div class="post__comments__info">
                            <img class="post__comments__icon" src="hello.jpg">
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
                        <img class="comments__icon" src="hello.jpg">
                        <div class="comments__author">${item.author}</div>
                        <div class="comments__upvotes">${item.upvotes} points</div>
                    </div>
                    <div class="comments__text">${item.body}</div>
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
