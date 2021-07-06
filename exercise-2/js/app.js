var taskInput = document.getElementById("new-task");
var addButton = document.getElementsByTagName("button")[0];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

var createNewTaskElement = function(taskString, arr) {
    listItem = document.createElement("li");
    checkBox = document.createElement("input");
    label = document.createElement("label");
    editInput = document.createElement("input");
    editButton = document.createElement("button");
    deleteButton = document.createElement("button");

    checkBox.type = "checkbox";
    editInput.type = "text";
    editButton.innerText = "Edit";
    editButton.className = "edit";
    editButton.dataset.value = taskString;
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    label.innerText = taskString;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
};

var addTask = function() {
    taskInput.classList.remove("is-required");
    taskInput.classList.remove("is-error");
    var listItemName = taskInput.value;
    if (listItemName && listItemName.trim()) {
		if(checkTaskDuplication(listItemName)){
			taskInput.classList.add("is-error");
			alert("Duplicate Task Name. Please try with different task name");
			return;
		}
        listItem = createNewTaskElement(listItemName)
        incompleteTasksHolder.appendChild(listItem)
        bindTaskEvents(listItem, taskCompleted)
        taskInput.value = "";
        addTaskToLocalStorage("todoTasks", listItemName);
        toggleTodoTaskSection("block");
    } else {
        taskInput.classList.add("is-required");
    }
};

var editTask = function() {
    var listItem = this.parentNode;
    var editInput = listItem.querySelectorAll("input[type=text")[0];
    var label = listItem.querySelector("label");
    var button = listItem.getElementsByTagName("button")[0];

    editInput.classList.remove("is-required");
    editInput.classList.remove("is-error");


    var containsClass = listItem.classList.contains("editMode");

    if (!containsClass) {
        listItem.classList.toggle("editMode");
        editInput.value = label.innerText
        button.innerText = "Save";
    }


    if (containsClass) {
        if (editInput.value && editInput.value.trim()) {
			const taskValue = editInput.value;
            const exTaskTarget = button.dataset.value;
			
			if(taskValue !== exTaskTarget && checkTaskDuplication(editInput.value)){
				editInput.classList.add("is-error");
				alert("Duplicate Task Name. Please try with different task name");
				return;
			}
            let taskSlug = "";
            if (listItem.parentNode.id === "incomplete-tasks") {
                taskSlug = "todoTasks";
            } else if (listItem.parentNode.id === "completed-tasks") {
                taskSlug = "completedTasks";
            }
            
            updateTaskLocalStorage(taskSlug, taskValue, exTaskTarget);
            listItem.classList.toggle("editMode");
            label.innerText = editInput.value;
            button.innerText = "Edit";
        } else {
            editInput.classList.add("is-required");
        }
    }

};

var deleteTask = function(el) {
	if(confirm("Are u sure to delete the task?")){
		var listItem = this.parentNode;
		var ul = listItem.parentNode;
		ul.removeChild(listItem);
	
		let taskSlug = "";
		if (ul.id === "incomplete-tasks") {
			taskSlug = "todoTasks";
		} else if (ul.id === "completed-tasks") {
			taskSlug = "completedTasks";
		}
	
		const taskValue = this.parentNode.children[1].innerText;
		removeTaskFromLocalStorage(taskSlug, taskValue);
		const todoTasks = JSON.parse(localStorage.getItem('todoTasks'));
		if (!todoTasks || todoTasks.length === 0) {
			toggleTodoTaskSection("none");
		}
		const completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
		if (!completedTasks || completedTasks.length === 0) {
			toggleCompletedTaskSection("none");
		}
	}
};

var taskCompleted = function(el) {

    var listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
    toggleCompletedTaskSection("block")

    const taskValue = this.parentNode.children[1].innerText;
    removeTaskFromLocalStorage("todoTasks", taskValue);
    const todoTasks = JSON.parse(localStorage.getItem('todoTasks'));
    if (!todoTasks || todoTasks.length === 0) {
        toggleTodoTaskSection("none");
    }
    addTaskToLocalStorage("completedTasks", taskValue);
};

var taskIncomplete = function() {
    var listItem = this.parentNode;
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
    toggleTodoTaskSection("block")

    const taskValue = this.parentNode.children[1].innerText;
    removeTaskFromLocalStorage("completedTasks", taskValue);
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    if (!completedTasks || completedTasks.length === 0) {
        toggleCompletedTaskSection("none");
    }
    addTaskToLocalStorage("todoTasks", taskValue);
};

var bindTaskEvents = function(taskListItem, checkBoxEventHandler, cb) {
    var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
    var editButton = taskListItem.querySelectorAll("button.edit")[0];
    var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
};

addButton.addEventListener("click", addTask);

for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

for (var i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}



const checkTaskDuplication = (value) => {
	const toDoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
	if(toDoTasks.includes(value)){
		return true;
	}
	const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
		if(completedTasks.includes(value)){
		return true;
	}
	
	return false;
}

const addTaskToLocalStorage = (slug, value) => {
    const storedTasks = JSON.parse(localStorage.getItem(slug)) || [];

    const newTasks = [...storedTasks, value];
    localStorage.setItem(slug, JSON.stringify(newTasks));

}

const updateTaskLocalStorage = (slug, value, target) => {
    const storedTasks = JSON.parse(localStorage.getItem(slug)) || [];

    const newTasks = storedTasks.map(task => {
        if (task === target) {
            return value;
        }
        return task;
    });
    localStorage.setItem(slug, JSON.stringify(newTasks));

}

const removeTaskFromLocalStorage = (slug, value) => {
    const storedTasks = JSON.parse(localStorage.getItem(slug)) || [];

    const newTasks = storedTasks.filter(task => {
        return task !== value;
    });
    localStorage.setItem(slug, JSON.stringify(newTasks));

}

const toggleTodoTaskSection = (display) => {
    const todoTaskTarget = document.getElementsByClassName("incomplete");
    var i;
    for (i = 0; i < todoTaskTarget.length; i++) {
        todoTaskTarget[i].style.display = display;
    }
}

const toggleCompletedTaskSection = (display) => {
    const toggleCompletedTaskSection = document.getElementsByClassName("completed");
    var i;
    for (i = 0; i < toggleCompletedTaskSection.length; i++) {
        toggleCompletedTaskSection[i].style.display = display;
    }
}

window.onload = function() {
    const defaultTodoTasks = JSON.parse(localStorage.getItem('todoTasks'));

    defaultTodoTasks && defaultTodoTasks.forEach((task) => {
        listItem = createNewTaskElement(task)
        incompleteTasksHolder.appendChild(listItem)
        bindTaskEvents(listItem, taskCompleted)
    });

    if (!defaultTodoTasks || defaultTodoTasks.length === 0) {
        toggleTodoTaskSection("none");
    }

    const defaultCompletedTasks = JSON.parse(localStorage.getItem('completedTasks'));

    defaultCompletedTasks && defaultCompletedTasks.forEach((task) => {
        listItem = createNewTaskElement(task)
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);
    });

    //localStorage.setItem('todoTasks', JSON.stringify(['Pay Bills', 'Go Shopping']));
    //localStorage.setItem('completedTasks', JSON.stringify(['Pay Bills', 'Go Shopping']));



    if (!defaultCompletedTasks || defaultCompletedTasks.length === 0) {
        toggleCompletedTaskSection("none");
    }

};