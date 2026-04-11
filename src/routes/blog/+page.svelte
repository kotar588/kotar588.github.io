<script lang="ts">
    const postFiles = import.meta.glob("/src/content/posts/*.md", {
        eager: true,
    });

    const allPosts = Object.entries(postFiles)
        .map(([path, module]: [string, any]) => {
            const slug = path.split("/").pop()!.replace(".md", "");
            return {
                slug,
                ...(
                    module as {
                        metadata: {
                            title: string;
                            date: string;
                            summary: string;
                            tags?: string[];
                            pinned?: boolean;
                            published?: boolean;
                        };
                    }
                ).metadata,
            };
        })
        .filter((post) => post.published !== false);

    // Find the most recent pinned post
    const pinnedPosts = allPosts.filter((post) => post.pinned);
    const mostRecentPinned =
        pinnedPosts.length > 0
            ? pinnedPosts.sort(
                  (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
              )[0]
            : null;

    // Sort non-pinned posts by date
    const unpinnedPosts = allPosts
        .filter((post) => !post.pinned || post !== mostRecentPinned)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

    // Combine: pinned first, then unpinned
    const posts = mostRecentPinned
        ? [mostRecentPinned, ...unpinnedPosts]
        : unpinnedPosts;

    // Get all unique tags
    const allTags = Array.from(
        new Set(posts.flatMap((post) => post.tags || [])),
    ).sort();

    let selectedTag: string | null = null;

    $: filteredPosts = selectedTag
        ? posts.filter((post) => post.tags?.includes(selectedTag!))
        : posts;

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function toggleTag(tag: string) {
        selectedTag = selectedTag === tag ? null : tag;
    }
</script>

<svelte:head>
    <title>Posts - Kotaro Hironaka</title>
</svelte:head>

<section id="blog-all">
    <h2>Posts</h2>

    {#if allTags.length > 0}
        <div class="tag-filters">
            <button
                class="tag-filter {selectedTag === null ? 'active' : ''}"
                on:click={() => (selectedTag = null)}
            >
                All
            </button>
            {#each allTags as tag}
                <button
                    class="tag-filter {selectedTag === tag ? 'active' : ''}"
                    on:click={() => toggleTag(tag)}
                >
                    {tag}
                </button>
            {/each}
        </div>
    {/if}

    <ul class="item-list">
        {#each filteredPosts as post}
            <li>
                <span class="item-date">{formatDate(post.date)}</span>
                <a href="/blog/{post.slug}" class="item-title"
                    >{post.pinned ? "📌 " : ""}{post.title}</a
                >
                <p class="item-content">{post.summary}</p>
                {#if post.tags && post.tags.length > 0}
                    <div class="post-tags">
                        {#each post.tags as tag}
                            <span
                                class="tag"
                                on:click={() => toggleTag(tag)}
                                on:keydown={(e) =>
                                    e.key === "Enter" && toggleTag(tag)}
                                role="button"
                                tabindex="0"
                            >
                                {tag}
                            </span>
                        {/each}
                    </div>
                {/if}
            </li>
        {/each}
    </ul>
</section>
