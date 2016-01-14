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
                if(movieFeedback.validateForm() == true) {
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
                    	},
                    	error: function(response, status){
                    		console.error("Error while feedback post. Response is: ", response );
                    		swal("Упс! Произошла ошибка. Проверьте консоль.");
                    	}
                    });
                } else {
                    swal("Форма не валидна");
                }
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

                        $(".friendsRecomendations").html("");

                		var recomandation= data.results;


/*Использование библиотеки underscore.js*/

                        var recTemplate = _.template(
                            '<div class="panel panel-default movie-rec  rec-wrapper"">' +
                            '<div class="panel-body" data-year="<%= rec.year %>">' +
                            '<img src="<%= rec.imgUrl %>" alt="Poster" class="poster">' +
                            '<h3><%= rec.title %><small> <%= rec.genre %></small></h3>' +
                            '<p class="recYear">Год выпуска: <%= rec.year %></p>' +
                            '<p><%= rec.description %></p>' +
                            '<p>Автор рекомендации: <%= rec.autor %></p>' +
                            '<p>Рекомендация оставлена: <%= moment(rec.createdAt).format("LL") %></p>' +
                            '</div>'
                            );

                		for (var i = 0; i < recomandation.length; i++) {

                            var recElement = recTemplate({ rec: recomandation[i]});

                            $(".friendsRecomendations").append(recElement);
                            $(".rec-wrapper").show("slow");



                			/*var movieTitle = $("<h3></h3>");
                            var movieGenre = $("<small> </small>");
                            var movieYear = $("<p class='recYear'></p>");
                            var movieDescription = $("<p></p>");
                            var moviePoster = $('<img src="" alt="Poster" class="poster">');
                            var movieRecomendator = $("<p></p>");
                            var recomendationTime = $("<p></p>");
                            var recomendationCreationTime = recomandation[i].createdAt;
                			
                            $(".friendsRecomendations").append('<div class="panel panel-default movie-rec  rec-wrapper"></div>');
                            $(".movie-rec:last-child").append('<div class="panel-body"></div>');



                            moviePoster.attr("src", recomandation[i].imgUrl);
                            movieTitle.html(recomandation[i].title + " (" + recomandation[i].genre + ")");
                            //movieGenre.html(" (" + recomandation[i].genre + ")");
                            movieYear.html("Год выпуска: " + recomandation[i].year);
                            $(".movie-rec:last-child .panel-body").attr("data-year", recomandation[i].year);
                            movieDescription.html(recomandation[i].description);
                            movieRecomendator.html("Автор рекомендации: " + recomandation[i].postAuthor);
                            recomendationTime.html("Рекомендация оставлена: " + moment(recomendationCreationTime).format("LL"));

                            $(".movie-rec:last-child > .panel-body").append(moviePoster, movieTitle, movieGenre, movieYear, movieDescription, movieRecomendator, recomendationTime);
                            $(".rec-wrapper").show("slow");*/
                		};
                        //return recomandation;
                	},
                	error: function(response, status){
                		console.error("Error while getting feedback list. Response is: ", response );
                	}
            	})
            });
            $(".asc").click(function() {
            	console.log("Sorting movies by year starting");
                var wrapper = $('.friendsRecomendations .movie-rec');
                //wrapper.html("");
                wrapper.find('.panel-body').sort(function(a, b) {
                     return +a.dataset.year - +b.dataset.year;
                })
                .appendTo(wrapper);


                /*var recomendationsArray = []
                recomendationsArray.push($(".movie-rec .panel-body"));
                console.log(recomendationsArray);
*/
                /*for (var i = 0; i<recomendationsArray.length; i++) {
                    var yearArray = [];
                    yearArray.push($(".recYear"));
                    console.log(yearArray);
                    yearArray.sort(function(a, b){
                    return a-b;
                });
                }*/


                /*var yearObj = {};
                $.extend(yearObj, $(".movie-rec .panel-body"));
                console.log(yearObj);*/

                /*yearArray.sort(function(a, b){
                    return a-b;
                });
                $("#sortByYear").removeClass(".asc").addClass("desc");*/
            });
            /*$(".desc").click(function() {
                console.log("Sorting movies by year starting");
                var yearArray;
                yearArray.sort(function(a, b){
                    return b-a;
                });
                $("#sortByYear").removeClass(".desc").addClass("asc");
            });


            $(".dateAsc").click(function() {
                console.log("Sorting movies by creation time starting");
                var yearArray;
                yearArray.sort(function(a, b){
                    return a-b;
                });
                $("#sortByTime").removeClass(".dateAsc").addClass("dateDesc");
            });
            $(".dateDesc").click(function() {
                console.log("Sorting movies by creation time starting");
                var yearArray;
                yearArray.sort(function(a, b){
                    return b-a;
                });
                $("#sortByTime").removeClass(".dateDesc").addClass("dateAsc");
            });*/
		},
        validateForm: function(){
            console.log("Performing validation");

            var titleValidation, genreValidation, yearValidation, urlValidation, autorValidation;
            var titleInput = $("#filmName");
            var genreInput = $("#genre");
            var yearInput =  $("#year");
            var urlInput = $("#picture");
            var autorInput = $("#userName");

            var title = titleInput.val();
            var genre = genreInput.val();
            var year = yearInput.val();
            var imgUrl = urlInput.val();
            var autor = autorInput.val();



            if (title.length > 2) {
                titleInput.parent().addClass("has-success").removeClass("has-error");
                titleInput.parent().find(".help-block").hide();
                titleValidation = true;
            } else {
                titleInput.parent().addClass("has-error").removeClass("has-success");
                titleInput.parent().find(".help-block").show();
                titleValidation = false;
            }  
            if (genre.length > 2) {
                genreInput.parent().addClass("has-success").removeClass("has-error");
                genreInput.parent().find(".help-block").hide();
                genreValidation = true;
            } else {
                genreInput.parent().addClass("has-error").removeClass("has-success");
                genreInput.parent().find(".help-block").show();
                genreValidation = false;
            }

            year = parseInt(year, 10);

            if (Number.isInteger(year)) {

                if (year > 1900 && year <= moment().year()){
                yearInput.parent().addClass("has-success").removeClass("has-error");
                yearInput.parent().find(".help-block").hide();
                yearValidation = true;
                } else {
                    yearInput.parent().addClass("has-error").removeClass("has-success");
                    yearInput.parent().find(".help-block").show();
                    yearValidation = false;
                }
            } else {
                yearInput.parent().addClass("has-error").removeClass("has-success");
                yearInput.parent().find(".help-block").show();
                yearValidation = false;
            }

            if (imgUrl.substr(0, 8) == "https://" || imgUrl.substr(0, 7) == "http://") {
                urlInput.parent().addClass("has-success").removeClass("has-error");
                urlInput.parent().find(".help-block").hide();
                urlValidation = true;
            } else {
                urlInput.parent().addClass("has-error").removeClass("has-success");
                urlInput.parent().find(".help-block").show();
                urlValidation = false;
            }
            if (autor.length > 2) {
                autorInput.parent().addClass("has-success").removeClass("has-error");
                autorInput.parent().find(".help-block").hide();
                autorValidation = true;
            } else {
                autorInput.parent().addClass("has-error").removeClass("has-success");
                autorInput.parent().find(".help-block").show();
                autorValidation = false;
            }
            if (titleValidation && genreValidation && yearValidation && urlValidation && autorValidation){
                return true;
            } else {
                return false;
            }
        }
    }
	movieFeedback.init();
});





/*Baas
parse.com*/