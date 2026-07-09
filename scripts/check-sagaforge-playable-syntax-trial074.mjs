import { readFile } from 'node:fs/promises';

const html = await readFile('playables/sagaforge-app/index.html', 'utf8');
const script = html.split('<script>')[1]?.split('</script>')[0];
if (!script) throw new Error('script block not found');
new Function(script);
console.log('trial074 script syntax ok');
