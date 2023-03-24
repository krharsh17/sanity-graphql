document.addEventListener('DOMContentLoaded', async function(){
    const data = JSON.stringify({
        query: `query {
                    allBlog {
                        title,
                        slug {
                            current
                        },
                        bodyRaw,
                        mainImage {
                            asset {
                                url
                            }
                        },
                        views,
                        likes
                    }
                }`
    })

    const response = await fetch('https://<your-project-id>.api.sanity.io/v1/graphql/production/default', {
        method: 'post',
        body: data,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const json = await response.json();
    
    if(json?.data?.allBlog){
        displayBlogs(json.data.allBlog)
    }else{
        alert('An error occured while fetching existing blogs')
    }
})

function displayBlogs(posts){
    const blogsContainer = document.getElementById('blogs')

    const blogCardTemplate = document.createElement('template')

    posts.forEach(post => {
        blogCardTemplate.innerHTML = `
            <div class='postContainer'>
                <div class='postTitle'>${post.title}</div>

                <div class='postCard'>
                    <img class='postImg' src=${post.mainImage.asset.url} alt="postImage" />

                    <div class='postDetails'>
                    <div class='postPreview'>
                        ${toPlainText(post.bodyRaw).slice(0, 350)} ...
                    </div>
                    <button class='btn'><a href='posts/post.html?id=${post.slug.current}' style='text-decoration: none; color: white;'>Read more</a></button>
                    </div>
                </div>
            </div>
        `

        blogsContainer.appendChild(blogCardTemplate.content)
    })
}

function toPlainText(blocks) {
    return blocks
    // loop through each block
    .map(block => {
        // if it's not a text block with children,
        // return nothing
        if (block._type !== 'block' || !block.children) {
        return ''
        }
        // loop through the children spans, and join the
        // text strings
        return block.children.map(child => child.text).join('')
    })
    // join the paragraphs leaving split by two linebreaks
    .join('\n\n')
  }