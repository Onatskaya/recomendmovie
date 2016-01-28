$(document).ready(function(){
	var  movieFeedback = {

		submitForm: $("#movie-feedback-form"),
		apiHost: "https://api.parse.com/1/",
		apiAppId: '8V1SzXwjmJC1BHXqlYXVuD1pPn0Di4FdxGEUY1N7',
        apiJSId: 'Xq9y1XH9TEWai2mC7XwRQdlVdWPILnTXnINwbEBa',
        serverData: [],
        settings: {
            autoUpdateInterval: 15000,
            autoUpdateEnabled: false
        },
        createElement: function(recObject) {
			var recTemplate = _.template(
		        '<div class="panel panel-default movie-rec  rec-wrapper" id="<%=rec.objectId %>">' +
		        '<div class="panel-body" data-year="<%= rec.year %>">' +
		        '<img src="<%= rec.imgUrl %>" alt="Poster" class="poster">' +
		        '<h3><%= rec.title %><small> <%= rec.genre %></small></h3>' +
		        '<p class="recYear">Год выпуска: <%= rec.year %></p>' +
		        '<p><%= rec.description %></p>' +
		        '<p>Автор рекомендации: <%= rec.postAutor %></p>' +
		        '<p>Рекомендация оставлена: <%= moment(rec.createdAt).format("LL") %></p>' +
		        '</div>'
		    );

		    var recElement = recTemplate({ rec: recObject});

		    return recElement;
		},

        /*функция подготавливает html-структуру и выводит полученные данные на экран*/
        dataOnScreen: function(serverData){          

            //$(".friendsRecomendations").html("");

            /*Использование библиотеки underscore.js*/

            for (var i = movieFeedback.serverData.results.length-1; i >= 0; i--) {

                movieFeedback.createElement(movieFeedback.serverData.results[i]);

                $(".friendsRecomendations").append(movieFeedback.createElement(movieFeedback.serverData.results[i]));
                $(".rec-wrapper").show("slow");
            }
        },

        /*метод возвращает массив, включающий в себя все id рекомендаций, выведенных на страницу*/
        getExistentRecomendationsId: function() {
            var existentRecomendations = [];
            $(".friendsRecomendations .rec-wrapper").each( function(index, elem) {
                existentRecomendations.push($(elem).attr("id"));
                });
            console.log("Existent recomendations array: ", existentRecomendations);
            return existentRecomendations;

        },

        /*метод посылает ajax-запрос на сервер, получает ответ, выводит на страницу вновь добавленные рекомендации над уже существующими*/
        getServerRecomendationId: function() {
            movieFeedback.getRecomendations(
                    function(data){
                        //movieFeedback.serverData = data.results;
                        
                        var serverRecomendations = _.pluck(data.results, 'objectId');
                            console.log("Recomendations from server: ", serverRecomendations);
        				 //return serverRecomendations;
                        var diff = movieFeedback.comparingIds(movieFeedback.getExistentRecomendationsId(), serverRecomendations);

                        var pageElements = [];

                        for (var i=0; i<diff.length; i++){
                            var newRecomendation = _.where(data.results, {objectId: diff[i]});
                            console.log("new rec: ", newRecomendation);
                            pageElements.push(newRecomendation[0]);
                        };
                        console.log("Page Elements: ", pageElements);

                        for (var i = pageElements.length-1; i >= 0; i--) {

                            movieFeedback.createElement(pageElements[i]);

                            $(".friendsRecomendations").prepend(movieFeedback.createElement(pageElements[i]));
                            $(".rec-wrapper").show("slow");
                        }


                    },
                    function(error){
                        console.error("Error while getting feedback list. Response is: ", response );
                    }
                );

            

            //return ["NSzYaF4hyb", "8JcTeJNYzY", "FBzOOjHi6J", "TQsX70O8TO"];
        },

        /*метод возвращает массив, содержащий только id вновь добавленных фильмов. Эта разница получается путем сравнения id со страницы и с ответа сервера функцией _.difference*/
        comparingIds: function(existentIds, serverIds) {
            // var newalyAddedRecomendations = [];
            newalyAddedRecomendations = _.difference(serverIds, existentIds);
            // console.log("New recomendations: ", newalyAddedRecomendations);
            return newalyAddedRecomendations;

        },

        /*test_function: function() {
            var serverInfo = {"results":[{"createdAt":"2016-01-11T16:57:13.252Z","description":"","genre":"Фэнтези","imgUrl":"http://www.kinopoisk.ru/images/film_big/4815.jpg","objectId":"NSzYaF4hyb","postAuthor":"Виталий","title":"От заката до рассвета","updatedAt":"2016-01-11T16:57:13.252Z","year":"1995"},{"createdAt":"2016-01-13T09:51:46.276Z","description":"Мечта репортерши стать ведущей программы новостей может быть разрушена. После ночи кутежа она оказывается в дальнем районе Лос-Анджелеса без телефона, автомобиля, паспорта и денег — и у нее остается только 8 часов, чтобы добраться до самого важного собеседования ее жизни.","genre":"Комедия","imgUrl":"http://st.kp.yandex.net/images/film_iphone/iphone360_714408.jpg","objectId":"8JcTeJNYzY","postAuthor":"Надежда","title":"Блондинка в эфире","updatedAt":"2016-01-13T09:51:46.276Z","year":"2014"},{"createdAt":"2016-01-14T14:44:03.515Z","description":"","genre":"lalala","imgUrl":"http://forum.awd.ru/download_fake_non_existing_directory/301986/thumb/30/19/thumb_190488_a484a0942f5d44ad0d693ae5261b7de9.jpg","objectId":"FBzOOjHi6J","postAuthor":"lera","title":"lalala","updatedAt":"2016-01-14T14:44:03.515Z","year":"1987"},{"createdAt":"2016-01-14T15:44:52.501Z","description":"Lorem Ipsum Dolar","genre":"Фентези","imgUrl":"http://kinino.ru/_ld/1/43112539.jpg","objectId":"TQsX70O8TO","post":"Stas","title":"Безумный Макс 4","updatedAt":"2016-01-14T15:44:52.501Z","year":"2015"},{"createdAt":"2016-01-14T16:48:29.627Z","description":"jgh","genre":"fgdhfdh","imgUrl":"http://ya.ru","objectId":"48A3xFm1A0","postAuthor":"ololo","title":"gffndfg","updatedAt":"2016-01-14T16:48:29.627Z","year":"2015"},{"createdAt":"2016-01-16T17:29:39.390Z","description":"","genre":"","imgUrl":"","objectId":"MnqEryFPNf","post":"","title":"","updatedAt":"2016-01-16T17:29:39.390Z","year":""},{"createdAt":"2016-01-17T15:36:11.274Z","description":"gdgfdg","genre":"gggrg","imgUrl":"http://img1.joyreactor.cc/pics/post/anon-%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B0-2191131.jpeg","objectId":"yacdZdIc52","postAuthor":"gdgd","title":"ggdg","updatedAt":"2016-01-17T15:36:11.274Z","year":"1977"},{"createdAt":"2016-01-17T15:41:13.583Z","description":"«Обитель зла» (англ. Resident Evil, японское название Biohazard) — серия фильмов, снятая по сценарию Пола Андерсона, является экранизацией известной компьютерной игры компании Capcom Resident Evil. Главную роль в фильмах исполнила Милла Йовович.","genre":"фантастика боевик ужасы","imgUrl":"https://upload.wikimedia.org/wikipedia/ru/9/9a/Resident_Evil_Poster.jpg","objectId":"n0jY0IY1gv","postAuthor":"Виталий Мартынов","title":"Обитель зла","updatedAt":"2016-01-17T15:41:13.583Z","year":"2002"},{"createdAt":"2016-01-18T15:30:35.374Z","description":"","genre":"титаник","imgUrl":"http://sgolder.com/wp-content/uploads/2015/01/top-sait6.jpg","objectId":"D4NKIyh6Dn","postAuthor":"vallery","title":"титаник","updatedAt":"2016-01-18T15:30:35.374Z","year":"2000"},{"createdAt":"2016-01-18T16:54:59.174Z","description":"cat","genre":" comedy","imgUrl":"https://pbs.twimg.com/profile_images/378800000532546226/dbe5f0727b69487016ffd67a6689e75a.jpeg","objectId":"w4QIWZuxP5","postAuthor":"lera","title":"cat","updatedAt":"2016-01-18T16:54:59.174Z","year":"2015"},{"createdAt":"2016-01-18T17:25:49.309Z","description":"cat","genre":"thriller","imgUrl":"http://i.dailymail.co.uk/i/pix/2014/10/06/1412613364603_wps_17_SANTA_MONICA_CA_AUGUST_04.jpg","objectId":"kIpwRXof05","postAuthor":"lera","title":"cat","updatedAt":"2016-01-18T17:25:49.309Z","year":"2015"},{"createdAt":"2016-01-21T16:39:08.362Z","description":"","genre":"qwqe","imgUrl":"http://forum.awd.ru/download_fake_non_existing_directory/301986/thumb/30/19/thumb_190488_a484a0942f5d44ad0d693ae5261b7de9.jpg","objectId":"vF55dxt8Zh","postAuthor":"lera","title":"cat","updatedAt":"2016-01-21T16:39:08.362Z","year":"1905"},{"createdAt":"2016-01-21T16:45:36.126Z","description":"","genre":"Спорт","imgUrl":"http://kinogo.co/uploads/posts/2013-05/1369090980_never-back-down.jpg","objectId":"k7Pk0gKk8V","post":"Стас","title":"Никогда не сдавайся","updatedAt":"2016-01-21T16:45:36.126Z","year":"2008"},{"createdAt":"2016-01-21T16:54:06.141Z","description":"","genre":"test","imgUrl":"http://www.cruzo.net/user/images/k/dbb025264e7d1a35772dfa4387514de9_172.jpg","objectId":"zu7AHzIqvb","postAuthor":"test","title":"test","updatedAt":"2016-01-21T16:54:06.141Z","year":"1989"}]};

            var films = [ "NSzYaF4hyb", "8JcTeJNYzY", "FBzOOjHi6J"];

            var films2 = ["NSzYaF4hyb", "8JcTeJNYzY", "FBzOOjHi6J", "TQsX70O8TO"]

            var newAddedRecomendations = [];
            newAddedRecomendations = _.difference(films2, films);
            // console.log("New recomendations: ", newAddedRecomendations);

            var elementsForPage = [];

            for (var i=0; i<newAddedRecomendations.length; i++){
                var test = _.where(serverInfo.results, {objectId: newAddedRecomendations[i]})
                console.log('test value: ',  test);

                // elementsForPage.push(newAddedRecomendations[i]);
            }

            //var pageElements = _.where(nealyAddedRecomendations, "objectId");
            // console.log(elementsForPage);
            return elementsForPage;
            //return nealyAddedRecomendations;
        },*/

        /*метод, отвечающий за вкл./выкл. автообновления списка рекомендаций*/
        switchAutoApdate: function(){
            if(movieFeedback.settings.autoUpdateEnabled) {
                console.debug("Auto update is enabled. We are going to switch it off.");
                clearInterval(movieFeedback.settings.intervalId);
                movieFeedback.settings.autoUpdateEnabled = false;
            } else {
                console.debug("Auto update is disabled. We are going to switch it on with interval: " + movieFeedback.settings.autoUpdateInterval);
                movieFeedback.settings.intervalId =  setInterval( movieFeedback.getServerRecomendationId(), movieFeedback.settings.autoUpdateInterval);
                $("#test").attr("disabled", false);
                movieFeedback.settings.autoUpdateEnabled = true;
            }
        },

        /*ajax-запрос на сервер, получение списка рекомендаций*/
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

        /*инициализирует работу скрипта*/
		init: function(){
			console.log("Movies feedback page initialization started...");
			movieFeedback.bindEventHandlers();
            console.log(movieFeedback.serverData);
           
		},

        /*привязка событий к элементам страницы*/
		bindEventHandlers: function(){

            /*Отправка данных формы на сервер методом POST*/
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

            /*Загрузка данных с сервера по клику на кнопку*/
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
                $("#test").attr("disabled", false);
            });

            /*Обновляется список рекоммендаций, если на сервере появились новые, они выводятся на экран*/
            $("#test").click(function() {
                movieFeedback.getExistentRecomendationsId();
                movieFeedback.getServerRecomendationId();
            });

            /*Сортировка записей по году*/
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

            /*Сортировка записей по году*/
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


            /*Сортировка записей по дате добавления рекомендации*/
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

            /*Сортировка записей по дате добавления рекомендации*/
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

            /*Вкл./выкл. автообновление рекомендаций, запускает в работу функцию автообновления*/
            $("#switchAutoUpdate").change(function(){
                movieFeedback.switchAutoApdate();
            })
            
		},

        /*Валидация данных формы перед отправкой на сервер*/
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

            if (imgUrl.substr(0, 8) == "https://" || imgUrl.substr(0, 7) == "http://" && imgUrl.substr(-4, 4) == ".jpg" || imgUrl.substr(-4, 4) == ".png" || imgUrl.substr(-4, 4) == ".gif" || imgUrl.substr(-4, 4) == ".svg" ) {
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