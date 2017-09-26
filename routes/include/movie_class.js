var moviefolder = "http://localhost:3000/movies/";

class Movie{

	constructor(){
		this.movie_name = "Unnamed";
		this.released = 0;
		this.url = "";
		this.views = 0;
		this.description = "No description.";
		this.date_added = Date.now();
		this.movie_id = 0;
		this.update = false;
		this.categories = [];
	}

	getUrl(){
		return moviefolder+this.url;
	}



}

module.exports = Movie;