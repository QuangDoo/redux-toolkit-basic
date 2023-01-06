import { useAppDispatch } from 'hooks';
import { deletePost, editPost, getPostList } from 'pages/blog/blog.slice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { PostItem } from '../PostItem';
import { SkeletonLoading } from '../SkeletonLoading';

const PostList = () => {
  const { postList, loading } = useSelector((state: RootState) => state.blog);

  console.log('loading', loading);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getPostList());

    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const handleDeletePost = (id: string) => {
    dispatch(deletePost(id));
  };

  // store current post
  const handleEditPost = (post: Post) => {
    dispatch(editPost(post));
  };

  return (
    <div className='bg-white py-6 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
        <div className='mb-10 md:mb-16'>
          <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>
            Được Dev Blog
          </h2>
          <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
            Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ.
            Nhưng ngày mốt sẽ có nắng
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
          {loading ? (
            <>
              <SkeletonLoading />
              <SkeletonLoading />
              <SkeletonLoading />
            </>
          ) : (
            postList.map((post) => (
              <PostItem
                key={post.id}
                {...post}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList;
