//反转义
export const unEscape = (text) => {
    let temp = document.createElement("div");
    temp.innerHTML = text ? text.replace(/<br\/>/g, '\n') : "";
    let output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}