
const CommentComponent = ({commentItem, dispatch, showInput, handleReplyKeyUp, handleEditKeyUp}) => {
	const showInputBox = (showInput.length > 0 && showInput[0].id === commentItem.id)
	const showEditInput = (showInput[1])

	return(
		<div key={commentItem.id} className="comment">
			<div className="comment-user"> User {commentItem.id}</div>
			<div className="comment-text">{commentItem.text}</div>
			<div>
				<div className="comment-action-btn" onClick={() => dispatch({ type: "REPLY_COMMENT_KEY", payload: commentItem})}>Reply</div>

				{commentItem.id !== 1 &&
					<>
						<div className="comment-action-btn" onClick={() => dispatch({ type: "EDIT_COMMENT_KEY", payload: commentItem})}>Edit</div>
						<div className="comment-action-btn" onClick={() => dispatch({ type: "REMOVE_COMMENT", payload: commentItem.id})}>Delete</div>
					</>
				}
			</div>
			{ showInputBox && 
				<div className="comment-new">
					{showEditInput ? 
						<input className="comment-input" type="text" defaultValue={commentItem.text} onKeyUp={handleEditKeyUp(commentItem)}/>
						:
						<input className="comment-input" type="text" placeholder="Enter Your Reply" onKeyUp={handleReplyKeyUp(commentItem)}/>
					}
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