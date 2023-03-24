document.addEventListener('DOMContentLoaded', async function(){
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    const data = JSON.stringify({
        query: `
        query {
            allBlog(where: {
            slug: {
                current: {
                eq: "${postId}"
                }
            }
            })
            {
            title,
            _id,
            mainImage {
                asset {
                url
                }
            },
            publishedAt,
            bodyRaw,
            likes,
            views
            }
        }`
    })

    const response = await fetch('https://<yourProjectId>.api.sanity.io/v1/graphql/production/default', {
        method: 'post',
        body: data,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const json = await response.json();

    // display the fetched post
    displayPostDetails(json.data.allBlog[0])

    // update post views
    updateViews(json.data.allBlog[0]._id)

    // update likes on like button click
    const likeBtn = document.getElementById('likeBtn')
    likeBtn.addEventListener('click', () => updateLikes(json.data.allBlog[0]._id))
})

function displayPostDetails(post){
    // display title
    const postTitle = document.getElementById('postTitle')
    postTitle.textContent = post.title

    // display image
    const postImage = document.getElementById('postImage')
    let img = document.createElement('img')
    img.setAttribute('src', post.mainImage.asset.url)
    img.setAttribute('style', 'max-width: 400px;')
    postImage.appendChild(img)

    // display date published
    const postDate = document.getElementById('postDate')
    postDate.textContent = 'Published on: ' + post.publishedAt.split('T')[0]

    // display views
    const viewsCount = document.getElementById('viewsCount')
    viewsCount.textContent = post.views + ' views'

    // display likes
    const likesCount = document.getElementById('likesCount')
    likesCount.textContent = post.likes + ' likes'

    // render body
    renderBody(post.bodyRaw)
}

// parse the rich text blocks received from Sanity
function renderBody(blocks){
    const postBody = document.getElementById('postBody')

    return blocks.forEach(block => {
        if (block._type == 'block' && block.children) {
            let el = document.createElement(block.style)
            el.textContent = block.children.map(child => child.text)
            postBody.appendChild(el)
        }
    })
}

// function to update views on every page load
function updateViews(postId) {
    fetch('https://<yourProjectId>.api.sanity.io/v2021-06-07/data/mutate/production', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer <your-personal-api-token>',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "mutations": [
                {
                "patch": {
                    "id": `${postId}`,
                    "inc": {
                    "views": 1
                    }
                }
                }]
        })
    }).then(res => res.json()).then(data => console.log(data))
}

// function to update likes on the click of the like button
function updateLikes(postId) {
    fetch('https://0gfi03v3.api.sanity.io/v2021-06-07/data/mutate/production', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer skFPIYfjhAbylm0KrrVvPhJS3NxVUzVUPgvaT3JvnKAbDcKHeNx45M7xaa0xeoqbry9PeX4iqo5hLxYsp',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "mutations": [
                {
                "patch": {
                    "id": `${postId}`,
                    "inc": {
                    "likes": 1
                    }
                }
                }]
        })
    }).then(res => res.json()).then(data => console.log(data))
}