import { CreatePost, PostList } from './components';

const Blog = () => {
  return (
    <div className='p-5'>
      <CreatePost />
      <PostList />
    </div>
  );
};

export default Blog;
