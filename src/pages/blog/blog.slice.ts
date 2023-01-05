import initialPostList from 'constants/blog';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';

type PostState = {
  postList: Post[];
  currentPost: Post | null;
};

const initialState: PostState = {
  postList: initialPostList,
  currentPost: null
};

const blogSlice = createSlice({
  name: 'blog',
  initialState: initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.postList.push(action.payload);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const postIndex = state.postList.findIndex(
        (post) => post.id === action.payload
      );
      if (postIndex !== -1) {
        state.postList.splice(postIndex, 1);
      }
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      state.postList.map((post, index) => {
        if (post.id === action.payload.id) {
          state.postList[index] = action.payload;
        }
        return post;
      });
      state.currentPost = null;
    },
    editPost: (state, action: PayloadAction<Post>) => {
      if (action.payload !== null) {
        state.currentPost = action.payload;
      }
    }
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        (action) => action.type.includes('edit'),
        (state, action) => {
          console.log('state', current(state));
        }
      )
      .addDefaultCase((state, action) => {
        console.log('state, action', current(state), action);
      });
  }
});

const blogReducer = blogSlice.reducer;
export const { addPost, deletePost, editPost, updatePost } = blogSlice.actions;

export default blogReducer;
