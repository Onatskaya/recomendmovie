$(document).ready(function(){
	var  movieFeedback = {

		submitForm: $("#movie-feedback-form"),
		apiHost: "https://api.parse.com/1/",
		apiAppId: '8V1SzXwjmJC1BHXqlYXVuD1pPn0Di4FdxGEUY1N7',
        apiJSId: 'Xq9y1XH9TEWai2mC7XwRQdlVdWPILnTXnINwbEBa',
		init: function(){
			console.log("Movies feedback page initialization started...");
			movieFeedback.bindEventHandlers();
		},
		bindEventHandlers: function(){
			$("#submitForm").click(function(event){

				event.preventDefault();
				console.log("Form submiting is started");
				var formData = {
                    title: $("#filmName").val(),
                    genre: $("#genre").val(),
                    year: $("#year").val(),
                    description: $("#description").val(),
                    imgUrl: $("#picture").val(),
                    postAuthor: $("#userName").val()
                };
                console.log("Going to post following data", formData);

                $.ajax({
                	url: movieFeedback.apiHost + "/classes/Movie",
                	method: "POST",

                	headers: {
                		"X-Parse-Application-Id": movieFeedback.apiAppId,
                		"X-Parse-JavaScript-Key": movieFeedback.apiJSId
                	},
                	contentType: "application/json",
                	data: JSON.stringify(formData),
                	success: function(data, textStatus) {
                		console.debug("Successful feedback post request. Response is: ", data);
                		swal("Спасибо, Ваш отзыв успешно сохранен");
                        var recomTime = new Date();
                	},
                	error: function(response, status){
                		console.error("Error while feedback post. Response is: ", response );
                		swal("Упс! Произошла ошибка. Проверьте консоль.");
                	}
                });
            });
            $("#btn-load-data").click(function(event) {
            	console.info("Going to get some data from API server");
            	$.ajax({
            		url: movieFeedback.apiHost + "/classes/Movie",
                	method: "GET",

                	headers: {
                		"X-Parse-Application-Id": movieFeedback.apiAppId,
                		"X-Parse-JavaScript-Key": movieFeedback.apiJSId
                	},
                	success: function(data, textStatus) {
                		console.debug("Successful feedback post request. Response is: ", data);
                		var recomandation= data.results;
                		for (var i = 0; i < recomandation.length; i++) {
                			var movieTitle = $("<h3></h3>");
                            var movieGenre = $("<small> </small>");
                            var movieYear = $("<p></p>");
                            var movieDescription = $("<p></p>");
                            var moviePoster = $('<img src="" alt="Poster" class="poster">');
                            var movieRecomendator = $("<p></p>");
                            var recomendationTime = $("<p></p>");
                			
                            $(".movie-rec .panel-body").append(moviePoster);
                            moviePoster.attr("src", recomandation[i].imgUrl);
                			$(".movie-rec .panel-body").append(movieTitle);
                            movieTitle.html(recomandation[i].title);
                            movieTitle.append(movieGenre);
                            movieGenre.html(" (" + recomandation[i].genre + ")");
                            $(".movie-rec .panel-body").append(movieYear);
                            movieYear.html("Год выпуска: " + recomandation[i].year);
                            $(".movie-rec .panel-body").append(movieDescription);
                            movieDescription.html(recomandation[i].description);
                            $(".movie-rec .panel-body").append(movieRecomendator);
                            movieRecomendator.html("Автор рекомендации: " + recomandation[i].postAuthor);
                            $(".movie-rec .panel-body").append(recomendationTime);
                            recomendationTime.html("Рекомендация оставлена: " + recomandation[i].recomTime);


                		}
                	},
                	error: function(response, status){
                		console.error("Error while feedback post. Response is: ", response );
                	}
            	})
            });
		}
    }
	movieFeedback.init();
});





/*Baas
parse.com*/