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
const subreddit__title = document.querySelector('.subreddit__title')
let filter = ''
let subreddit = 'ravens'
let ireddit
let vreddit
let vthumb
let streamVideo
let gallery
let subredditInfo = []
let subredditIcon
let postsArray = []
let comments = []

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
        // newFilter.forEach((i) => {
        //     dummysection.insertAdjacentHTML('beforeend', 
        //     `<div onClick="changeSubreddit('${i}')">r/${i}</div>`)
        // })
        if(newFilter.length === 0) dummycontainer.classList.add('dummyhide')
    } else {
        dummycontainer.classList.add('dummyhide')
    }
    
    if (e.keyCode === 13) {
        if(searchWord === 'popular') {
            subreddit__title.innerHTML = "r/popular"
        } else if (searchWord === 'all') {
            subreddit__title.innerHTML = "r/all"
        }

        search.blur();
        subreddit = search.value;
        subredditIcon = ''
        subredditInfo = []
        postsArray = []
        posts.innerHTML = ''
        filter = ''
        removeActiveFilter()
        dummycontainer.classList.add('dummyhide')
        filterHot.classList.add('filter__active')
        getSubredditInfo()
        getPosts();
    }
});

const changeSubreddit = (i) => {
    subreddit = i
    search.value = i
    subredditIcon = ''
    subredditInfo = []
    postsArray = []
    posts.innerHTML = ''
    filter = ''
    removeActiveFilter()
    dummycontainer.classList.add('dummyhide')
    filterHot.classList.add('filter__active')
    getSubredditInfo()
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

const getSubredditInfo = () => {
    const data = axios.get("https://redditclone305.herokuapp.com/subreddit", {
        params: {
            subreddit: subreddit,
        },
    }).then(res => {
        subredditIcon = res.data.data.icon_img
        subredditInfo.push({
            "subredditIcon": subredditIcon,
            "subredditTitle":  res.data.data.display_name
        })

        subreddit__title.innerHTML = "r/" + subredditInfo[0].subredditTitle
        
    }).catch(err => console.error(err));



}

const getPosts = () => {
    const data = axios.get("https://redditclone305.herokuapp.com/posts", {
        params: {
            subreddit: subreddit,
            filter: filter
        },
    }).then(res => {
        console.log(res)
        res.data.data.children.forEach(item => {

            ireddit = ''
            vreddit = ''
            youtube = ''
            gallery = ''
            vthumb = ''
            // if(item.data.domain === 'i.redd.it') {
            //     if(item.data.preview !== undefined) {
            //         ireddit = item.data.preview.images
            //     }
            // }

            if(item.data.domain === 'v.redd.it') {
                if(!item.data.crosspost_parent && item.data.secure_media != null) {
                    vreddit = item.data.secure_media.reddit_video.fallback_url;
                    if(item.data.preview != null) {
                        vthumb = item.data.preview.images[0].source.url
                    }
                } else {
                    vreddit = item.data.crosspost_parent_list[0].secure_media.reddit_video.fallback_url
                }
            }

            if(item.data.domain === 'youtube.com' || item.data.domain === 'streamable.com' || item.data.domain === 'gfycat.com') {
                streamVideo = item.data.secure_media_embed.content
                // streamVideo = streamVideo.replace('width="356" height="200"', '')
            }

            if(item.data.is_gallery) {
                gallery = item.data.media_metadata               
            }

            //For single images, you do not need responsive images. Prozilla uses the same image on desktop and mobile. 
            //its just the media container changing size
            //So for the gallery, you'll only need one size 
            //Gallery you need to some how sort through 4 different objects to get to one image. Maybe a For In loop would be necessary 
            

            //For v.redd.it, you can get the fallback URL
            //add audio seperately, and add custom controls 

            //Link is just the URL

            //You can get streamables, it gives an iframe, you'll need to add in the <> and remove slashes in the iframe, but it works well 
            //Youtube is the same, an iframe just need to fix it up

            postsArray.push({
                "title": item.data.title,
                "author": item.data.author,
                "upvotes": item.data.ups,
                "comments": item.data.num_comments,
                "stickied": item.data.stickied,
                "is_self": item.data.is_self,
                "selftext": item.data.selftext_html,
                "permalink":item.data.permalink,
                "domain": item.data.domain,
                "image": item.data.url,
                "thumbnail": item.data.thumbnail,
                "subreddit": item.data.subreddit,
                "flair": item.data.link_flair_text,
                // "rimage": ireddit,
                "video": vreddit,
                "vthumb": vthumb,
                "streamVideo": streamVideo,
                "gallery": gallery,
                "subredditIcon": subredditIcon,
            })
        });

        postsArray.forEach((item, index) => {

            const postMedia = () => {
                if(item.is_self && item.selftext != null) return `<div class="post__media2" id="selftext">${item.selftext}</div>`
                else if(item.domain === 'i.redd.it' || item.domain === 'i.imgur.com') return `<img class='post__media2' src='${item.image}'>`
                else if(item.domain === 'v.redd.it') 
                    return `<video class="post__media2 post__img" poster="${item.vthumb}" controls>
                                <source src="${item.video}" type="video/mp4">
                            </video>`
                else if(item.domain === 'youtube.com' || item.domain === 'streamable.com' || item.domain === 'gfycat.com') return `<div class="post__media2">${item.streamVideo}</div>`
                else if(!item.thumbnail || item.thumbnail === 'default') return `<div class="displaynone"></div>`
                else if(item.domain !== 'i.redd.it' && item.domain !== 'v.redd.it' && item.is_self === false) 
                    return `<img class='post__media2' src='${item.thumbnail}'>`
                else return `<div class="displaynone"></div>`
            }

            //You can get subreddit icons, banner, subcribers, recently online, etc very easily from ravens/about.json
            //able to make the side menu and get subreddit icons for the posts 
            //would need to make another fetch request
            //wouldn't work for r/all or r/popular 
        
            posts.insertAdjacentHTML('beforeend', 
                `<div class="post">
                    <div class="post__topinfo">
                        <div class="post__topinfo__text">
                            <img class="post__subreddit__icon" src=${(item.subredditIcon) ? item.subredditIcon : "logo.svg"}>
                            <div class="post__subreddit">r/${item.subreddit} &middot;</div>
                            <div class="author"> Posted by u/${item.author}</div>
                        </div>
                        <div class="stickied ${(item.stickied ? "stickied__show" : "")}"><i title="Pinned by moderators" class="green fas fa-thumbtack"></i></div>
                    </div>
                    <div class="title">${item.title}</div>
                    <div class="post__media__container">
                        <div class=""post__media__inner__container>                         
                            ${postMedia()}                          
                        </div>
                    </div>
                    <div class="stats-con">
                        <div class="upvotes"><i class="far fa-heart"></i> ${item.upvotes}</div>
                        <a class="comments__num" onClick="makeModal('${item.permalink}', ${index})"><i class="far fa-comment"></i> ${item.comments} comments</a>
                    </div>
                </div>`
            )
        })
    }).catch(err => console.error(err));
    // })
}

//to get postsData for comments, you would pass the index in the comments OnClick of postarrays

const makeModal = (permalink, index) => {
    modal_container.classList.add('show')
    document.body.style.overflow = "hidden";

    const data = axios.get("https://redditclone305.herokuapp.com/comments", {
        params: {
            permalink: permalink,
        },
    }).then(res => {

            res.data[1].data.children.forEach(item => {
                comments.push({
                    "body": item.data.body_html,
                    "author": item.data.author,
                    "upvotes": item.data.ups,
                    "replies": item.data.replies, 
                    "stickied": item.data.stickied                   
                })
            })

            //BEGIN

            const commentsPostMedia = () => {
                if(postsArray[index].is_self && postsArray[index].selftext != null) 
                    return `<div class="post__media">${postsArray[index].selftext}</div>`
                else if(postsArray[index].domain === 'i.redd.it' || postsArray[index].domain === 'i.imgur.com') 
                    return `<div class="post__media__container">
                                <div class=""post__media__inner__container>
                                    <img class='post__media2' src='${postsArray[index].image}'>
                                </div>
                            </div>`
                else if(postsArray[index].domain == 'v.redd.it') 
                    return `<div class="post__media__container">
                                <div class=""post__media__inner__container>
                                    <video class="post__media2" poster="${postsArray[index].vthumb}" controls>
                                        <source src="${postsArray[index].video}" type="video/mp4">
                                    </video>
                                </div>
                            </div>`
                else if(postsArray[index].domain === 'youtube.com' || postsArray[index].domain === 'streamable.com') 
                    return postsArray[index].streamVideo
                else if(postsArray[index].domain !== 'i.redd.it' && postsArray[index].domain !== 'v.redd.it' && postsArray[index].is_self === false) 
                    return `<a class="selftext" href="${postsArray[index].image}">${postsArray[index].image}</a>`
                else return `<div class="displaynone"></div>`
            }

            comments_post_content.insertAdjacentHTML('beforeend', 
                `<div class="post__comments">
                    <div class="post__comments__header">
                        <div class="post__comments__info">
                            <img class="post__subreddit__icon" src=${(postsArray[index].subredditIcon) ? postsArray[index].subredditIcon : "logo.svg"}>
                            <div class="post__comments__subreddit">r/${postsArray[index].subreddit} &middot;</div>
                            <div class="post__comments__author">Posted by ${postsArray[index].author}</div>
                        </div>
                        <i class="fa-solid fa-x close" id="close"></i>
                    </div>
                    <h1 class="post__comments__title">${postsArray[index].title}</h1>
                    ${commentsPostMedia()}
                    <div class="post__stats-con">
                        <div class="post__upvotes"><i class="far fa-heart"></i> ${postsArray[index].upvotes}</div>
                        <div class="post__comments__num"><i class="far fa-comment"></i> ${postsArray[index].comments} comments</div>
                    </div>
                </div>`
            )

            if(comments.length === 0) {
                comments_container.insertAdjacentHTML('beforeend',
                `<div class="comments">No comments</div>`
            )}
            else {
            comments.forEach(item => {
                comments_container.insertAdjacentHTML('beforeend',
                `<div class="comments">
                    <div class="comments__heading">
                        <img class="comments__icon" src="comment-img${Math.floor(Math.random() * 8) + 1}.jpg">
                        <div class="comments__author">${item.author}</div>
                        <div class="comments__upvotes">${item.upvotes} points</div>
                    </div>
                    <div class="comments__body">
                        ${item.body}
                    </div>
                </div>`
                )
            })
        }
        }).catch(err => console.error(err));      
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

getSubredditInfo()
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
