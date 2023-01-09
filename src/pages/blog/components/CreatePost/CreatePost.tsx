import classNames from 'classnames';
import { isEntityError } from 'helper';
import { useAppDispatch } from 'hooks';
import { cancelUpdatePost } from 'pages/blog/blog.slice';
import {
  useAddPostMutation,
  useGetPostQuery,
  useLazyGetPostQuery,
  useUpdatePostMutation
} from 'pages/blog/services';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const initialState: Post = {
  id: '',
  title: '',
  description: '',
  publishDate: '',
  featuredImage: '',
  published: false
};

// generic type
type FormError = {
  [key: string]: string | null;
} | null;

const CreatePost = () => {
  const [formData, setFormData] = useState<Post>(initialState);

  const postId = useSelector(
    (state: RootState) => state?.blog?.postId
  ) as string;

  const { data } = useGetPostQuery(postId, {
    skip: !postId,
    refetchOnMountOrArgChange: true
    //auto call api every 1s use pollingInterval
    // pollingInterval: 1000
  });
  const [addPost, { isSuccess, error: addPostError }] = useAddPostMutation();
  const [updatePost, { isSuccess: isUpdateSuccess, error: updatePostError }] =
    useUpdatePostMutation();

  const dispatch = useAppDispatch();

  const errorForm: FormError = useMemo(() => {
    /**
     * FetchBaseQueryError: Dùng cho catch error từ fetch api.
     * ```type FetchBaseQueryError
     *   status: number
     *   data: unknown
     *
     * SerializedError: Dùng cho lỗi từ user code
     * ```type SerializedError
     * name?: string
     * message?: string
     * stack?: string
     * code?: string
     */
    const errorResult = postId ? updatePostError : addPostError;
    if (isEntityError(errorResult)) {
      return errorResult.data.error as FormError;
    }
    return null;
  }, [postId, updatePostError, addPostError]);

  useEffect(() => {
    setFormData((prevState) => {
      return { ...prevState, ...data };
    });
  }, [data]);

  useEffect(() => {
    setFormData(initialState);
    dispatch(cancelUpdatePost());
  }, [isSuccess, isUpdateSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    const { name, value, checked } = e.target;

    name === 'published'
      ? setFormData((previousState) => {
          return { ...previousState, [name]: checked };
        })
      : setFormData((previousState) => {
          return { ...previousState, [name]: value };
        });
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (postId) {
      updatePost(formData);
    } else {
      const formDataWithId = { ...formData };
      addPost(formDataWithId);
    }
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <div className='mb-6'>
        <label
          htmlFor='title'
          className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
          onClick={() => dispatch({ type: 'edit' })}
        >
          Title
        </label>
        <input
          type='text'
          id='title'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Title'
          required
          value={formData?.title}
          name='title'
          onChange={handleChange}
        />
      </div>
      <div className='mb-6'>
        <label
          htmlFor='featuredImage'
          className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          Featured Image
        </label>
        <input
          type='text'
          id='featuredImage'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Url image'
          name='featuredImage'
          required
          onChange={handleChange}
          value={formData?.featuredImage}
        />
      </div>
      <div className='mb-6'>
        <div>
          <label
            htmlFor='description'
            className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'
          >
            Description
          </label>
          <textarea
            id='description'
            rows={3}
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Your description...'
            onChange={handleChange}
            name='description'
            value={formData?.description}
          />
        </div>
      </div>
      <div className='mb-6'>
        <label
          htmlFor='publishDate'
          className={classNames(
            `mb-2 block text-sm font-medium  dark:text-gray-300`,
            {
              'text-red-700': Boolean(errorForm?.publishDate),
              'text-gray-900': !Boolean(errorForm?.publishDate)
            }
          )}
        >
          Publish Date
        </label>
        <input
          type='datetime-local'
          id='publishDate'
          className='block w-56 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Title'
          required
          name='publishDate'
          value={formData?.publishDate.toString()}
          onChange={handleChange}
        />
        {!!errorForm?.publishDate && (
          <p className='mt-2 text-sm text-red-700'>
            <span className='font-medium'>Lỗi! {errorForm?.publishDate}</span>
          </p>
        )}
      </div>
      <div className='mb-6 flex items-center'>
        <input
          id='publish'
          type='checkbox'
          className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
          onChange={handleChange}
          checked={formData?.published}
          name='published'
        />
        <label
          htmlFor='publish'
          className='ml-2 text-sm font-medium text-gray-900'
        >
          Publish
        </label>
      </div>
      <div>
        <button
          className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
          type='submit'
          disabled={!!postId}
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Publish Post
          </span>
        </button>
        <button
          type='submit'
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Update Post
          </span>
        </button>
        <button
          type='reset'
          className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
        >
          <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
            Cancel
          </span>
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
