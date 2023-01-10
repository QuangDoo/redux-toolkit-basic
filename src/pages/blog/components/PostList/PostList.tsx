import { useAppDispatch } from 'hooks';
import { startEditPost } from 'pages/blog/blog.slice';
import {
  useDeletePostMutation,
  useGetPostListQuery
} from 'pages/blog/services';
import { PostItem } from '../PostItem';
import { SkeletonLoading } from '../SkeletonLoading';

const PostList = () => {
  // isLoading only used for first render
  // isFetching used for each calling api
  const { data: postList, isFetching, isLoading } = useGetPostListQuery();

  const dispatch = useAppDispatch();

  const [onDelete] = useDeletePostMutation();

  // get postId, save to slice
  const handleEditPost = (postId: string) => () => {
    dispatch(startEditPost(postId));
  };

  const handleDeletePost = (id: string) => {
    onDelete(id);
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
          {isFetching ? (
            <>
              <SkeletonLoading />
              <SkeletonLoading />
              <SkeletonLoading />
              <SkeletonLoading />
            </>
          ) : (
            postList?.length &&
            postList.map((post) => (
              <PostItem
                key={post.id}
                {...post}
                onEdit={handleEditPost(post.id)}
                onDelete={handleDeletePost}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList;
