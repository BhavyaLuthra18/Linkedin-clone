import { SET_LOADING_STATUS ,GET_ARTICLES,LIKE_POST,COMMENT_POST} from "../actions/actionType";

export const inistate = {
    loading:false,
    articles:[],
 
};


const articleReducer = (state = inistate, action) =>{
    switch(action.type){
        case SET_LOADING_STATUS:
            return{
                ...state,
                loading:action.status,
            }
            case GET_ARTICLES : 
            return {
                ...state,
                articles:action.payload,
            }
            case LIKE_POST:
                return {
                  ...state,
                  posts: state.posts.map((post) =>
                    post.postID === action.payload.postId
                      ? {
                          ...post,
                          post: {
                            ...post.post,
                            likes: post.post.likes.some(
                              (like) => like.email === action.payload.user.email
                            )
                              ? post.post.likes.filter(
                                  (like) => like.email !== action.payload.user.email
                                )
                              : [
                                  ...post.post.likes,
                                  {
                                    name: action.payload.user.displayName,
                                    email: action.payload.user.email,
                                    photo: action.payload.user.photoURL,
                                  },
                                ],
                          },
                        }
                      : post
                  ),
                };
              case COMMENT_POST:
                return {
                  ...state,
                  posts: state.posts.map((post) =>
                    post.postID === action.payload.postId
                      ? {
                          ...post,
                          post: {
                            ...post.post,
                            comments: [...post.post.comments, action.payload.comment],
                          },
                        }
                      : post
                  ),
                };
                case 'GET_POSTS':
                    return {
                      ...state,
                      loading: false,
                      posts: action.payload,
                    };
         
         
         
         
        default:
            return state;
    }
}

export  default articleReducer;