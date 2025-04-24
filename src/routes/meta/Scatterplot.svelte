
<h2>
    comits by time and date
    </h2>
    <script>
        import * as d3 from "d3";
        import { onMount } from "svelte";
        import Bar from '$lib/Bar.svelte';
        import {
            computePosition,
            autoPlacement,
            offset,
        } from '@floating-ui/dom';
    
    
        let data = [];
    
        let commits = [];
    
        let width = 1000, height = 600;
    
        let yAxisGridlines;
    
        let cursor = {x: 0, y: 0};
    
        let clickedCommits = [];
    
    
        let hoveredIndex = -1;
        $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};
    
        let commitTooltip;
    
        let tooltipPosition = {x: 0, y: 0};
        
        let commitProgress = 100;
    
        let commitMaxTime = new Date(); 
        let minDate, maxDate;
    
        
    
        async function dotInteraction (index, evt) {
            let hoveredDot = evt.target;
            if (evt.type === "mouseenter") {
                hoveredIndex = index;
                cursor = {x: evt.x, y: evt.y};
                tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
                    strategy: "fixed", // because we use position: fixed
                    middleware: [
                        offset(5), // spacing from tooltip to dot
                        autoPlacement() // see https://floating-ui.com/docs/autoplacement
                    ],
                });        }
            else if (evt.type === "mouseleave") {
                hoveredIndex = -1
            }
            else if (evt.type === "click") {
                let commit = commits[index]
                if (!clickedCommits.includes(commit)) {
                    // Add the commit to the clickedCommits array
                    clickedCommits = [...clickedCommits, commit];
                }
                else {
                        // Remove the commit from the array
                        clickedCommits = clickedCommits.filter(c => c !== commit);
                }
            }
    
        }
    
    
        onMount(async () => {
                data = await d3.csv("./loc.csv", row => ({
                    ...row,
                    line: Number(row.line), // or just +row.line
                    depth: Number(row.depth),
                    length: Number(row.length),
                    date: new Date(row.date + "T00:00" + row.timezone),
                    datetime: new Date(row.datetime)
                }));
                commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
                let first = lines[0];
                let {author, date, time, timezone, datetime} = first;
                let ret = {
                    id: commit,
                    url: "https://github.com/BXimenaGomez/miportafolio/commit/" + commit,
                    author, date, time, timezone, datetime,
                    hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                    totalLines: lines.length
                };
    
                // Like ret.lines = lines
                // but non-enumerable so it doesn’t show up in JSON.stringify
                Object.defineProperty(ret, "lines", {
                    value: lines,
                    configurable: true,
                    writable: true,
                    enumerable: false,
                });
    
            return ret;
        });
    
    
    });
    
    $: minDate = d3.min(commits.map(d => d.date));
    $: maxDate = d3.max(commits.map(d => d.date));
    $: maxDatePlusOne = new Date(maxDate);
    $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);
    $: filteredCommits = commits.filter(commit => new Date(commit.datetime) <= commitMaxTime);
    $: filteredLines = data.filter(line => new Date(line.datetime) <= commitMaxTime);
    
    $: allTypes = Array.from(new Set(data.map(d => d.type)));
    
    $: xScale = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, width]);
                
    
    $: yScale = d3.scaleLinear()
                  .domain([24, 0])
                  .range([usableArea.bottom, usableArea.top]);
    
    $: rScale = d3.scaleSqrt()
                    .domain(d3.extent(commits.map(d=>d.totalLines)))
                    .range([2, 30]);
    
    
    $: timeScale = d3.scaleTime().domain([minDate,maxDate]).range([0,100]);
    $: commitMaxTime = timeScale.invert(commitProgress);
    
    
    
    let margin = {top: 10, right: 10, bottom: 30, left: 20};
    
    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
    let xAxis, yAxis;
    $: selectedLines = (clickedCommits.length > 0 ? clickedCommits : commits).flatMap(d => d.lines);
    
    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale));
        d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
    
    }
    
    $: {
        d3.select(yAxisGridlines).call(
            d3.axisLeft(yScale)
              .tickFormat("")
              .tickSize(-usableArea.width)
        );
    }
    
    $: selectedCounts = d3.rollup(
        selectedLines,
        v => v.length,
        d => d.type
    );
    $: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);
    
    
    </script>
    
    <dl class= "info tooltip" hidden={hoveredIndex === -1} bind:this={commitTooltip} style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px"
    >
        
    
        <dt>Commit</dt>
        <dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>
    
        <dt>Date</dt>
        <dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>
    
        <dt>Author</dt>
        <dd>{ hoveredCommit.author }</dd>
    
        <dt>Time</dt>
        <dd>{ hoveredCommit.time }</dd>
        
    
        <!-- Add: Time, author, lines edited -->
    </dl>
    
    <div class="slider-container">
        <div class="slider">
            <label for="slider">Show commits until:</label>
            <input type="range" id="slider" name="slider" min=0 max=100 bind:value={commitProgress}/>
        </div>
        <time class="time-label">{commitMaxTime.toLocaleString()}</time>
    </div>
    
    <svg viewBox="0 0 {width} {height}">
        <g class="dots">
            <!-- {#each commits as commit, index } -->
            {#each filteredCommits as commit, index (commit.id) }
    
                <circle
                
                    on:mouseenter={evt => dotInteraction(index, evt)}
                    on:mouseleave={evt => dotInteraction(index, evt)}
                    on:click={ evt => dotInteraction(index, evt) }
                    class:selected={ clickedCommits.includes(commit) }
                    cx={ xScale(commit.datetime) }
                    cy={ yScale(commit.hourFrac) }
                    r={ rScale(commit.totalLines) }
                    fill="steelblue"
                    fill-opacity="0.5"
                />
                <Bar data={languageBreakdown} width={width} />
    
            {/each}
        </g>
        <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
    
        <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
        <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
        
    
    </svg>
    
    
    
    
    <section>
        <h2>Summary</h2>
        <dl class="stats">
        <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
        <dd>{data.length}</dd>
        <dt>Files</dt>
        <dd>{d3.groups(data, d => d.file).length}</dd>
        <dt>Commits</dt>
        <dd>{d3.groups(data, d => d.commit).length}</dd>
        </dl>
        <dl class="info tooltip" hidden={hoveredIndex === -1}>
    </section>
    
    <style>
        svg {
            overflow: visible;
        }
        dl{
            display: grid;
            grid-template-columns: auto;
        }
        dt{
            grid-row: 1;
            font-family: inherit;
            font-weight: bold;
            color: var(--border-gray);
            text-transform: uppercase;
        }
        dd{
            font-family: inherit;
            font-weight: bold;
        }
        section{
            border-width:0.15em;
            border-style:solid;
            border-color:var(--border-gray);
            padding-left: 1em;
            padding-right: 1em;
        }
        .gridlines {
            stroke-opacity: .2;
        }
        .info{
            display: grid;
            margin:0;
            grid-template-columns: 2;
            background-color: oklch(100% 0% 0 / 80%);
            box-shadow: 1px 1px 3px 3px gray;
            border-radius: 5px;
            backdrop-filter: blur(10px);
            padding:10px;
            transition-duration: 500ms;
            transition-property: opacity, visibility;
    
            &[hidden]:not(:hover, :focus-within) {
                opacity: 0;
                visibility: hidden;
            }
        }
    
    
        .info dt{
            grid-column:1;
            grid-row:auto;
        }
    
        .info dd{
            grid-column:2;
            grid-row:auto;
            font-weight: 400;
        }
    
        .tooltip{
            position: fixed;
            top: 1em;
            left: 1em;
        }
        circle {
            transition: 200ms;
            
            @starting-style {
                r: 0;
            }
    
            &:hover {
                transform: scale(1.5);
            }
            transform-origin: center;
            transform-box: fill-box;
    
        }
        .selected {
            fill: var(--color-accent);
        }
        .slider-container{
            display:grid;
        }
        .slider{
            display: flex;
        }
        #slider{
            flex:1;
        }
        .time-label{
            font-size: 0.75em;
            text-align: right;
        }
    
    
    </style>
    
    