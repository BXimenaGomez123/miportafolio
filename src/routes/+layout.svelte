<script>
import { base } from "$app/paths";
import { page } from "$app/stores";

let pages = [
    { url: "/", title: "Home" },
    { url: "/projects", title: "Projects" },
    { url: "/contact", title: "Contact" },
    { url: "/CV", title: "CV" },
    { url: "/meta", title: "Meta"}
];

let localStorage = globalThis.localStorage ?? {};
let colorScheme = localStorage.colorScheme ?? "light dark";
let root = globalThis?.document?.documentElement;
$: root?.style.setProperty("color-scheme", colorScheme);
$: localStorage.colorScheme = colorScheme;


</script>

<nav>
    {#each pages as p}
    <a
        href={p.url.startsWith("http") ? p.url: `${base}${p.url}`}
        class:current={$page.route.id === p.url}
        target={p.url.startsWith("http") ? "_blank" : undefined}
    >
        {p.title}
    </a>

    {/each}
</nav>
<label class="color-scheme">
    Theme:
    <select bind:value={ colorScheme }>
        <option value="light dark"> Automatic </option>
        <option value="light"> Light </option>
        <option value="dark"> Dark </option>
    </select>
</label>


<slot/>