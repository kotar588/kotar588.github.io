<script lang="ts">
    import bibText from "$content/references.bib?raw";

    interface BibEntry {
        type: string;
        key: string;
        title?: string;
        author?: string;
        year?: string;
        journal?: string;
        booktitle?: string;
        howpublished?: string;
        volume?: string;
        pages?: string;
        note?: string;
        doi?: string;
        url?: string;
        keywords?: string;
        [key: string]: string | undefined;
    }

    interface Categories {
        journals: BibEntry[];
        international: BibEntry[];
        domestic: BibEntry[];
        workshops: BibEntry[];
    }

    function parseBibTeX(text: string): BibEntry[] {
        const entries: BibEntry[] = [];
        const entryRegex = /@(\w+)\s*{([^,]+),([^@]+)}/g;
        let match;

        while ((match = entryRegex.exec(text)) !== null) {
            const type = match[1];
            const key = match[2].trim();
            const body = match[3];

            const entry: BibEntry = { type, key };

            // Parse fields - improved regex to handle unquoted values properly
            // Matches: fieldname = {value} OR "value" OR unquoted_value
            const looseFieldRegex =
                /(\w+)\s*=\s*(?:{([^}]*)}|"([^"]*)"|([^,\n]+?))\s*(?:,|\n|$)/g;

            let fieldMatch;
            while ((fieldMatch = looseFieldRegex.exec(body)) !== null) {
                const fieldName = fieldMatch[1].toLowerCase();
                const value = fieldMatch[2] || fieldMatch[3] || fieldMatch[4];
                if (value) {
                    entry[fieldName] = value.trim();
                }
            }
            entries.push(entry);
        }
        return entries;
    }

    function categorizeEntries(entries: BibEntry[]): Categories {
        const categories: Categories = {
            journals: [],
            international: [],
            domestic: [],
            workshops: [],
        };

        entries.forEach((entry) => {
            const keywords = (entry.keywords || "")
                .toLowerCase()
                .split(",")
                .map((k: string) => k.trim());

            if (keywords.includes("journal")) {
                categories.journals.push(entry);
            } else if (keywords.includes("international")) {
                categories.international.push(entry);
            } else if (keywords.includes("domestic")) {
                categories.domestic.push(entry);
            } else if (keywords.includes("workshop")) {
                categories.workshops.push(entry);
            }
        });

        // Sort each category by year (descending)
        (Object.keys(categories) as (keyof Categories)[]).forEach((key) => {
            categories[key].sort(
                (a, b) => (Number(b.year) || 0) - (Number(a.year) || 0),
            );
        });

        return categories;
    }

    function renderEntry(entry: BibEntry) {
        return {
            title: entry.title || "Untitled",
            author: entry.author
                ? entry.author.replace(/ and /g, ", ")
                : "Unknown Author",
            year: entry.year || "N/A",
            venue:
                entry.journal ||
                entry.booktitle ||
                entry.howpublished ||
                "Preprint",
            volume: entry.volume,
            pages: entry.pages,
            note: entry.note,
            doi: entry.doi,
            url: entry.url,
        };
    }

    let entries = parseBibTeX(bibText);
    let categorized = categorizeEntries(entries);
</script>

<svelte:head>
    <title>Publications - Hironaka Kotaro</title>
</svelte:head>

<!-- Journal Articles -->
{#if categorized.journals.length > 0}
    <section id="journals">
        <h2>Journal Articles</h2>
        <ul class="item-list">
            {#each categorized.journals as entry}
                {@const pub = renderEntry(entry)}
                <li>
                    <span class="item-title">"{pub.title}"</span>
                    <p class="item-content">
                        {pub.author} ({pub.year}). <br />
                        <em>{pub.venue}</em>.
                        {#if pub.volume}Vol. {pub.volume},{/if}
                        {#if pub.pages}pp. {pub.pages}.{/if}
                        {#if pub.note}({pub.note}){/if}
                        {#if pub.doi}
                            <br /><a
                                href="https://doi.org/{pub.doi}"
                                target="_blank">DOI: {pub.doi}</a
                            >
                        {/if}
                        {#if pub.url}
                            <br /><a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer">{pub.url}</a
                            >
                        {/if}
                    </p>
                </li>
            {/each}
        </ul>
    </section>
{/if}

<!-- International Conferences -->
{#if categorized.international.length > 0}
    <section id="international">
        <h2>International Conferences</h2>
        <ul class="item-list">
            {#each categorized.international as entry}
                {@const pub = renderEntry(entry)}
                <li>
                    <span class="item-title">"{pub.title}"</span>
                    <p class="item-content">
                        {pub.author} ({pub.year}). <br />
                        <em>{pub.venue}</em>.
                        {#if pub.volume}Vol. {pub.volume},{/if}
                        {#if pub.pages}pp. {pub.pages}.{/if}
                        {#if pub.note}({pub.note}){/if}
                        {#if pub.doi}
                            <br /><a
                                href="https://doi.org/{pub.doi}"
                                target="_blank">DOI: {pub.doi}</a
                            >
                        {/if}
                        {#if pub.url}
                            <br /><a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer">{pub.url}</a
                            >
                        {/if}
                    </p>
                </li>
            {/each}
        </ul>
    </section>
{/if}

<!-- Domestic Conferences -->
{#if categorized.domestic.length > 0}
    <section id="domestic">
        <h2>Domestic Conferences</h2>
        <ul class="item-list">
            {#each categorized.domestic as entry}
                {@const pub = renderEntry(entry)}
                <li>
                    <span class="item-title">"{pub.title}"</span>
                    <p class="item-content">
                        {pub.author} ({pub.year}). <br />
                        <em>{pub.venue}</em>.
                        {#if pub.volume}Vol. {pub.volume},{/if}
                        {#if pub.pages}pp. {pub.pages}.{/if}
                        {#if pub.note}({pub.note}){/if}
                        {#if pub.doi}
                            <br /><a
                                href="https://doi.org/{pub.doi}"
                                target="_blank">DOI: {pub.doi}</a
                            >
                        {/if}
                        {#if pub.url}
                            <br /><a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer">{pub.url}</a
                            >
                        {/if}
                    </p>
                </li>
            {/each}
        </ul>
    </section>
{/if}

<!-- Workshop / Academic Presentations -->
{#if categorized.workshops.length > 0}
    <section id="workshops">
        <h2>Workshop / Academic Presentations</h2>
        <ul class="item-list">
            {#each categorized.workshops as entry}
                {@const pub = renderEntry(entry)}
                <li>
                    <span class="item-title">"{pub.title}"</span>
                    <p class="item-content">
                        {pub.author} ({pub.year}). <br />
                        <em>{pub.venue}</em>.
                        {#if pub.volume}Vol. {pub.volume},{/if}
                        {#if pub.pages}pp. {pub.pages}.{/if}
                        {#if pub.note}({pub.note}){/if}
                        {#if pub.doi}
                            <br /><a
                                href="https://doi.org/{pub.doi}"
                                target="_blank">DOI: {pub.doi}</a
                            >
                        {/if}
                        {#if pub.url}
                            <br /><a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer">{pub.url}</a
                            >
                        {/if}
                    </p>
                </li>
            {/each}
        </ul>
    </section>
{/if}

{#if entries.length === 0}
    <section>
        <p>No publications found.</p>
    </section>
{/if}
