<script>
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import 'katex/dist/katex.min.css';
</script>

<div id="content-wrapper">
    <Header />
    <main class="container">
        <slot />
    </main>
</div>
<Footer />
