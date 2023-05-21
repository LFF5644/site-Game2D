const {
	hook_model,
	init,
	node_dom,
}=window.lui;

const model={
	init:()=>({
		// put some variables here!
	}),
	set: (state,key,value)=>({
		...state,
		[key]: value,
	}),
};

init(()=>{
	const [state,actions]=hook_model(model);
	return[null,[
		node_dom("h1[innerText=Template]"),
		node_dom("p",null,[
			node_dom("button[innerText=Go Back]",{
				onclick:()=> history.back(),
			}),
		]),
	]];
});
