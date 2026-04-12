<script lang="ts">
    import { onMount } from "svelte";
    import bioData from "$content/bio.json";
    import newsData from "$content/news.json";

    // Import all images from content/images
    const imageModules = import.meta.glob("/src/content/images/*.webp", {
        eager: true,
        query: "?url",
        import: "default",
    });
    const images = Object.values(imageModules) as string[];
    const hasImages = images.length > 0;

    // Import all markdown files to display latest blog posts
    const postFiles = import.meta.glob("/src/content/posts/*.md", {
        eager: true,
    });

    interface PostModule {
        metadata: {
            title: string;
            date: string;
            summary: string;
            pinned?: boolean;
            published?: boolean;
        };
    }

    // Process blog posts
    const allBlogPosts = Object.entries(postFiles)
        .map(([path, module]) => {
            const slug = path.split("/").pop()?.replace(".md", "") || "";
            return {
                slug,
                ...(module as PostModule).metadata,
            };
        })
        .filter((post) => post.published !== false);

    // Find the most recent pinned post
    const pinnedBlogPosts = allBlogPosts.filter((post) => post.pinned);
    const mostRecentPinnedPost =
        pinnedBlogPosts.length > 0
            ? pinnedBlogPosts.sort(
                  (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
              )[0]
            : null;

    // Sort non-pinned posts by date
    const unpinnedBlogPosts = allBlogPosts
        .filter((post) => !post.pinned || post !== mostRecentPinnedPost)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

    // Combine: pinned first, then unpinned
    const posts = mostRecentPinnedPost
        ? [mostRecentPinnedPost, ...unpinnedBlogPosts]
        : unpinnedBlogPosts;

    // Sort news with pinned logic
    const newsItems = newsData as Array<{
        date: string;
        content: string;
        pinned?: boolean;
    }>;
    const pinnedNews = newsItems.filter((item) => item.pinned);
    const mostRecentPinnedNews =
        pinnedNews.length > 0
            ? pinnedNews.sort(
                  (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
              )[0]
            : null;
    const unpinnedNews = newsItems
        .filter((item) => !item.pinned || item !== mostRecentPinnedNews)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    const sortedNews = mostRecentPinnedNews
        ? [mostRecentPinnedNews, ...unpinnedNews]
        : unpinnedNews;

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    // Image carousel state - random sampling without replacement
    let imageQueue: number[] = [];
    let currentImageIndex = 0;
    let isHovering = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    // Fisher-Yates shuffle algorithm
    function shuffleArray(array: number[]): number[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Initialize the queue with shuffled indices
    function initializeQueue() {
        if (!hasImages) return;

        const indices = Array.from({ length: images.length }, (_, i) => i);
        imageQueue = shuffleArray(indices);
        currentImageIndex = imageQueue[0] ?? 0;
    }

    // Get next image in queue
    function getNextImage() {
        if (!hasImages) return;

        imageQueue.shift();

        // If queue is empty, reshuffle and start over
        if (imageQueue.length === 0) {
            const indices = Array.from({ length: images.length }, (_, i) => i);
            imageQueue = shuffleArray(indices);
        }

        currentImageIndex = imageQueue[0] ?? 0;
    }

    // Get previous image
    function getPreviousImage() {
        if (!hasImages) return;

        imageQueue.unshift(currentImageIndex);

        const previousPos = (currentImageIndex - 1 + images.length) % images.length;

        currentImageIndex = previousPos;
        imageQueue[0] = previousPos;
    }

    // Navigate to next image (for button click)
    function nextImage() {
        getNextImage();
    }

    // Navigate to previous image (for button click)
    function previousImage() {
        getPreviousImage();
    }

    // Auto-transition every 5 seconds (pauses on hover)
    onMount(() => {
        if (!hasImages) return;

        initializeQueue();

        intervalId = setInterval(() => {
            if (!isHovering) {
                getNextImage();
            }
        }, 5000);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    });

    function handleMouseEnter() {
        isHovering = true;
    }

    function handleMouseLeave() {
        isHovering = false;
    }
</script>

<svelte:head>
    <title>Kotaro Hironaka</title>
</svelte:head>

<!-- Image Carousel -->
{#if images.length > 0}
    <div
        class="carousel-wrapper"
        role="region"
        aria-label="Image carousel"
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
    >
        <div class="image-carousel">
            <img
                src={images[currentImageIndex]}
                alt="Carousel image {currentImageIndex + 1} 
                       of {images.length}"
                class="carousel-image"
            />
        </div>
    </div>
{/if}

<div class="bento-grid">
    <section id="latest-news" class="bento-news">
        <h2>Latest News</h2>
        <ul class="item-list">
            {#each sortedNews.slice(0, 3) as item}
                <li>
                    <span class="item-date">{formatDate(item.date)}</span>
                    <span class="item-content"
                        >{item.pinned ? "📌 " : ""}{item.content}</span
                    >
                </li>
            {/each}
        </ul>
        <div class="view-all">
            <a href="/news" class="btn">View All News</a>
        </div>
    </section>

    <!-- About/Self Introduction Card -->
    {#if bioData.about}
        <section id="about" class="bento-about">
            <h2>About</h2>
            <p>{bioData.about}</p>
        </section>
    {/if}

    <!-- Education Card -->
    {#if bioData.education && bioData.education.length > 0}
        <section id="education" class="bento-education">
            <h2>Education</h2>
            {#each bioData.education as edu}
                <div class="bio-entry">
                    <div class="bio-role">{edu.degree}</div>
                    <div class="bio-institution">
                        {edu.institution}, {edu.period}
                    </div>
                    {#if edu.lab}<div class="bio-lab">{edu.lab}</div>{/if}
                </div>
            {/each}
        </section>
    {/if}

    <!-- Experience Card -->
    {#if bioData.experience && bioData.experience.length > 0}
        <section id="experience" class="bento-experience">
            <h2>Experience</h2>
            {#each bioData.experience as exp}
                <div class="bio-entry">
                    <div class="bio-role">{exp.role}</div>
                    <div class="bio-institution">
                        {exp.institution}, {exp.period}
                    </div>
                </div>
            {/each}
        </section>
    {/if}

    <section id="links-section" class="bento-links">
        <h2>Links</h2>
        <div id="links-content" class="social-links">
            {#if bioData.links.email}
                <a
                    href="mailto:{bioData.links.email.replace('[at]', '@')}"
                    aria-label="Email"
                    class="btn-icon"><i class="fas fa-envelope"></i></a
                >
            {/if}
            {#if bioData.links.github}
                <a
                    href={bioData.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    class="btn-icon"
                    ><i class="fab fa-github"></i></a
                >
            {/if}
            {#if bioData.links.google_scholar}
                <a
                    href={bioData.links.google_scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Google Scholar"
                    class="btn-icon"><i class="fas fa-graduation-cap"></i></a
                >
            {/if}
            {#if bioData.links.orcid}
                <a
                    href={bioData.links.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ORCID"
                    class="btn-icon"
                    ><i class="fab fa-orcid"></i></a
                >
            {/if}
        </div>
    </section>

    <section id="latest-blog" class="bento-blog">
        <h2>Latest Posts</h2>
        <ul class="item-list">
            {#each posts.slice(0, 5) as post}
                <li>
                    <span class="item-date">{formatDate(post.date)}</span>
                    <a href="/blog/{post.slug}" class="item-title"
                        >{post.pinned ? "📌 " : ""}{post.title}</a
                    >
                    <p class="item-content">{post.summary}</p>
                </li>
            {/each}
        </ul>
        <div class="view-all">
            <a href="/blog" class="btn">View All Posts</a>
        </div>
    </section>
</div>
