/**
 * Created by andrei on 01.08.2017.
 */
export default function (array, className) {
    let menu = document.createElement('ul');
    menu.classList = className;
    let listItems = '';
    array.forEach(function (item) {
        listItems += `<li>${item}</li>`
    })
    menu.innerHTML = listItems;

    return menu;

}