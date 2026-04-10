<script>
    import { page } from "$app/stores";
    import { onMount, onDestroy } from "svelte";

    let isMenuOpen = false;
    let isDarkMode = false;
    let clockDate = "";
    let clockTime = "";
    /** @type {ReturnType<typeof setInterval> | undefined} */
    let clockInterval;

    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // function updateClock() {
    //     // UTC-12: subtract 12 hours from UTC
    //     const now = new Date();
    //     const utc12 = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    //     const yy = String(utc12.getUTCFullYear()).slice(-2);
    //     const mm = String(utc12.getUTCMonth() + 1).padStart(2, "0");
    //     const dd = String(utc12.getUTCDate()).padStart(2, "0");
    //     const hh = String(utc12.getUTCHours()).padStart(2, "0");
    //     const min = String(utc12.getUTCMinutes()).padStart(2, "0");
    //     const ss = String(utc12.getUTCSeconds()).padStart(2, "0");
    //     const day = DAYS[utc12.getUTCDay()];
    //     clockText = `${yy}/${mm}/${dd} ${hh}:${min}:${ss} (${day})`;
    // }

    function updateClock() {
        // UTC-12: subtract 12 hours from UTC
        const now = new Date();
        const utc12 = new Date(now.getTime() - 12 * 60 * 60 * 1000);

        // if dd is below 10, remove 0
        // add th
        // const dd = String(utc12.getUTCDate()).padStart(2, "0");
        const dd = String(utc12.getUTCDate());

        const hh = String(utc12.getUTCHours()).padStart(2, "0");
        const min = String(utc12.getUTCMinutes()).padStart(2, "0");
        const day = DAYS[utc12.getUTCDay()];
        const month = MONTHS[utc12.getUTCMonth()];

        clockDate = `${day} ${month} ${dd}th`;
        clockTime = `${hh}:${min}`;
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        const theme = isDarkMode ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

    onMount(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem("theme") || "light";
        isDarkMode = savedTheme === "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);

        updateClock();
        clockInterval = setInterval(updateClock, 1000);
    });

    onDestroy(() => {
        if (clockInterval) clearInterval(clockInterval);
    });
</script>

<header>
    <div class="container">
        <nav>
            <div style="display: flex; align-items: center; gap: 15px;">
                <a href="/" class="logo">Keisuke Onoue</a>
                <button
                    class="theme-toggle"
                    aria-label="Toggle dark mode"
                    on:click={toggleTheme}
                >
                    {#if isDarkMode}
                        <i class="fas fa-sun"></i>
                    {:else}
                        <i class="fas fa-moon"></i>
                    {/if}
                </button>
                <span class="header-clock"
                    ><span class="clock-date">{clockDate}</span>
                    <span class="clock-time">{clockTime}</span></span
                >
            </div>
            <button
                class="hamburger"
                aria-label="Toggle navigation"
                on:click={toggleMenu}
            >
                <i class="fas fa-hamburger"></i>
            </button>
            {#if isMenuOpen}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="menu-overlay" on:click={closeMenu}></div>
            {/if}
            <ul class="nav-links" class:active={isMenuOpen}>
                <li>
                    <a
                        href="/"
                        class:active={$page.url.pathname === "/"}
                        on:click={closeMenu}>Home</a
                    >
                </li>
                <li>
                    <a
                        href="/news"
                        class:active={$page.url.pathname.startsWith("/news")}
                        on:click={closeMenu}>News</a
                    >
                </li>
                <li>
                    <a
                        href="/blog"
                        class:active={$page.url.pathname.startsWith("/blog")}
                        on:click={closeMenu}>Posts</a
                    >
                </li>
                <li>
                    <a
                        href="/publications"
                        class:active={$page.url.pathname.startsWith(
                            "/publications",
                        )}
                        on:click={closeMenu}>Publications</a
                    >
                </li>
                <li>
                    <a
                        href="/softwares"
                        class:active={$page.url.pathname.startsWith(
                            "/softwares",
                        )}
                        on:click={closeMenu}>Softwares</a
                    >
                </li>
            </ul>
        </nav>
    </div>
</header>
