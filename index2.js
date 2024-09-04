const cardcontainer = document.querySelector(".card_container");
const modalcontainer = document.querySelector(".modal_container");

const state = {
  taskList: [],
};

const updateLocalStorage = () => {
  localStorage.setItem(
    "task",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.task);

  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  state.taskList.map((cardDate) => {

    cardcontainer.insertAdjacentHTML("beforeend", card(cardDate));
  });
};


const saveChanges = (event) => {
  const id = `${Date.now()}`;
   
  const CardData ={
    imageUrl: document.getElementById("imageurl").value,
    imageTittle: document.getElementById("imagetittle").value,
    imageType: document.getElementById("imagetype").value,
    imageDescription: document.getElementById("imagedescription").value,
    }

cardcontainer.insertAdjacentHTML("beforeend",card({ CardData, id }));
  

state.taskList.push({ CardData, id });

updateLocalStorage();
};















const card = ({CardData,id}) =>
    `<div class="col-lg-4 col-sm-12 col-mb-6" id=${id}>
              <div class="card">
                <div class="card-header d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-success" onclick="editcard.apply(this, arguments)" ><i class="fa-solid fa-pencil"></i></button>
                  <button type="button" class="btn btn-danger" onclick="deleteTask.apply(this, arguments)" ><i class="fa-solid fa-trash"></i></button>
                </div>
                <div class="card-body">
                  <img src=${CardData.imageUrl} class="card-img-top" alt="...">
                  <h5 class="card-title">${CardData.imageTittle}</h5>
                  <p class="card-text">${CardData.imageType}</p>
                  <p class="description trim-3-lines">${CardData.imageDescription}</p>
                </div>
                <div class="card-footer">
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#example" onclick="openTask()" id=${id}>Open Task</button>
                </div>
              </div>

            </div>
`;
 


const modal_body = ({CardData,id}) =>  

             ` <div class="card" id=${id}>
                <div class="card-body">
                  <img src=${CardData.imageUrl} class="card-img-top" alt="...">
                  <h5 class="card-title">${CardData.imageTittle}</h5>
                  <p class="card-text">${CardData.imageType}</p>
                  <p class="description trim-3-lines">${CardData.imageDescription}</p>
                </div>
          
              </div>

            </div>`;



//openCard
const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.taskList.find(({id}) => id === e.target.id);
  modalcontainer.innerHTML = modal_body(getTask);
};

//deleteCard
const deleteTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.getAttribute("name");
  console.log(targetId);
  const type = e.target.tagName;
  console.log(type);
  const removeTask = state.taskList.filter(({ id }) => id !== targetId);
  console.log(removeTask);
  updateLocalStorage();

  if (type === "BUTTON") {
    // console.log(e.target.parentNode.parentNode.parentNode.parentNode);
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  } else if (type === "I") {
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

//EditCard
const editTask = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  // taskTitle = parentNode.childNodes[3].childNodes[7].childNodes;
  // console.log(taskTitle);

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];

  // console.log(taskTitle, taskDescription, taskType, submitButton);

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

// save edit
const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  // console.log(parentNode.childNodes)

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };
  let stateCopy = state.taskList;

  stateCopy = stateCopy.map((task) =>
    task.id === targetId
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDescription,
          type: updateData.taskType,
          url: task.url,
        }
      : task
  );
  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

// search
const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }
  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

  // console.log(resultData);
  resultData.map(
    (cardData) =>
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
    // taskContents.insertAdjacentHTML("beforeend", htmlModalContent(cardData))
  );
};