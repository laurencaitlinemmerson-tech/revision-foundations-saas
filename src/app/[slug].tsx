// /pages/blog/[slug].tsx

import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';

export default function BlogPost({ post }: { post: any }) {
  if (!post) {
    return <div>Post not found!</div>;
  }

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '2rem', fontFamily: 'Playfair Display', color: '#1C1510' }}>
        {post.title}
      </h1>
      <p style={{ fontSize: '16px', color: '#5C4A38' }}>{post.excerpt}</p>
      <div style={{ marginTop: '20px', fontSize: '16px', color: '#9C8878' }}>
        <p>{post.content}</p>
      </div>
    </div>
  );
}

// Generates paths for each blog post
export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'data', 'blog.JSON');
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const paths = fileData.map((post: any) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false, // 404 page if post is not found
  };
};

// Fetches data for a specific blog post based on the slug
export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const filePath = path.join(process.cwd(), 'data', 'blog.JSON');
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const post = fileData.find((p: any) => p.slug === params.slug);

  return {
    props: {
      post,
    },
  };
};
