export async function enableMocking() {
  const { worker } = await import('@/shared/api/msw/browser');

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
}
