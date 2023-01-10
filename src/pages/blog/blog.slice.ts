import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { http } from 'utils';

type PostState = {
  postList: Post[];
  currentPost: Post | null;
  loading: boolean;
  currentRequestId: string | undefined;
  postId: string | undefined;
};

const initialState: PostState = {
  postList: [],
  currentPost: null,
  loading: false,
  currentRequestId: undefined,
  postId: undefined
};

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

export const getPostList = createAsyncThunk(
  'blog/getPostList',
  async (_, thunkApi) => {
    const response = await http.get('posts', {
      signal: thunkApi.signal
    });

    return response.data;
  }
);

export const addPost = createAsyncThunk(
  'blog/addPost',
  async (post: Post, thunkApi) => {
    const response = await http.post('posts', post, {
      signal: thunkApi.signal
    });

    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (postId: string, thunkApi) => {
    const response = await http.delete(`posts/${postId}`, {
      signal: thunkApi.signal
    });

    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, post }: { postId: string; post: Post }, thunkApi) => {
    try {
      const response = await http.put(`posts/${postId}`, post, {
        signal: thunkApi.signal
      });

      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState: initialState,
  // use reducer when create action
  // example: addPost
  reducers: {
    editPost: (state, action: PayloadAction<Post>) => {
      if (action.payload !== null) {
        state.currentPost = action.payload;
      }
    },
    startEditPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    },
    cancelUpdatePost: (state) => {
      state.postId = undefined;
    }
  },
  // use extraReducers when dont want to create any action
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postIdAction = action.meta.arg;

        const numberIndex = state.postList.findIndex(
          (post) => post.id === postIdAction
        );
        if (numberIndex !== -1) {
          state.postList.splice(numberIndex, 1);
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const postIdAction = action.meta.arg.postId;
        state.postList.map((post, index) => {
          if (post.id === postIdAction) {
            state.postList[index] = action.payload;
          }

          return post;
        });
      })
      // addMatcher will run when 1st argument return true
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) =>
          action.type.endsWith('/rejected') ||
          action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      )

      .addDefaultCase((state, action) => {});
  }
});

const blogReducer = blogSlice.reducer;
export const { editPost, startEditPost, cancelUpdatePost } = blogSlice.actions;

export default blogReducer;
