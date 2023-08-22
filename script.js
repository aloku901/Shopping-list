const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemsFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Event Listener

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemtoDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    if(newItem === '') {
        alert('Please Add an item');
        return;
    }

    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode'); 
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if(checkIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }
    }

    addItemtoDOM(newItem);

    addItemToStorage(newItem);

    checkUI();
    itemInput.value = ''; 
}

function addItemtoDOM(item) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    // console.log(li);

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    itemList.appendChild(li);
}


function createButton(classes) {
    const  button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    // Convert to JSON string and set to local Storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
     } else {
        setItemToEdit(e.target);
        // console.log(e.target);
     }
}

function checkIfItemExists(item) {
    const itemsFromStorage =  getItemsFromStorage();
    return itemsFromStorage.includes(item);
    
}

function setItemToEdit(item) {
    isEditMode = true;
    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    itemInput.value = item.textContent;
    formBtn.style.backgroundColor = "#228b22";

}

function removeItem(item) {
    if (confirm('Are you Sure?')) {
        //remove item for DOM
        item.remove();

        //Remove Item from Storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
        
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);

    }

    localStorage.removeItem('items');                                                                        

    checkUI(); 
}

function filterItems(e) {
    const items = itemList.querySelectorAll('li'); 
    const text = e.target.value.toLowerCase();

    items.forEach((item) => { 
   
        const itemName = item.firstChild.textContent.toLowerCase();
       
        if (itemName.indexOf(text) != -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
        // console.log(itemName);

    });
}

function checkUI() {

    itemInput.value = '';

    const items = itemList.querySelectorAll('li'); 
    console.log(items)
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemsFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemsFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

function init () {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemsFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();

}

init();

