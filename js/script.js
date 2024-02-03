const todo_control = document.querySelector(".todo-control"),
  header_input = document.querySelector(".header-input"),
  todo_list = document.querySelector(".todo-list"),
  addButton = document.querySelector(".header-button");

let todo_data = [];

const getTasks = () => {
  $.ajax({
    url: "http://127.0.0.1:8000/todo/tasks/?format=json",
    method: "GET",
    headers: {
      Authorization: "Token f36e45bebe6b6d4b8541f496005ca501380c0530",
    },
    success: function (data) {
      todo_data = data["results"];
      console.log(todo_data);
      add_to_do();
    },
    error: function (error) {
      console.log(error);
    },
  });
};

const createTasks = (itemTitle) => {
  $.ajax({
    url: "http://127.0.0.1:8000/todo/tasks/",
    method: "POST",
    headers: {
      Authorization: "Token f36e45bebe6b6d4b8541f496005ca501380c0530",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      title: itemTitle,
      description: "description",
      completed: false,
      category: 1,
    }),
    success: function (data) {
      console.log("Create successful:", data);

      getTasks();
    },
    error: function (error) {
      console.log("Create error:", error);
    },
  });
};

const updateCompleted = (item, complete) => {
  $.ajax({
    url: `http://127.0.0.1:8000/todo/tasks/${item.id}/`,
    method: "PUT",
    headers: {
      Authorization: "Token f36e45bebe6b6d4b8541f496005ca501380c0530",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      id: item.id,
      title: item.title,
      description: item.description || "",
      completed: complete,
      category: item.category,
    }),
    success: function (data) {
      console.log("Update successful:", data);
      getTasks();
    },
    error: function (error) {
      console.log("Update error:", error);
    },
  });
};

const deleteTask = (item) => {
  $.ajax({
    url: `http://127.0.0.1:8000/todo/tasks/${item.id}/`,
    method: "DELETE",
    headers: {
      Authorization: "Token f36e45bebe6b6d4b8541f496005ca501380c0530",
    },
    success: function (data) {
      console.log("Delete successful:", data);

      getTasks();
    },
    error: function (error) {
      console.log("Delete error:", error);
    },
  });
};

function add_to_do() {
  todo_list.textContent = "";

  todo_data.forEach(function (item) {
    let new_li = createNewElement(item.title, item.completed);

    todo_list.append(new_li);

    const btn_todo_complete = new_li.querySelector(".todo-complete");
    btn_todo_complete.addEventListener("click", function () {
      console.log(item.completed);
      if (new_li.classList.contains("complete")) {
        updateCompleted(item, false);
        new_li.classList.remove("complete");
      } else {
        updateCompleted(item, true);
        new_li.classList.add("complete");
      }
    });

    const btn_todo_remove = new_li.querySelector(".todo-remove");
    btn_todo_remove.addEventListener("click", function () {
      let text = `Are you sure you want to delete this ${
        item.isCompleted ? "completed" : ""
      } task?`;
      if (confirm(text) == true) {
        deleteTask(item);
      }
    });
  });
}

function createNewElement(itemTitle, itemCompleted) {
  let new_li = document.createElement("li");
  new_li.className = "todo-item";
  new_li.innerHTML = `<span class='text-todo'>${itemTitle}</span>
    <div class ="todo-buttons">
        <button class = "todo-remove"></button>
        <button class = "todo-complete"></button>
    </div>`;
  if (itemCompleted) {
    new_li.classList.add("complete");
  }
  return new_li;
}

addButton.addEventListener("click", function (event) {
  event.preventDefault();
  createTasks(header_input.value);
  header_input.value = "";
});

getTasks();
