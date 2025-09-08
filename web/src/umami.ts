// Inject Umami only when env vars are provided
const url = import.meta.env.VITE_UMAMI_URL as string | undefined;
const id = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;
if (url && id) {
  const s = document.createElement('script');
  s.setAttribute('src', url);
  s.setAttribute('data-website-id', id);
  s.setAttribute('defer', '');
  document.head.appendChild(s);
}


