import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

import remarkMath from 'remark-math';
import rehypeKatexSvelte from 'rehype-katex-svelte';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			remarkPlugins: [remarkMath],
			rehypePlugins: [
				rehypeSlug,  // Must run before rehypeKatexSvelte to generate IDs from plain text
				rehypeKatexSvelte,
				[rehypeAutolinkHeadings, { behavior: 'wrap' }]
			],
			layout: {
				// We can define layouts for md files here if needed, 
				// e.g. blog: 'src/routes/blog/post_layout.svelte'
			}
		})
	],
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter({
			// GitHub Pages expects a 404.html for SPA fallback or just error page
			fallback: '404.html'
		}),
		alias: {
			$content: 'src/content'
		},
		paths: {
			// base: process.argv.includes('dev') ? '' : process.env.BASE_PATH // if creating project page
		}
	}
};

export default config;
