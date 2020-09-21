import { fetchAllPosts, fetchPostByTag, fetchTag } from '../../../services/blog'
import Head from 'next/head'
import Header from '../../../components/common/Header'
import Footer from '../../../components/common/Footer'
import Link from 'next/link'
// import Layout from '../../../components/Layout'
import PostList from '../../../components/blog/PostList'
import Label from '../../../components/common/Label'

export default function PostDetail(props) {
  const posts = props.posts.items
  console.log(posts)
  return(
    <>
      <Head>
        <title>MemoCached</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="container m-auto py-10">
        <div className="flex flex-wrap">
          {posts.map((post, id) => {
            return(
              <div key={id} className="w-1/3 px-2 mb-10">
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                  <Link href="/posts/[slug]" as={`/posts/${post.fields.slug}`}>
                    <a>
                      <PostList title={post.fields.title} createdAt={post.sys.createdAt} img_url={post.fields.image.fields.file.url} />
                    </a>
                  </Link>
                  <div className="flex px-4 py-4">
                  {post.fields.tag.map((tag_name, id) => {
                    return(
                      <React.Fragment key={id}>
                        <Link href="/posts/tag/[slug]" as={`/posts/tag/${tag_name.fields.slug}`}>
                          <a>
                            <Label name={tag_name.fields.name}/>
                          </a>
                        </Link>
                      </React.Fragment>
                    )
                  })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Link href="/">
          <a>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 my-12 border border-gray-400 rounded shadow">
              一覧へ戻る
            </button>
          </a>
        </Link>
      </div>
      <Footer />
    </>
  )
}

export async function getStaticProps({params}) {

  //paramsにはルーティングの情報が入っている
  const slug = params.slug // 「react」や「typescript」等

  //slugで対象のカテゴリを抽出
  const tag = await fetchTag(slug);

  // category_idを取得
  const tagId = tag.items[0].sys.id;
  
  // カテゴリIDにマッチする記事を取得する
  const posts = await fetchPostByTag(tagId)

  return {
    props: {
      posts: posts
    }
  }
}

export async function getStaticPaths() {
  const posts = await fetchAllPosts()
  const paths = posts.map((post) => {
      return `/posts/tag/${post.fields.tag[0].fields.slug}`
    })

  return {
    paths: paths,
    fallback: false
  }
}