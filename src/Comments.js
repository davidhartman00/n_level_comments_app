import React, { useReducer, useState, useCallback } from 'react'
import CommentComponent from './components/CommentComponent'

const CommentObj = function (id, hasParent = false, hasChildren = false, parentId = "", childrenIds = [], text = "", childComments = [] ){
	if (typeof text != "string" || text.length === 0) {
		console.error("Error creating CommentObj");
		throw Error
	}

	this.id = id;
	this.hasParent = hasParent;
	this.hasChildren = hasChildren;
	this.parentId = parentId;
	this.childrenIds = childrenIds;
	this.text = text;
	this.childComments = childComments;
}

const HandleDelete = (commentsObj, objId) => {
	const filteredObj = commentsObj.filter((ele) =>{
			if (ele.childComments.length > 0 ) {
				// *** example *** ele.childrenIds ==> [1,2,3]
				// *** example *** ele.childComments ==> [{},{},{}]
				ele.childComments = HandleDelete(ele.childComments, objId)
			}
			return ele.id !== objId;
	})
	return filteredObj;
}

const commentReducer = (state, action) => {
	const comments = [...state.comments];
	let counter = state.counter;
	switch (action.type) {
		case 'COMMENTS_LOADED':
			// Update the comments with the new payload
			return { "showComments": true, "showInput": [], "comments": state.comments, "counter": counter }
		case 'ADD_COMMENT':
			// Copy the current states' comments
			// Push the new comment from the payload
			comments.push(
				new CommentObj(
						counter + 1,
						false,
						false,
						0,
						[],
						action.payload
					)
				);
			// Return the updated state
			return { "showComments": true, "showInput": [], "comments": comments, "counter": ++counter }
		case 'REPLY_COMMENT_KEY':
			return { "showComments": true, "showInput": [action.payload, false], "comments": comments, "counter": counter }
		case 'REPLY_COMMENT':
			const parentComment = action.payload[1];
			parentComment.childComments =  Object.values(parentComment.childComments);
			const newReply =
					new CommentObj(
							counter + 1,
							true,
							false,
							parentComment.id,
							[],
							action.payload[0]
							)
			parentComment.hasChildren = true;
			if (!parentComment.childrenIds.includes(newReply.id)){
				parentComment.childrenIds.push(newReply.id);
				parentComment.childComments.push(newReply);
			}
			return { "showComments": true,  "showInput": [], "comments": comments, "counter": ++counter }
		case 'EDIT_COMMENT_KEY':
			return { "showComments": true, "showInput": [action.payload, true], "comments": comments, "counter": counter }
		case 'EDIT_COMMENT':
			const editComment = action.payload[1];
			editComment.text = action.payload[0];
			return { "showComments": true,  "showInput": [], "comments": comments, "counter": counter }
		case 'REMOVE_COMMENT':
			const commentsKept = HandleDelete(comments, action.payload)
			return { "showComments": true,  "showInput": [], "comments": commentsKept, "counter": counter }
		default:
			console.error(`did not find ${action.type}`);
			throw new Error();
	}
}

const Comments = ({ comments }) => {

	const [state, dispatch] = useReducer(commentReducer, { "showComments": false,  "showInput": [], "comments": comments, "counter": 2 })

	const handleCommentKeyUp = (ev) => {
		if(ev.code == "Enter"){
			if (ev.currentTarget.value == 0) return
			dispatch({type: "ADD_COMMENT", payload:ev.currentTarget.value})
			ev.currentTarget.value = ""
		}
	};

	const handleEditKeyUp = useCallback((commentItem) => { /* TODO: Combine handleEdit with handleReply into on function */
		return (ev) => {
			if(ev.code == "Enter"){
				if (ev.currentTarget.value == 0) return
				dispatch({type: "EDIT_COMMENT", payload:[ev.currentTarget.value,commentItem]})
			}
		}
	},[comments])

	const handleReplyKeyUp = useCallback((commentItem) => { /* TODO: Combine handleEdit with handleReply into on function */
		return (ev) => {
			if(ev.code == "Enter"){
				if (ev.currentTarget.value == 0) return
				dispatch({type: "REPLY_COMMENT", payload:[ev.currentTarget.value,commentItem]})
			}
		}
	},[comments])

	if (!state.showComments) {
		return (
			<div>
				<h1>Comments</h1>
				<div className="btn" onClick={() => dispatch({ type: "COMMENTS_LOADED" })}>Load comments</div>
			</div>
		)
	} else {

		return(<>
			
			<h1>Comments</h1>
			<div>
				{state.comments.map(commentItem => (
					<CommentComponent key={commentItem.id} commentItem={commentItem} dispatch={dispatch} showInput={state.showInput} handleReplyKeyUp={handleReplyKeyUp} handleEditKeyUp={handleEditKeyUp}></CommentComponent>
				))}
				
			</div>
			<div className="comment-new">
				<input className="comment-new-input" type="text" placeholder="Your comment" onKeyUp={handleCommentKeyUp} />
			</div>
		</>)
	}
}

export default Comments;
