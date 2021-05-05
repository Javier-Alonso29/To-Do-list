$(document).ready(function () {

    const boxtime = $("#box-time");

    /**
     * funtion to create a new task
     * @param {String} taskDescription text in the input
     */
    function createTask(taskDescription) {

        const obj_tasks = localStorage.getItem('objects');

        if (obj_tasks === null) {

            var list_tasks = [
                { 'id': 0, 'description': taskDescription, 'timer': '00:00', 'status': 'stop' }
            ]

            localStorage.setItem('objects', JSON.stringify(list_tasks));

        } else {

            var arr_updated = JSON.parse(obj_tasks);

            var last_item_id = arr_updated[arr_updated.length - 1].id;

            arr_updated.push({ 'id': last_item_id + 1, 'description': taskDescription, 'timer': '00:00', 'status': 'stop' })

            localStorage.setItem('objects', JSON.stringify(arr_updated));
        }
    }

    /**
     * Load the task from localStorage and show them in HTML 
     */
    function loadTasks() {

        const obs_tasks = localStorage.getItem('objects');

        const array_tasks = JSON.parse(obs_tasks);

        const table = $('#table');

        var block = "";

        array_tasks.forEach(element => {

            block += "<tr>"
                + "<td class='th-information'>" + element.description + "</td>"
                + "<td class='th-edit'><a class='btn-a btn-success' onclick='editTask(" + JSON.stringify(element) + ")'><i class='far fa-edit'></i></a></td>"
                + "<td class='th-action'><a id='btn-time" + element.id + "' class='btn-a btn-blue' onclick='timer(" + JSON.stringify(element) + ")'><i class='far fa-play-circle'></i></a></td>"
                + "<td class='th-timer' id='elementTime" + element.id + "'>" + element.timer + "</td>"
                + "<td class='th-quit'><a class='btn-a btn-red' onclick='deleteTask(" + JSON.stringify(element) + ")' ><i class='far fa-window-close'></i></a></td>"
                + "</tr>";

        });

        table.html(block);
    }


    /**
     * Validate that exist text in the input to add a new task
     */
    $('#btn-addTask').click(function () {

        const inputtask = $('#inputtask');


        if (inputtask.val() != 0) {

            createTask(inputtask.val());

            loadTasks();

            inputtask.css("border-bottom", "2px solid");
            inputtask.attr("placeholder", "Do something");
            inputtask.val("");
            boxtime.css('display','flex');

        } else {

            inputtask.css("border-bottom", "2px solid red");
            inputtask.attr("placeholder", "You need to write a task");

        }

    });

    /**
     * when the page loads show tasks
     */
    if (localStorage.getItem('objects') != null) {
        var object_task = localStorage.getItem('objects');
        var tasks = JSON.parse(object_task);
        var newArray = [];

        tasks.forEach(element => {

            element.status = 'stop';
            
            newArray.push(element);

        });

        localStorage.setItem('objects', JSON.stringify(newArray));

        // If exists tasks in LocalStorage shows timer box
        loadTasks();
        boxtime.css('display','flex');

    }else{
        // If dont exists tasks in LocalStorage dont shows timer box
        boxtime.css('display','none');
    }


});