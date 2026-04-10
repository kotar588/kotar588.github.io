<script lang="ts">
    export let data;

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
</script>

<svelte:head>
    <title>{data.title} - Keisuke Onoue</title>
</svelte:head>

<article id="blog-post">
    <div class="post-header">
        <a href="/blog" class="back-link"
            ><i class="fas fa-arrow-left"></i> Back to Posts</a
        >
        <h1 class="post-title">{data.title}</h1>
        <div class="post-meta">
            <p class="item-date">{formatDate(data.date)}</p>
            {#if data.tags && data.tags.length > 0}
                <div class="post-tags">
                    {#each data.tags as tag}
                        <a href="/blog" class="tag">{tag}</a>
                    {/each}
                </div>
            {/if}
        </div>
        {#if data.summary}
            <p class="post-summary">{data.summary}</p>
        {/if}
    </div>

    {#if data.headings && data.headings.length > 0}
        <!-- Inline TOC -->
        <nav class="table-of-contents">
            <h2 class="toc-title">Table of Contents</h2>
            <ul class="toc-list">
                {#each data.headings as heading}
                    <li class="toc-item toc-level-{heading.level}">
                        <a href="#{heading.id}">{@html heading.html}</a>
                    </li>
                {/each}
            </ul>
        </nav>
    {/if}

    <div class="post-content">
        <svelte:component this={data.content} />
    </div>
</article>
