if(isset($_POST['get_city']) && !empty($_POST['city'])){
            
            global $link; // строка подключения к БД
            
            //Очищаем от всего кроме русских букв
            $city = preg_replace('/[^а-я]+/msiu', '',strip_tags(trim($_POST['city'])));
            if(empty($city)) {
                echo json_encode(array("status"=> 2,"data"=> ""));
                exit();
            }
            // mb_strlen -  для русских букв иначе считает по 2 байта
            if(mb_strlen(trim($city))<1) {
                echo json_encode(array("status"=> 3,"data"=> ""));
                exit();
            }

            $sql = "SELECT name FROM geo_city WHERE name LIKE '".$city."%' ORDER BY name ASC";
            $r = $link->query($sql);
            
            //начинаем создавать массив снужными городами, потом его уже обрабатывать будет JS
            if(!$r->num_rows) {
                echo json_encode(array("status"=> 0,"data"=> ""));
                exit();
            }

            $arr = array();
            while($m =$r->fetch_assoc()){
                $arr[] = $m['name'];
            }
            /**
             * Масив со статусом и самим телом
             */

            //кодируем масив в JSON
            echo json_encode(array("status"=> 1,"data"=>$arr));
            exit;
        }
        echo json_encode(array("status"=> 4,"data"=> ""));
        exit();
