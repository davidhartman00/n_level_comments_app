//  TODO: clean up**
// import React, { useReducer } from 'react'
import Comments from './../Comments';



const CommentComponent = ({commentItem, dispatch, showInput, handleReplyKeyUp, handleEditKeyUp}) => {
	const showInputBox = (showInput.length > 0 && showInput[0].id === commentItem.id)
	// console.log("showInputBox YO LOOK HERE", showInput);
	return(
		<div key={commentItem.id} className="comment">
			<div className="comment-text">{commentItem.text}</div>
			<div>
				<div className="comment-action-btn" onClick={() => dispatch({ type: "REPLY_COMMENT_KEY", payload: commentItem})}>Reply</div>
				<div className="comment-action-btn" data-edit={true} onClick={() => dispatch({ type: "EDIT_COMMENT_KEY", payload: commentItem})}>Edit</div>
				<div className="comment-action-btn" onClick={() => dispatch({ type: "REMOVE_COMMENT", payload: commentItem.id})}>Delete</div>
			</div>
			{ showInputBox && 
				<div className="comment-new">
					<input className="comment-new-input" type="text" placeholder="Enter Your Reply" onKeyUp={handleReplyKeyUp(commentItem)}/>
					<input className="comment-new-input" type="text" placeholder={commentItem.text} onKeyUp={handleEditKeyUp(commentItem)}/>
				</div>
			}
			{commentItem.hasChildren &&
				commentItem.childComments.map(childCommentItem => (
					<div className="comment-child">
						<CommentComponent key={childCommentItem.id} commentItem={childCommentItem} dispatch={dispatch} showInput={showInput} handleReplyKeyUp={handleReplyKeyUp} handleEditKeyUp={handleEditKeyUp}></CommentComponent>
					</div>)
				)
			}
		</div>
	)
}


export default CommentComponent;