import { createAction, createReducer } from '@reduxjs/toolkit';
import initialPostList from 'constants/blog';

type PostState = {
  postList: Post[];
};

const initialState: PostState = {
  postList: initialPostList
};

export const addPost = createAction<Post>('blog/addPost');
export const deletePost = createAction<string>('blog/deletePost');

const blogReducer = createReducer(initialState, (builder) => {
  builder.addCase(addPost, (state, action) => {
    state.postList.push(action.payload);
  });
  builder.addCase(deletePost, (state, action) => {
    const postIndex = state.postList.findIndex(
      (post) => post.id === action.payload
    );
    if (postIndex !== -1) {
      state.postList.splice(postIndex, 1);
    }
  });
});

export default blogReducer;
