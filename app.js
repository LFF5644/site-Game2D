const path="/p/Game2D/";
const playerSize_height=16*4;
const playerSize_width=23*4;

const {
	defer_end,		// resume screen updating write: storage => frame => screen
	defer,			// pause screen update write: changes => frame => storage
	hook_effect,	// event listener on change state.varname run function(state.varname)
	hook_model,		// create model: a model of a player or something
	init,			// init framework // without this the frame work do nothing
	node_dom,		// create component: "h1" "p" "input" etc
}=window.lui;

const model={
	init:()=>({
		player:{
			pos_x: Math.round(getWidth()/2-playerSize_width/2),
			pos_y: Math.round(getHeight()/2-playerSize_height/2),
			size_height: playerSize_height,
			size_width: playerSize_width,
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

function getWidth(){
	return Math.max(
		document.body.scrollWidth,
		document.documentElement.scrollWidth,
		document.body.offsetWidth,
		document.documentElement.offsetWidth,
		document.documentElement.clientWidth
	);
}
function getHeight(){
	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.documentElement.clientHeight
	);
}

function playerPos(state,{x=null,y=null,change=true}){
	if(!state||typeof(state)!=="object") throw new Error("STATE IS NOT AN OBJECT");
	const game_height=state.game.height;
	const game_width=state.game.width;
	const player_height=state.player.size_height;
	const player_width=state.player.size_width;
	const playerPosition_x=x===null?state.player.pos_x:x;
	const playerPosition_y=y===null?state.player.pos_y:y;
	defer(); // do not write frame on change state

	if(playerPosition_y>game_height-player_height) actions.setKey("player","pos_y",game_height-player_height); // y > game
	else if(playerPosition_y<0) actions.setKey("player","pos_y",0); // y > 0
	else if(change) actions.setKey("player","pos_y",playerPosition_y);

	if(playerPosition_x>game_width-player_width) actions.setKey("player","pos_x",game_width-player_width); // x > game
	else if(playerPosition_x<0) actions.setKey("player","pos_x",0); // x < 0
	else if(change) actions.setKey("player","pos_x",playerPosition_x);

	defer_end(); // write all changes to new frame
}
function playerWalk(state,walkTo){
	if(!state||typeof(state)!=="object") throw new Error("STATE IS NOT AN OBJECT");

	const playerPosition_x=state.player.pos_x;
	const playerPosition_y=state.player.pos_y;
	const playerStep=state.player.step;

	if(walkTo==="down") playerPos(state,{y: playerPosition_y+playerStep});
	else if(walkTo==="left") playerPos(state,{x: playerPosition_x-playerStep});
	else if(walkTo==="right") playerPos(state,{x: playerPosition_x+playerStep});
	else if(walkTo==="up") playerPos(state,{y: playerPosition_y-playerStep});
}
function resize(state){
	console.log("resize");
	const playerPosition_x=state.player.pos_x;
	const playerPosition_y=state.player.pos_y;

	defer();
	actions.setKey("player","pos_x",0);
	actions.setKey("player","pos_y",0);
	actions.setKey("game","height",0);
	actions.setKey("game","width",0);
	defer_end();

	defer();
	actions.setKey("game","height",getHeight());
	actions.setKey("game","width",getWidth());
	defer_end();

	playerPos(state,{
		x: playerPosition_x,
		y: playerPosition_y,
	});
}

init(()=>{
	const [state,actions]=hook_model(model);

	document.title=`x:${state.player.pos_x} y:${state.player.pos_y} - Frame Update`;
	setTimeout(()=> document.title=`x:${state.player.pos_x} y:${state.player.pos_y}`,100);

	hook_effect(()=>{
		window.actions=actions;
	});

	return[{
		onkeydown: event=>{
			const char=event.key;

			if(char.startsWith("Arrow")){
				const walkTo=char.substring("Arrow".length).toLowerCase();
				playerWalk(state,walkTo);
			}
		},
		onresize: ()=> resize(state),
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
