/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Nếu bên slice chúng ta dùng createSlice để tạo slice thì bên RTK query dùng createApi
// Với createApi chúng ta gọi là slice api
// Chúng ta sẽ khai báo baseUrl và các endpoints

// baseQuery được dùng cho mỗi endpoint để fetch api

// fetchBaseQuery là một function nhỏ được xây dựng trên fetch API
// Nó không thay thế hoàn toàn được Axios nhưng sẽ giải quyết được hầu hết các vấn đề của bạn
// Chúng ta có thể dùng axios thay thế cũng được, nhưng để sau nhé

// endPoints là tập hợp những method giúp get, post, put, delete... tương tác với server
// Khi khai báo endPoints nó sẽ sinh ra cho chúng ta các hook tương ứng để dùng trong component
// endpoints có 2 kiểu là query và mutation.
// Query: Thường dùng cho GET
// Mutation: Thường dùng cho các trường hợp thay đổi dữ liệu trên server như POST, PUT, DELETE
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    getPostList: builder.query<Post[], void>({
      query: () => `posts`,
      // Provides a list of `Posts` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Posts` element was added.

      providesTags(result) {
        /**
         * Cái callback này sẽ chạy mỗi khi getPosts chạy
         * Mong muốn là sẽ return về một mảng kiểu
         * ```ts
         * interface Tags: {
         *    type: "Posts";
         *    id: string;
         *  }[]
         *```
         * vì thế phải thêm as const vào để báo hiệu type là Read only, không thể mutate
         */
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ];
          return final;
        }
        return [{ type: 'Posts', id: 'LIST' }];
      }
    }),
    getPost: builder.query<Post, string>({
      query: (id) => ({ url: `posts/${id}` })
    }),
    addPost: builder.mutation<Post, Pick<Post, 'id'>>({
      query: (post) => ({
        url: 'posts',
        method: 'POST',
        body: post
      }),
      /**
       * invalidatesTags cung cấp các tag để báo hiệu cho những method nào có providesTags
       * match với nó sẽ bị gọi lại
       * Trong trường hợp này getPosts sẽ chạy lại
       */
      invalidatesTags: (result, error, body) =>
        error ? [] : [{ type: 'Posts', id: 'LIST' }]
    }),
    updatePost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: `posts/${body.id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (result, error) =>
        error ? [] : [{ type: 'Posts', id: result?.id }]
    }),
    deletePost: builder.mutation<{}, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) =>
        error ? [] : [{ type: 'Posts', id }]
    })
  })
});

export const {
  useGetPostListQuery,
  useLazyGetPostListQuery,
  useLazyGetPostQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation
} = blogApi;
