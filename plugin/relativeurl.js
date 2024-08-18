export default function relativeUrl() {
    return {
        name: 'relative-url',
        transformIndexHtml(html) {
            return html.replace(/href="\/([^"]*)"/g, 'href="./$1"').replace(/src="\/([^"]*)"/g, 'src="./$1"');
        }
    };
  }
  