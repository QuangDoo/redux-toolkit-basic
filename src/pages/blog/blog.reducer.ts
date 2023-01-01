import { createAction, createReducer } from '@reduxjs/toolkit';
import initialPostList from 'constants/blog';

type PostState = {
  postList: Post[];
};

const initialState: PostState = {
  postList: initialPostList
};

export const addPost = createAction<Post>('blog/addPost');

const blogReducer = createReducer(initialState, (builder) => {
  builder.addCase(addPost, (state, action) => {
    state.postList.push(action.payload);
  });
});

export default blogReducer;
