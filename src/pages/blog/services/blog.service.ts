import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// create api
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (builder) => ({
    getPostList: builder.query<Post[], void>({ query: () => `posts` })
  })
});

export const { useGetPostListQuery } = blogApi;
