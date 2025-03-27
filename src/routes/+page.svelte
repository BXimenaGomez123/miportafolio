
<h1>Ximena Beatriz Gomez Flores</h1>

<p>Hello world</p>
<img src="images/1689641970143.jpg" width="300" height="400"  alt="Yo">


{#await fetch("https://api.github.com/users/BXimenaGomez123")}
  <p>Loading...</p>
{:then response}
  {#await response.json()}
    <p>Decoding...</p>
  {:then data} 
    <section>
      <h2>My Github Stats</h2>
      <dl>
        <dt>Followers</dt>
        <dd>{data.followers}</dd>
        <dt>Following</dt>
        <dd>{data.following}</dd>
        <dt>Public Repos</dt>
        <dd>{data.public_repos}</dd> 
      </dl>
    </section>  
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
  {/await}
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
{/await}
