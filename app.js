const path="/p/Game2D/";

const {
	hook_model,
	init,
	node_dom,
}=window.lui;

const model={
	init:()=>({
		player:{
			pos_x: 0,
			pos_y: 0,
			size_height: 16*4,
			size_width: 23*4,
			step: 30,
		},
		game:{
			height: 300,
			width: 300,
		},
	}),
	set: (state,key,value)=>({
		...state,
		[key]: value,
	}),
	setKey: (state,key,keySet,value)=>({
		...state,
		[key]:{
			...state[key],
			[keySet]: value,
		},
	}),
};

function getWidth() {
	return Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.documentElement.clientWidth
	);
}
function getHeight() {
	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.documentElement.clientHeight
	);
}

init(()=>{
	const [state,actions]=hook_model(model);

	document.title=`x:${state.player.pos_x} y:${state.player.pos_y}`;

	return[{
		onkeydown: event=>{
			const char=event.key;

			const game_height=state.game.height;
			const game_width=state.game.width;
			const player_height=state.player.size_height;
			const player_width=state.player.size_width;
			const playerPosition_x=state.player.pos_x;
			const playerPosition_y=state.player.pos_y;
			const playerStep=state.player.step;

			if(char==="ArrowDown"){
				if(playerPosition_y+playerStep>game_height-player_height) actions.setKey("player","pos_y",game_height-player_height);
				else actions.setKey("player","pos_y",playerPosition_y+playerStep);
			}
			else if(char==="ArrowLeft"){
				if(playerPosition_x-playerStep<0) actions.setKey("player","pos_x",0);
				else actions.setKey("player","pos_x",playerPosition_x-playerStep);
			}
			else if(char==="ArrowRight"){
				if(playerPosition_x+playerStep>game_width-player_width) actions.setKey("player","pos_x",game_width-player_width);
				else actions.setKey("player","pos_x",playerPosition_x+playerStep);
			}
			else if(char==="ArrowUp"){
				if(playerPosition_y-playerStep<0) actions.setKey("player","pos_y",0);
				else actions.setKey("player","pos_y",playerPosition_y-playerStep);
			}
		},
		onresize:()=>{
			actions.setKey("game","height",getHeight());
			actions.setKey("game","width",getWidth());
		},
		onload:()=>{
			actions.setKey("game","height",getHeight());
			actions.setKey("game","width",getWidth());
		},
	},[
		node_dom("div[className=game]",{
			S:{
				height: state.game.height+"px",
				width: state.game.width+"px",
			},
		},[
			node_dom("img[src="+path+"/player.png][className=player]",{
				height: state.player.size_height,
				width: state.player.size_width,
				S:{
					left: state.player.pos_x+"px",
					top: state.player.pos_y+"px",
				},
			}),
		]),
	]];
});
