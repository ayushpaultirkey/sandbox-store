import "./../../style/main.css";
import H12 from "@library/h12";
import urlparse from "@library/urlparse";
import dispatcher from "@library/dispatcher";

const { fs, path, electron, axios, express, http, directory, bundle } = window.plugin;

@Component
export default class Detail extends H12 {
    constructor() {
        super();
        this.downloadURL = null;
    }
    async init() {

        this.set("{i.version}", "...");
        this.set("{i.publish}", "...");
        this.set("{i.size}", "...");

        dispatcher.on("OnAppSelected", this.onAppSelected.bind(this));

    }
    async render() {
        return <>
            <div class="w-full h-full p-8 px-10 space-y-4 flex flex-col">

                <div class="flex flex-row space-x-4">
                    <div class="w-24 h-24 bg-zinc-700 rounded-lg bg-cover bg-no-repeat bg-center" id="icon"></div>
                    <div class="flex flex-col space-y-1">
                        <label class="text-zinc-300 text-xl">{name}</label>
                        <button class="bg-blue-500 hover:bg-blue-600 text-xs p-1 px-6 rounded-md font-semibold hidden" onclick={ this.installApp } disabled id="installButton"><i class="fa fa-download mr-2"></i>Install {i.version}</button>
                        <label class="text-zinc-500 text-xs"><b>Published: </b>{i.publish}</label>
                        <label class="text-zinc-500 text-xs"><b>Size: </b>{i.size}</label>
                    </div>
                </div>

                <div class="text-zinc-500 space-y-3 marked" id="description">
                    <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
                </div>

            </div>
        </>;
    }
    async installApp() {
        if(this.downloadURL) {
            await bundle.install(this.downloadURL, {});
        }
    }
    async loadRelease(url) {
        const { installButton } = this.element;
        try {

            const response = await fetch(`${url}/latest`);
            if(!response.ok) {
                throw new Error("Unable to get README.md");
            }

            const { name, assets } = await response.json();
            const { download_count, size, created_at, browser_download_url } = assets[0];
            
            this.set("{i.version}", name);
            this.set("{i.publish}", created_at.split("T")[0]);
            this.set("{i.size}", `${(size / 1000).toFixed(2)} KB`);
            
            this.downloadURL = browser_download_url;

            installButton.removeAttribute("disabled");
            installButton.classList.remove("hidden");

        }
        catch(error) {
            installButton.classList.add("hidden");
            console.error(error);
        }
    }
    async loadIcon(url) {
        try {

            const { icon } = this.element;
            icon.style.backgroundImage = `url(${`${url}/favicon.png`})`;

        }
        catch(error) {
            console.error(error);
        }
    }
    async loadReadme(url) {

        const { description } = this.element;
        try {

            const response = await fetch(`${url}/README.md`);
            if(!response.ok) {
                throw new Error("Unable to get README.md");
            }

            const data = await response.text();
            marked.use({
                image: (token) => {
                    return `<img src="${ `${url}/${token.href}` }"/>`;
                }
            });
            description.innerHTML = marked.parse(data);

        }
        catch(error) {
            description.innerText = "Unable to load readme";
            console.error(error);
        }

    }
    async loadDetail({ url, branch }) {
        try {

            const { user, repository } = urlparse.gitParseURL(url);
            const rawURL = urlparse.gitRawURL(user, repository, branch);
            const releaseURL = urlparse.gitReleaseURL(user, repository);
            
            await this.loadIcon(rawURL);
            await this.loadReadme(rawURL);
            await this.loadRelease(releaseURL);

        }
        catch(error) {
            console.error(error);
        }
    }
    async onAppSelected(e, data) {
        if(data) {

            this.set("{name}", data.name);
            this.loadDetail(data);

        }
    }
}