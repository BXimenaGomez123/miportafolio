/*console.log("IT’S ALIVE!");

function $$ (selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}
let navLinks = $$("nav a");
console.log(navLinks)
[1, 2, 3, 4].find(n => n > 2); // Returns 3

let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
currentLink.classList.add("current");
if (currentLink) { // or if (currentLink !== undefined)
    currentLink.classList.add("current");
}
currentLink?.classList.add("current");*/
let pages = [
    {url:".", title:"home"},
    {url:"contact/", title:"contact"},
    {url:"projects/", title:"projects"},
    {url:"CV/", title:"CV"}
];

let nav = document.createElement("nav");
document.body.prepend(nav);
const ARE_WE_HOME = document.documentElement.classList.contains("home");

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // Create link and add it to nav
    if (!ARE_WE_HOME && !url.startsWith("http")) {
        url = "../" + url;
    }

    let a = document.createElement('a')
    a.href = url;
    a.textContent = title;
    
    if(a.host === location.host && a.pathname === location.pathname){
        a.classList.add("current");
    }

    if(a.host != location.host){
        console.log(a.host, location.host);
        a.setAttribute("target", "_blank");
    }
    
    nav.append(a)
}

