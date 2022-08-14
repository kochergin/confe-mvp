function timeToHHMM( time ) {
	return ('00'+Math.floor(time/3600)).slice(-2)+':'+('00'+Math.floor((time%3600)/60)).slice(-2);
}