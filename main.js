// To display the data in the html
async function displayTodo() {
  let todoData = await axios.get(
    "https://infodev-server.herokuapp.com/api/todos"
  );
  setData(todoData.data);
}

function setData(data) {
  const ul = document.querySelector("#lecture-list ul");
  let arr = [];
  data.forEach((todo) => {
    const li = document.createElement("li");
    li.id = todo._id;
    let priority;
    let color;
    let isComplete;
    if (todo.priority === 0) {
      priority = "low";
      color = "info";
    } else if (todo.priority === 1) {
      priority = "medium";
      color = "warning";
    } else {
      priority = "high";
      color = "danger";
    }

    if (todo.completed === true) {
      isComplete = "completed";

      li.innerHTML = `<div>
    <h6 class="title ${isComplete}">${todo.name}<span class="ml-2 badge badge-${color}">${priority}</span></h6>
    <p class="description">${todo.description}</p>
</div>

<div>
    <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
</div>`;
    } else {
      isComplete = "";
      li.innerHTML = `<div>
      <h6 class="title ${isComplete}">${todo.name}<span class="ml-2 badge badge-${color}">${priority}</span></h6>
      <p class="description">${todo.description}</p>
  </div>
  <div>
        <button class="btn btn-success"><i class="fas fa-check"></i></i></button>
      <button class="btn btn-warning"><i class="fas fa-pencil"></i></i></button>
       <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
         </div>`;
    }

    arr.push(li);
  });

  ul.replaceChildren(...arr);
}

//Main program starts

document.addEventListener("DOMContentLoaded", () => {
  displayTodo();

  //add the todo
  const form = document.forms["lecture-add"];

  document.getElementById('send').style.display = 'none';

  btn = document.getElementById('add');

  if(btn.id === 'add'){
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      let taskName = form.querySelector('input[type="text"]').value;
      let priority = form.querySelector("select").value;
      let description = form.querySelector("textarea").value;
  
      if (taskName && priority && description) {
        postTodo({
          name: taskName,
          priority: priority,
          description: description,
          completed: false,
        });
        form.querySelector('input[type="text"]').value = '';
          form.querySelector("select").value = 0;
          form.querySelector("textarea").value = '';
      }
    });
  
    function postTodo(data) {
      axios({
        method: "post",
        url: "https://infodev-server.herokuapp.com/api/todos",
        data: data,
      })
        .then((res) => {
          console.log("success posting data");
          displayTodo();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }


  //delete the TODO
  const ul = document.querySelector("#lecture-list ul");
  ul.addEventListener("click", (e) => {
    if (e.target.classList[1] === "btn-danger") {
      let targetLi = e.target.parentElement.parentElement;
      deleteTodo(targetLi.id);
    } else if (e.target.classList[1] === "fa-trash-alt") {
      let targetLi = e.target.parentElement.parentElement.parentElement;
      deleteTodo(targetLi.id);
    }
  });

  function deleteTodo(id) {
    axios({
      method: "delete",
      url: `https://infodev-server.herokuapp.com/api/todos/${id}`,
    })
      .then((res) => {
        displayTodo();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //for marking task as complete

  ul.addEventListener("click", (e) => {
    if (e.target.classList[1] === "btn-success") {
      var targetLi = e.target.parentElement.parentElement;
    } else if (e.target.classList[1] === "fa-check") {
      var targetLi = e.target.parentElement.parentElement.parentElement;
    }
    let data = {
      completed: true
    };
    markTodo(data, targetLi.id);
  });

  function markTodo(data, id) {
    axios({
      method: "put",
      url: `https://infodev-server.herokuapp.com/api/todos/${id}`,
      data: data,
    })
      .then((res) => {
        displayTodo();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //for editing the task

  ul.addEventListener("click", (e) => {
    if (e.target.classList[1] === "btn-warning") {
      var targetLi = e.target.parentElement.parentElement;
    }else if(e.target.classList[1] === 'fa-pencil'){
      var targetLi = e.target.parentElement.parentElement.parentElement;
    }
    let todoName = targetLi.children[0].children[0].childNodes[0].data;
    let description = targetLi.children[0].children[1].innerText;
    let checker = targetLi.children[0].children[0].children[0].innerText;
    let todoPriority;
    if (checker === "low") {
      todoPriority = 0;
    } else if (checker == "medium") {
      todoPriority = 1;
    } else {
      todoPriority = 2;
    }

    const form = document.forms["lecture-add"];
    form.querySelector('input[type="text"]').value = todoName;
    form.querySelector("textarea").value = description;
    form.querySelector("select").value = todoPriority;
    
    document.getElementById('add').style.display = 'none';
    
    btn = document.getElementById("send");
    btn.style.display = 'block';
   
    //===========================

    if(btn.id === 'send'){
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        let taskName = form.querySelector('input[type="text"]').value;
        let priority = form.querySelector("select").value;
        let description = form.querySelector("textarea").value;
        
        // console.log(taskName,priority,description)
        if (taskName && priority && description) {
          updateTodo({
            name: taskName,
            priority: priority,
            description: description,
            completed: false,
          },targetLi.id);

          form.querySelector('input[type="text"]').value = '';
          form.querySelector("select").value = 0;
          form.querySelector("textarea").value = '';
        }
      });
  
      function updateTodo(data,id){
        axios({
          method: "put",
          url: `https://infodev-server.herokuapp.com/api/todos/${id}`,
          data: data,
        })
          .then((res) => {
            // console.log("updated todo");
            // document.getElementById('send').innerText = "ADD";
            console.log('Update successful')
            displayTodo();
            document.getElementById('add').style.display = 'block';
            document.getElementById('send').style.display = 'none';
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }



  });
});
