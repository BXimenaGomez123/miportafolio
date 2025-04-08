
<h1>Ximena Beatriz Gomez Flores</h1>

<p>Hello world</p>
<img src="images/1689641970143.jpg" width="300" height="400"  alt="Yo">

<script>
import { onMount } from "svelte";

let githubData = null;
let loading = true;
let error = null;

onMount(async () => {
    try {
        const response = await fetch("https://api.github.com/users/BXimenaGomez123");
        githubData = await response.json();
    } catch (err) {
        error = err;
    }
    loading = false;
});

</script>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p class="error">Something went wrong: {error.message}</p>
{:else}
    <section>
        <h2>My GitHub Stats</h2>
        <dl>
            <dt>Followers</dt>
            <dd>{githubData.followers}</dd>
            <dt>Following</dt>
            <dd>{githubData.following}</dd>
            <dt>Public Repositories</dt>
            <dd>{githubData.public_repos}</dd>
        </dl>
    </section>
{/if}
