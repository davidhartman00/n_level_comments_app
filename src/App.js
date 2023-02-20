import './App.css';
import Comments from './Comments';

function App() {

	const initialComments = [
			{
				id: 1,
				hasParent: false,
				hasChildren: false,
				parentId:0,
				childrenIds: [],
				text: "Opportunities don't happen, you create them.",
				childComments:[]
			},{
				id: 2,
				hasParent: false,
				hasChildren: false,
				parentId:0,
				childrenIds: [],
				text: "Just one small positive thought in the morning can change your whole day.",
				childComments:[]
			}
		]

	return (
		<Comments comments={initialComments} />
	);
}

export default App;
