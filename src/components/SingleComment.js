// import React, { useReducer } from 'react'
// import Comments from '../Comments';
import CommentComponent from './CommentComponent'


const SingleComment = ({commentItem, dispatch}) => {
	return(
		<CommentComponent key={commentItem.id} commentItem={commentItem} dispatch={dispatch}></CommentComponent>
		)

}

export default SingleComment;