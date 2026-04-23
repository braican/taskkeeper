import PocketBase from 'pocketbase';

const pb = new PocketBase('https://taskkeeper.pockethost.io/');

pb.authStore.onChange(() => {
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false, maxAge: 2592000 }); // 30 days
});

export default pb;
