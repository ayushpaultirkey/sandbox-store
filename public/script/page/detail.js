import "@style/main.css";
import H12 from "@library/h12";
import urlparse from "@library/urlparse";
import dispatcher from "@library/dispatcher";

const { fs, path, electron, axios, express, http, directory, bundle } = window.plugin;

@Component
export default class Detail extends H12 {
    constructor() {
        super();
        this.packageData = null;
        this.downloadURL = null;
    }
    async init() {

        this.set("{i.size}", "");
        this.set("{i.version}", "");
        this.set("{i.publish}", "");
        this.set("{i.install}", "Install");

        dispatcher.on("onPackageSelected", this.onPackageSelected.bind(this));

    }
    async render() {
        return <>
            <div class="w-full h-full p-8 px-10 space-y-4 flex flex-col">

                <div class="flex flex-row space-x-4">
                    <div class="w-24 h-24 bg-zinc-700 rounded-lg bg-cover bg-no-repeat bg-center" id="icon"></div>
                    <div class="flex flex-col space-y-1">
                        <label class="text-zinc-300 text-xl">{name}</label>
                        <button class="bg-blue-500 hover:bg-blue-600 text-xs p-1 px-6 rounded-md font-semibold" onclick={ this.installApp } disabled id="installButton"><i class="fa fa-download mr-2"></i>{i.install} {i.version}</button>
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

        const { installButton } = this.element;
        installButton.setAttribute("disabled", true);

        try {
            if(this.downloadURL && this.packageData) {

                this.set("{i.install}", "Installing");
    
                await bundle.install(this.downloadURL, {});
    
                const installed = await bundle.getInstalled();
                this.set("{i.install}", (installed[this.packageData.id]) ? "Installed" : "Install");
    
            }
        }
        catch(error) {
            this.set("{i.install}", "Install");
            alert(error);
        }

        installButton.removeAttribute("disabled");

    }
    async loadRelease(url) {
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

            const { installButton } = this.element;
            installButton.removeAttribute("disabled");

        }
        catch(error) {
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
                    return `<img src="${ `${url}/${token.href}` }" />`;
                }
            });
            description.innerHTML = marked.parse(data);

        }
        catch(error) {
            description.innerText = "Unable to load readme";
            console.error(error);
        }

    }
    async loadDetail(url, branch) {
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
    async onPackageSelected(e, data) {
        if(data) {

            const { id, name, repository: { url, branch } } = data;

            this.packageData = data;
            this.downloadURL = null;

            const { installButton, description } = this.element;
            installButton.setAttribute("disabled", "true");
            description.innerHTML = "";

            this.set("{i.size}", "");
            this.set("{i.version}", "");
            this.set("{i.publish}", "");

            this.set("{name}", name);
            this.loadDetail(url, branch);

            const installed = await bundle.getInstalled();
            this.set("{i.install}", (installed[id]) ? "Installed" : "Install");

        }
    }
}