import React, { useReducer, useState, useCallback } from 'react'
import CommentComponent from './components/CommentComponent'
import SingleComment from './components/SingleComment'

const CommentObj = function (id, hasParent = false, hasChildren = false, parentId = "", childrenIds = [], text = "", childComments = [] ){
	// for (var i = 0, j = arguments.length; i < j; i++){
	//		console.log("ARGUMENTS CommentObj", arguments[i]);
	// }
	if (typeof text != "string" || text.length === 0) {
		console.error("Error creating CommentObj");
		throw Error
	}
	// TODO: Other Error checks here
	this.id = id;
	this.hasParent = hasParent;
	this.hasChildren = hasChildren;
	this.parentId = parentId;
	this.childrenIds = childrenIds;
	this.text = text;
	this.childComments = childComments;
}

const HandleDelete = function(commentObj, objId) {
	console.log("OBJID", objId);
	const filteredObj = commentObj.filter((ele) =>{
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
		// case 'REPLY_COMMENT_OLD':
		// 	// >>>> TODO: This code works for app that does not pull text from input box
		// 	const parentObj = action.payload
		// 	const newReplyText =
		// 		new CommentObj(
		// 				counter + 1,
		// 				true,
		// 				false,
		// 				parentObj.id,
		// 				[],
		// 				"This is a string"
		// 				)
		// 			// TODO: add input for edits and comments
		// 		parentObj.hasChildren = true;
		// 		parentObj.childComments.push(newReplyText)
		// 	// >>>> TODO: Temp Test COde END
		// 	return { "showComments": true, "showInput": [action.payload], "comments": comments, "counter": ++counter }
		case 'REPLY_COMMENT_KEY':
			return { "showComments": true, "showInput": [action.payload, false], "comments": comments, "counter": counter }
		case 'REPLY_COMMENT':
			// const parentComment = action.payload;
			const parentComment = action.payload[1];
			parentComment.childComments =  Object.values(parentComment.childComments); /* test this line */
			// console.log( "REPLY_COMMENT - type of",typeof parentComment);
			// console.log( "REPLY_COMMENT - the object", parentComment);
// >>>
			const newReply =
					new CommentObj(
							counter + 1,
							true,
							false,
							parentComment.id,
							[],
							action.payload[0]
							)
							// TODO: add input for edits and comments
			parentComment.hasChildren = true;
			if (!parentComment.childrenIds.includes(newReply.id)){
				parentComment.childrenIds.push(newReply.id);
				// console.log("parentComment - parent", typeof parentComment);
				// console.log("parentComment - parent.childComments", typeof parentComment.childComments);
				// console.log("parentComment - TRUE parent.childComments", parentComment.childComments);
				parentComment.childComments.push(newReply); /* TODO: Things seam to fail here on this line. I can fon figure why */
			}
			return { "showComments": true,  "showInput": [], "comments": comments, "counter": ++counter }
		case 'EDIT_COMMENT_KEY':
			// const commentsWithoutDeleted = state.comments.filter(comment => comment.id != action.payload);
			// // Return updated state
			return { "showComments": true, "showInput": [action.payload, true], "comments": comments, "counter": counter }
		case 'EDIT_COMMENT':
			console.log("EDIT KEY CLICKED");
			// const commentsWithoutDeleted = state.comments.filter(comment => comment.id != action.payload);
			// // Return updated state
			return { "showComments": true,  "showInput": [], "comments": comments, "counter": counter }
		case 'REMOVE_COMMENT':
			// const commentsWithoutDeleted = state.comments.filter(comment => comment.id != action.payload);
			const commentsKept = HandleDelete(comments, action.payload)
			return { "showComments": true,  "showInput": [], "comments": commentsKept, "counter": counter }
		default:
			console.error(`did not find ${action.type}`);
			throw new Error();
	}
}

// >>>>>>>>>>>>>>
// const childrenOfComment = function (parentComment, comments){
// 	// return array of objs of the children comments
// 	// to be used when we know there are children comments
// 	console.log("INSIDE childrenOfComment", parentComment, comments);
// 	if (parentComment.childrenIds.length == 0) {throw Error}

// 	const childrenArray= []
// 	parentComment.childrenIds.forEach(idx => {
// 		console.log("START childrenArray", childrenArray);
// 		childrenArray.push(comments[idx-1])
// 		console.log("2ND childrenArray", childrenArray);

// 	});
// 	return childrenArray
// }
// >>>>>>>>>>>>>>

const Comments = ({ comments }) => {

	const [state, dispatch] = useReducer(commentReducer, { "showComments": false,  "showInput": [], "comments": comments, "counter": 2 })

	const handleCommentKeyUp = (ev) => {
		// Press enter key
		if(ev.code == "Enter"){
			if (ev.currentTarget.value == 0) return
			dispatch({type: "ADD_COMMENT", payload:ev.currentTarget.value})
			ev.currentTarget.value = ""
		}
	};

	const handleEditKeyUp = (ev) => { /*TODO: This code works only when we are not returning the text from the input box */
		// Press enter key
		// if(ev.code == "Enter"){
		// 	dispatch({type: "REPLY_COMMENT", payload:ev.currentTarget.value})
		// 	ev.currentTarget.value = ""
		// }
	};

	const handleReplyKeyUp = useCallback((commentItem) => { /* TODO: This is for if we can get the input text back to the state with the object using a callBack function */
		return (ev) => {
			if(ev.code == "Enter"){
				if (ev.currentTarget.value == 0) return
				dispatch({type: "REPLY_COMMENT", payload:[ev.currentTarget.value,commentItem]})
			}
		}
	},[comments])

	// >>>>>> TODO: This code may be junk code. Delete if we don't use it.
	// const collectChildren = (comments)=> {comments.map( (commentItem, idx, comments) => {
	// 		if (commentItem.hasChildren){
	// 			let theChildren = childrenOfComment(commentItem, comments)
	// 			console.log("The Children", theChildren)
	// 			}
	// 		}
	// )}
	// let something = collectChildren(state.comments);
	// console.log("SOMETHING", something);

	// >>>>>>
	if (!state.showComments) {
		return (
			<div>
				<h1>Comments</h1>
				<div className="btn" onClick={() => dispatch({ type: "COMMENTS_LOADED" })}>Load comments</div>
			</div>
		)
	} else {

		// const displayArray = [];???
		// state.comments.forEach(displayItem => {
		// 	if (!displayItem.hasChildren) {
				
		// 	}

		// }
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


// *** Have an Array with all data
// *** some have no parent & no children - these we print
// *** some have children - these we combine and then print
// *** some have siblings - ?? what do we need to do with these ??

// Structure ___________________
//			|	box				| 
//			|___________ 		|
//			|	within	|		| 
//			|___________|	box	|

export default Comments;
