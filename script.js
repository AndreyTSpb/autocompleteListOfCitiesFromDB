    let arr = location.href.split("/");
    arr.pop();
    let str_http = arr.shift();
    arr.forEach(function (item) {
        str_http +="/"+item;
    });

    let obj_city = []; // переменная со списком городов

    let city_input = document.getElementById('city-input'),
        list_name  = city_input.getAttribute('list');

    if(city_input){
        city_input.addEventListener('input', listenerInput);
    }

    /**
     * Функция слушатель
     * @var test -  флаг на проверку содержится ли нужная подстрока в уже выбраном массиве
     * если нет обновить массив, иначе продалжаем использовать старую выборку
     * сокращаем число запросов к БД
     * Если инпут становится пустым, то зачишаем выборку и лист с опшинами
     */
    function listenerInput() {
        let val = this.value,
            test = false;

        if(val.length > 0 && test === true){
            create_lis_city();
        }else if(val.length > 0  && test === false){
            obj_city = [];
            removeList();
            get_city_from_bd(val);

        }else{
            obj_city = [];
            test = false;
            removeList();
        }
        //проверка на наличее в масиве нужного значения
        if(obj_city.length > 0){
            obj_city.forEach((item)=>{
                console.log(item.indexOf(val));
                if(val.length > 0 && item.indexOf(val) > -1){
                    test = true;
                    return;
                }
                test = false;
            });
        }else{
            test =false;
        }

    }

    /**
     * удаление скписка городов
     */
    function removeList() {
        let list = document.getElementById(list_name);
        if(list != null){
            list.innerHTML = "";
        }
    }

    /**
     * Получение списка городов из БД
     * @param city
     */
    function get_city_from_bd(city) {
        $.ajax({
            url: str_http + "/lk/get_city",
            type: "POST",
            data: {get_city: 1, city: city},
            dataType: "JSON",
            success: function (html) {
                /**
                 * status:
                 * 0) - ничего не найдено,
                 * 1) - ok,
                 * 2) - нет русских букв,
                 * 3) - мало букв для поиска
                 * 4) - не правильные параметры пост запроса
                 */

                //return data;
                //console.log(html);
                switch (html.status){
                    case 0:
                        console.log('ничего не найдено');
                        break;
                    case 1:
                        //console.log(html.data);
                        obj_city = html.data;
                        break;
                    case 2:
                        console.log('нет русских букв');
                        break;
                    case 3:
                        console.log('мало букв для поиска');
                        break;
                    case 4:
                        console.log('не правильные параметры пост запроса');
                        break;
                }
                /**
                 * если происходит выборка из базы, то формируем лист отсюда
                 * т.к. асинхронный запрос и надо дождаться его выполнения.
                 */
                create_lis_city(obj_city);
            }
        });
    }

    /**
     * Содаем выпадающий лист со списком городов навыбор
     */
    function create_lis_city(obj_city) {
        /**
         * <datalist id = "airports"> <!--Список предопределенных вариантов для ввода-->
         *   <option value = "VVO" label = "Владивосток">
         *   <option value = "MEM" label = "Анапа">
         *   <option value = "VKO" label = "Москва Внуково">
         *   <option value = "LNX" label = "Смоленск">
         *   <option value = "YKS" label = "Якутск">
         * </datalist>
         * @type {HTMLElement}
         */
        let datalist = document.getElementById(list_name);

        if(datalist != null ){
            datalist.innerHTML = "";
        }else{
            datalist = document.createElement('datalist');
            datalist.id = list_name;
        }

        for(let item of obj_city){
            let option = document.createElement("option");
            option.value = item;
            option.setAttribute('label', item);
            datalist.appendChild(option);
        }

        document.body.appendChild(datalist);
    }
