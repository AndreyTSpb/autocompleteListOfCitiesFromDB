
    let obj_city = []; // переменная со списком городов

    let city_input = document.getElementById('city-input'), // инпут для ввода названия города
        list_name  = city_input.getAttribute('list');      // Получаем идентификатор списка опшинов для инпута

    //Если инпут найден навешиваем слушителя на изменение в инпуте
    if(city_input != null){
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
            obj_city = []; //зачишаем массив
            removeList();  //зачищаем список опшинов
            get_city_from_bd(val); //обновляем массив и создаем новый список опшинов 

        }else{
            test = false;
            obj_city = []; //зачишаем массив
            removeList();  //зачищаем список опшинов
        }
        
        //проверка на наличее в масиве нужного значения
        if(obj_city.length > 0){
            obj_city.forEach((item)=>{
                console.log(item.indexOf(val));
                if(val.length > 0 && item.indexOf(val) > -1){
                    //если в массиве найдется хоть одно значение с нужным сочитанием то взводим флаг
                    //чтобы не было лишних обращений к базе
                    // и прерываем перебор
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
            // просто зачищаем все опшины
            list.innerHTML = "";
        }
    }

    /**
     * Получение списка городов из БД
     * @param city - то что ввел пользователь в инпут
     */
    function get_city_from_bd(city) {
        $.ajax({
            url: "post.php",
            type: "POST",
            data: {get_city: 1, city: city},
            dataType: "JSON",
            success: function (json) {
                /**
                 * status:
                 * 0) - ничего не найдено,
                 * 1) - ok,
                 * 2) - нет русских букв,
                 * 3) - мало букв для поиска
                 * 4) - не правильные параметры пост запроса
                 */
                switch (json.status){
                    case 0:
                        console.log('ничего не найдено');
                        break;
                    case 1:
                        obj_city = json.data;
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
        //пытаемся сначала найти уже существующий лист
        let datalist = document.getElementById(list_name);

        if(datalist != null ){
            //если есть то зачистить его от старых опшинов
            datalist.innerHTML = "";
        }else{
            //если нет создать новый
            datalist = document.createElement('datalist');
            //добавить идентификатор листа (получаем из атрибута list у инпута в который пользователь вводит названия)
            datalist.id = list_name;
        }
        // добавляем новые опшины в лист
        for(let item of obj_city){
            let option = document.createElement("option");
            option.value = item;
            option.setAttribute('label', item);
            datalist.appendChild(option);
        }
        // запихиваем лист в конец боди ( без разницы куда помещать)
        document.body.appendChild(datalist);
    }
