
var time;

/**
 * 
 * @param {JSON} task ejement json to delete
 */
function deleteTask(task) {

    const obj_tasks = localStorage.getItem('objects');
    const array_tasks = JSON.parse(obj_tasks);
    const newArray = []

    for (var t in array_tasks) {

        let object_task = array_tasks[t]

        if (object_task.id != task.id) {
            newArray.push(object_task)
        }

    }

    // If newArry not is empty we add the newArray with the tasks and 
    // set it in localStorage

    if (newArray.length != 0) {

        localStorage.setItem('objects', JSON.stringify(newArray));

    } else {

        // If newAray is empty we remove localStorage 
        localStorage.removeItem('objects')

    }

    location.reload();
}

/**
 * 
 * @param {JSON} task element to edit
 */
function editTask(task) {

    const modal = $("#modalid");
    const span = $(".close");
    const input_update_task = $("#input_update_task")

    // Show the modal with the task value
    input_update_task.val('');

    input_update_task.attr("placeholder", task.description);

    modal.css("display", "block");

    span.click(function () {
        modal.css("display", "none");
    });

    const btn_update_task = $("#btn-update-task");

    // Updated the task with the new value
    btn_update_task.click(function () {

        if (input_update_task.val().length != 0) {


            const obj_tasks = localStorage.getItem('objects');
            const array_tasks = JSON.parse(obj_tasks);
            const newArray = []

            for (var t in array_tasks) {

                let object_task = array_tasks[t]

                if (object_task.id === task.id) {

                    task.description = input_update_task.val();

                    newArray.push(task)

                } else {

                    newArray.push(object_task)

                }

                localStorage.setItem('objects', JSON.stringify(newArray));
                location.reload();


            }

        }

    });

}

/**
 * 
 * @param {JSON} task element to run the timer 
 */
function run(task) {

    var m = $("#timeM");
    var s = $("#timeS");

    var contador_min;
    var contador_sec

    // If the task dont have time saved the timer starts in 0:0
    if(task.timer == '00:00'){

        contador_min = 0;
        contador_sec = 0;

    }else{

        // Get the task time and start timer with the task values 
        current_time = task.timer.split(':');
        contador_min = parseInt(current_time[0]);
        contador_sec = parseInt(current_time[1]);

    }

    // Run re timer
    time = setInterval(function () {

        if (contador_sec == 60) {
            contador_sec = 0;
            contador_min++;
            m.text(contador_min);

            if (contador_min == 60) {

                contador_min = 0;
            }
        }

        s.text(contador_sec);
        contador_sec++;
    }, 1000);

}

/**
 * Stop the timer time
 * @returns {String} timer value 
 */
function stop() {
    clearInterval(time);

    var m = $("#timeM");
    var s = $("#timeS");

    time = m.text() + ":" + s.text();

    m.text('0');
    s.text('0');

    return time;
}


/**
 * Chack the status and the time of the task and 
 * run or stop the timer
 * @param {JSON} task runs the timer 
 */
function timer(task) {
    const obj_tasks = localStorage.getItem('objects');
    const array_tasks = JSON.parse(obj_tasks);
    const newArray = [];

    for (var t in array_tasks) {

        let object_task = array_tasks[t]

        if (object_task.id === task.id) {

            // Check the task status 
            if (task.status == 'stop') {

                // If status is stop then change the status to run add the task
                // and run the timer

                task.status = 'run';
                newArray.push(task);
                run(task);

            } else {

                // If status is run then change status to stop and get its time from the timer 
                // with stop function and set it values, then we saved the task with the new values

                task.status = 'stop';
                task.timer = stop();
                newArray.push(task);
            }

        } else {

            newArray.push(object_task)

        }

    }

    localStorage.setItem('objects', JSON.stringify(newArray));
    loadTasks();

}


/**
 * Load the task from localStorage and show them in HTML 
 * if the status is run we cancel the others actions from the taks
 */
function loadTasks() {

    const objetos_tasks = localStorage.getItem('objects');

    const array_tasks = JSON.parse(objetos_tasks);

    const table = $('#table');

    var block = "";

    array_tasks.forEach(element => {

        if (element.status == 'stop') {

            block += "<tr>"

                + "<td class='th-information'>" + element.description + "</td>"
                + "<td class='th-edit'><a class='btn-a btn-success' onclick='editTask(" + JSON.stringify(element) + ")'><i class='far fa-edit'></i></a></td>"
                + "<td class='th-action'><a id='btn-time" + element.id + "' class='btn-a btn-blue' onclick='timer(" + JSON.stringify(element) + ")'><i class='far fa-play-circle'></i></a></td>"
                + "<td class='th-timer' id='elementTime" + element.id + "'>" + element.timer + "</td>"
                + "<td class='th-quit'><a class='btn-a btn-red' onclick='deleteTask(" + JSON.stringify(element) + ")' ><i class='far fa-window-close'></i></a></td>"
                + "</tr>";

        } else {

            block += "<tr>"

                + "<td class='th-information'>" + element.description + "</td>"
                + "<td class='th-edit'><a class='btn-a disable' onclick='editTask(" + JSON.stringify(element) + ")'><i class='far fa-edit'></i></a></td>"
                + "<td class='th-action'><a id='btn-time" + element.id + "' class='btn-a btn-red' onclick='timer(" + JSON.stringify(element) + ")'><i class='far fa-pause-circle'></i></a></td>"
                + "<td class='th-timer' id='elementTime'><a class='btn-a running'>Runing</a></td>"
                + "<td class='th-quit'><a class='btn-a disable' onclick='deleteTask(" + JSON.stringify(element) + ")'><i class='far fa-window-close'></i></a></td>"
                + "</tr>";

        }

    });

    table.html(block);
}
