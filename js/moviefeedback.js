$(document).ready(function(){
	var  movieFeedback = {

		submitForm: $("#movie-feedback-form"),
		apiHost: "https://api.parse.com/1/",
		apiAppId: '8V1SzXwjmJC1BHXqlYXVuD1pPn0Di4FdxGEUY1N7',
        apiJSId: 'Xq9y1XH9TEWai2mC7XwRQdlVdWPILnTXnINwbEBa',
        serverData: [],
        settings: {
            autoUpdateInterval: 5000,
            autoUpdateEnabled: false
        },
        dataOnScreen: function(serverData){
            $(".friendsRecomendations").html("");

            /*Использование библиотеки underscore.js*/

            var recTemplate = _.template(
                '<div class="panel panel-default movie-rec  rec-wrapper">' +
                '<div class="panel-body" data-year="<%= rec.year %>">' +
                '<img src="<%= rec.imgUrl %>" alt="Poster" class="poster">' +
                '<h3><%= rec.title %><small> <%= rec.genre %></small></h3>' +
                '<p class="recYear">Год выпуска: <%= rec.year %></p>' +
                '<p><%= rec.description %></p>' +
                '<p>Автор рекомендации: <%= rec.autor %></p>' +
                '<p>Рекомендация оставлена: <%= moment(rec.createdAt).format("LL") %></p>' +
                '</div>'
                );

            for (var i = movieFeedback.serverData.results.length-1; i >= 0; i--) {

                var recElement = recTemplate({ rec: movieFeedback.serverData.results[i]});

                $(".friendsRecomendations").append(recElement);
                $(".rec-wrapper").show("slow");
            }
        },
        switchAutoApdate: function(){
            if(movieFeedback.settings.autoUpdateEnabled) {
                console.debug("Auto update is enabled. We are going to switch it off.");
                clearInterval(movieFeedback.settings.intervalId);
                movieFeedback.settings.autoUpdateEnabled = false;
            } else {
                console.debug("Auto update is disabled. We are going to switch it on with interval: " + movieFeedback.settings.autoUpdateInterval);
                movieFeedback.settings.intervalId =  setInterval(function(){
                    movieFeedback.getRecomendations(
                        function(data){
                            movieFeedback.dataOnScreen(data.results);
                        })
                    }, movieFeedback.settings.autoUpdateInterval);
                movieFeedback.settings.autoUpdateEnabled = true;
            }
        },
        getRecomendations: function(successCallback, errorCallback){
            $.ajax({
                url: movieFeedback.apiHost + "/classes/Movie",
                method: "GET",

                headers: {
                    "X-Parse-Application-Id": movieFeedback.apiAppId,
                    "X-Parse-JavaScript-Key": movieFeedback.apiJSId
                },
                success: function(data){
                    movieFeedback.serverData = data;
                    successCallback(data);
                } ,
                error: errorCallback
                
            })
        },
		init: function(){
			console.log("Movies feedback page initialization started...");
			movieFeedback.bindEventHandlers();
            console.log(movieFeedback.serverData);
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
                movieFeedback.getRecomendations(
                    function(data){

                        movieFeedback.dataOnScreen(data.results);
                    },
                    function(error){
                        console.error("Error while getting feedback list. Response is: ", response );
                    }
                );
            });


            $(".sortingButtons").on("click", ".asc", function() {
                console.log("Sorting movies by year starting");
                movieFeedback.serverData.results.sort(function(a, b) {
                    console.log(movieFeedback.serverData.results);
                    $("#sortByYear").removeClass("asc").addClass("desc");
                     return +a.year - +b.year;
                     
                })
                $(".friendsRecomendations").html("");
                $(".friendsRecomendations").html(movieFeedback.dataOnScreen(movieFeedback.serverData.results));
                
            });
            $(".sortingButtons").on("click", ".desc", function() {
                console.log("Sorting movies by year starting");
                movieFeedback.serverData.results.sort(function(a, b) {
                    console.log(movieFeedback.serverData.results);
                    $("#sortByYear").removeClass("desc").addClass("asc");
                     return +b.year - +a.year;
                     
                })
                $(".friendsRecomendations").html("");
                $(".friendsRecomendations").html(movieFeedback.dataOnScreen(movieFeedback.serverData.results));
                
            });



            $(".sortingButtons").on("click", ".dateAsc", function() {
                console.log("Asc sorting movies by creation date starting");
                movieFeedback.serverData.results.sort(function(a, b) {
                    console.log(movieFeedback.serverData.results);
                    $("#sortByTime").removeClass("dateAsc").addClass("dateDesc");
                     return new Date(a.createdAt) - new Date(b.createdAt);
                     
                })
                $(".friendsRecomendations").html("");
                $(".friendsRecomendations").html(movieFeedback.dataOnScreen(movieFeedback.serverData.results));
                
            });
            $(".sortingButtons").on("click", ".dateDesc", function() {
                console.log("Desc sorting movies by creation date starting");
                console.log(movieFeedback.serverData.results);
                movieFeedback.serverData.results.sort(function(a, b) {
                    console.log(movieFeedback.serverData.results);
                    $("#sortByTime").removeClass("dateDesc").addClass("dateAsc");
                     return new Date(b.createdAt) - new Date(a.createdAt);
                     
                })
                $(".friendsRecomendations").html("");
                $(".friendsRecomendations").html(movieFeedback.dataOnScreen(movieFeedback.serverData.results));
                
            });
            $("#switchAutoUpdate").change(function(){
                movieFeedback.switchAutoApdate();
            })
            
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