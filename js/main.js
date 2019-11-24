/*
    DONE: Add add note function
    DONE: Add checked/unchecked function
    DONE: Add delete function
    DONE: Add edit function
    DONE: Add Search function
    DONE: Add filter All/Incomplete/Complete function

    TODO: Animate Search Icon (spin)
*/

// -- DECLARATIONS -- //
const btn_Add = document.querySelector(".btn-add");
var form = document.querySelector(".main-form");
var txt_add = document.querySelector(".txt-add-note");
var searchbox = document.querySelector(".searchbox");
var filter = document.querySelector("#filter");

// -- EVENT LISTENERS -- //
btn_Add.addEventListener("click", Add);
form.addEventListener("click", FormClickEvent);

// Prevents default form behaviour on Submit(ENTER PRESS)
form.addEventListener("submit", function(e) {
  e.preventDefault();
});

// Adds a new note when enter is pressed in the add note textbox
txt_add.addEventListener("keyup", function(e) {
  if (e.keyCode == 13) {
    Add();
  }
});

// Adds the placeholder when the searchbox is IN FOCUS
searchbox.addEventListener("focus", function(e) {
  searchbox.setAttribute("placeholder", "Search...");
});

// Removes the text, placeholder,and displays APPROPRIATE items when the searchbox goes OUT OF FOCUS
searchbox.addEventListener("focusout", function(e) {
  searchbox.value = null;
  searchbox.removeAttribute("placeholder");

  var itemList = document.querySelector(".todo-items");
  var items = itemList.querySelectorAll(".item");

  // Determines which items to display
  if (document.querySelector("#filter").value == "All") {
    //Display ALL items again IF ALL filter is applied, once the searchbox is out of focus
    Array.from(items).forEach(function(item) {
      item.parentElement.parentElement.style.display = "flex";
    });
  } else if (document.querySelector("#filter").value == "Undone") {
    //Display UNDONE items again IF UNDONE filter is applied, once the searchbox is out of focus
    Array.from(items).forEach(function(item) {
      var itemClassList = item.parentElement.previousElementSibling.classList;
      if (itemClassList.contains("btn-unchecked")) {
        item.parentElement.parentElement.style.display = "flex";
      }
    });
  } else if (document.querySelector("#filter").value == "Done") {
    //Display DONE items again IF DONE filter is applied, once the searchbox is out of focus
    Array.from(items).forEach(function(item) {
      var itemClassList = item.parentElement.previousElementSibling.classList;
      if (itemClassList.contains("btn-checked")) {
        item.parentElement.parentElement.style.display = "flex";
      }
    });
  }
});

// Search through items
searchbox.addEventListener("keyup", Search);

//Filter through items
filter.addEventListener("input", Filter);

//FUNCTIONS
function Add(e) {
  var userInput = document.querySelector(".txt-add-note").value;

  //Main Parent
  const todo_items = document.querySelector(".todo-items");

  //todo-items child - li
  const li = document.createElement("li");

  //Li child - btn-unchecked
  const btn_unchecked = document.createElement("div");
  btn_unchecked.className = "btn-unchecked btn-toggle";

  //list-box parent
  const item_box = document.createElement("div");
  item_box.className = "item-box";

  //list-box child - item
  const item = document.createElement("div");
  item.className = "item";
  item.appendChild(document.createTextNode(userInput));
  //list-box child - btn-delete
  const btn_delete = document.createElement("div");
  btn_delete.className = "btn-delete";

  todo_items.appendChild(li);
  li.appendChild(btn_unchecked);
  li.appendChild(item_box);
  item_box.appendChild(item);
  item_box.appendChild(btn_delete);

  item.contentEditable = true;
  document.querySelector(".txt-add-note").value = null; //Clears text field

  // if DONE filter is applied, reload only DONE items
  var itemList = document.querySelector(".todo-items");
  var items = itemList.querySelectorAll(".item");
  if (document.querySelector("#filter").value == "Done") {
    ArrayFilter(items, "btn-checked", "flex", "none");
  }
}

function FormClickEvent(e) {
  //Get items for reloading purposes
  var itemList = document.querySelector(".todo-items");
  var items = itemList.querySelectorAll(".item");

  // CHECK/UNCHECK
  if (e.target.classList.contains("btn-toggle")) {
    if (e.target.classList.contains("btn-unchecked")) {
      e.target.classList.remove("btn-unchecked");
      e.target.classList.add("btn-checked");

      // if UNDONE filter is applied, RELOAD ONLY UNDONE ITEMS
      if (document.querySelector("#filter").value == "Undone") {
        ArrayFilter(items, "btn-unchecked", "flex", "none");
      }
    } else if (e.target.classList.contains("btn-checked")) {
      e.target.classList.remove("btn-checked");
      e.target.classList.add("btn-unchecked");

      // if DONE filter is applied, RELOAD ONLY DONE ITEMS
      if (document.querySelector("#filter").value == "Done") {
        ArrayFilter(items, "btn-checked", "flex", "none");
      }
    }
  }

  // DELETE
  if (e.target.classList.contains("btn-delete")) {
    var li = e.target.parentElement.parentElement;
    li.remove();
  }
}

function Search(e) {
  //Convert user input to lowercase
  var userInput = e.target.value.toLowerCase();

  //Get text in Li's
  var itemList = document.querySelector(".todo-items");
  var items = itemList.querySelectorAll(".item");

  //Filter value used in switch statement
  var filter = document.querySelector("#filter").value;

  switch (filter) {
    case "All":
      Array.from(items).forEach(function(item) {
        var itemText = item.firstChild.textContent;
        if (itemText.toLowerCase().indexOf(userInput) != -1) {
          item.parentElement.parentElement.style.display = "flex";
        } else {
          item.parentElement.parentElement.style.display = "none";
        }
      });
      break;
    case "Undone":
      Array.from(items).forEach(function(item) {
        var itemText = item.firstChild.textContent;
        var itemClassList = item.parentElement.previousElementSibling.classList;
        if (
          itemClassList.contains("btn-unchecked") &&
          itemText.toLowerCase().indexOf(userInput) != -1
        ) {
          item.parentElement.parentElement.style.display = "flex";
        } else {
          item.parentElement.parentElement.style.display = "none";
        }
      });
      break;
    case "Done":
      Array.from(items).forEach(function(item) {
        var itemText = item.firstChild.textContent;
        var itemClassList = item.parentElement.previousElementSibling.classList;
        if (
          itemClassList.contains("btn-checked") &&
          itemText.toLowerCase().indexOf(userInput) != -1
        ) {
          item.parentElement.parentElement.style.display = "flex";
        } else {
          item.parentElement.parentElement.style.display = "none";
        }
      });
      break;
    default:
      console.log("Default");
  }
}

function Filter(e) {
  //Get items
  var itemList = document.querySelector(".todo-items");
  var items = itemList.querySelectorAll(".item");

  //Filter
  switch (e.target.value) {
    case "All":
      ArrayFilter(items, "btn-toggle", "flex", "none");
      break;
    case "Undone":
      ArrayFilter(items, "btn-unchecked", "flex", "none");
      break;
    case "Done":
      ArrayFilter(items, "btn-checked", "flex", "none");
      break;
    default:
      console.log("Default");
  }
}

// Function to Modularise filtering through the array
function ArrayFilter(array, state, styleIf, styleElse) {
  Array.from(array).forEach(function(item) {
    if (item.parentElement.previousElementSibling.classList.contains(state)) {
      item.parentElement.parentElement.style.display = styleIf;
    } else {
      item.parentElement.parentElement.style.display = styleElse;
    }
  });
}
