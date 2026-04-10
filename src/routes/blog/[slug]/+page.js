import { error } from '@sveltejs/kit';
import katex from 'katex';
import GithubSlugger from 'github-slugger';

export function entries() {
    const modules = import.meta.glob('/src/content/posts/*.md');

    return Object.keys(modules).map((path) => ({
        slug: (path.split('/').pop() || '').replace('.md', '')
    }));
}

/**
 * Render inline math in heading text
 * @param {string} text - The text containing inline math expressions
 * @returns {string} The text with math expressions rendered as HTML
 */
function renderMathInText(text) {
    // Match inline math: $...$
    // Use a regex that doesn't match $$...$$
    return text.replace(/\$([^\$]+)\$/g,
        /**
         * @param {string} match - The full matched string
         * @param {string} math - The captured math expression
         * @returns {string} The rendered KaTeX HTML or original match
         */
        (match, math) => {
            try {
                return katex.renderToString(math, {
                    throwOnError: false,
                    displayMode: false
                });
            } catch (e) {
                console.error('KaTeX rendering error:', e);
                return match; // Return original if rendering fails
            }
        }
    );
}

/**
 * Extract headings from markdown content for TOC
 * @param {string} content - The raw markdown content
 * @returns {Array<{level: number, text: string, html: string, id: string}>} Array of heading objects
 */
function extractHeadings(content) {
    const headings = [];
    const lines = content.split('\n');
    const slugger = new GithubSlugger();

    for (const line of lines) {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            // Use github-slugger to generate ID, matching rehypeSlug's behavior
            const id = slugger.slug(text);

            // Render math in the text for display
            const html = renderMathInText(text);

            headings.push({ level, text, html, id });
        }
    }

    return headings;
}

export async function load({ params }) {
    const modules = import.meta.glob('/src/content/posts/*.md', { eager: false, query: '?raw', import: 'default' });
    const componentModules = import.meta.glob('/src/content/posts/*.md');
    const path = `/src/content/posts/${params.slug}.md`;

    if (path in modules && path in componentModules) {
        const rawContent = await modules[path]();
        const post = /** @type {{ default: any, metadata: Record<string, any> }} */ (await componentModules[path]());

        // Extract headings from raw markdown
        const headings = extractHeadings(/** @type {string} */ (rawContent));

        const { title, date, tags, summary, ...rest } = post.metadata;
        return {
            content: post.default,
            headings,
            title,
            date,
            tags,
            summary,
            ...rest
        };
    }

    throw error(404, 'Post not found');
}
