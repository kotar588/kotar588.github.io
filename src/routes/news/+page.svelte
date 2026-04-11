<script lang="ts">
    import newsData from "$content/news.json";

    interface NewsItem {
        date: string;
        content: string;
        pinned?: boolean;
    }

    const newsItems = newsData as NewsItem[];

    // Find the most recent pinned item
    const pinnedItems = newsItems.filter((item) => item.pinned);
    const mostRecentPinned =
        pinnedItems.length > 0
            ? pinnedItems.sort(
                  (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
              )[0]
            : null;

    // Sort non-pinned items by date
    const unpinnedItems = newsItems
        .filter((item) => !item.pinned || item !== mostRecentPinned)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

    // Combine: pinned first, then unpinned
    const sortedNews = mostRecentPinned
        ? [mostRecentPinned, ...unpinnedItems]
        : unpinnedItems;

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
</script>

<svelte:head>
    <title>News - Kotaro Hironaka</title>
</svelte:head>

<section id="news-all">
    <h2>News</h2>

    <ul class="item-list">
        {#each sortedNews as item}
            <li>
                <span class="item-date">{formatDate(item.date)}</span>
                <span class="item-content"
                    >{item.pinned ? "📌 " : ""}{item.content}</span
                >
            </li>
        {/each}
    </ul>

    {#if sortedNews.length === 0}
        <p>No news found.</p>
    {/if}
</section>
