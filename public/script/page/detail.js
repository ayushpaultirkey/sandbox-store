import "./../../style/main.css";
import H12 from "@library/h12";
import urlparse from "@library/urlparse";
import dispatcher from "@library/dispatcher";

const { fs, path, electron, axios, express, http, directory, bundle } = window.plugin;

@Component
export default class Detail extends H12 {
    constructor() {
        super();
    }
    async init() {

        dispatcher.on("OnAppSelected", this.onAppSelected.bind(this));

    }
    async render() {
        return <>
            <div class="w-full h-full p-8 px-10 space-y-4 flex flex-col">

                <div class="flex flex-row space-x-4">
                    <div class="w-24 h-24 bg-zinc-700 rounded-lg bg-cover bg-no-repeat bg-center" id="icon"></div>
                    <div class="flex flex-col space-y-1">
                        <label class="text-zinc-300 text-xl">{name}</label>
                        <button class="bg-blue-500 text-xs p-1 px-6 rounded-md">Install</button>
                    </div>
                </div>

                <div class="text-zinc-500 space-y-3 marked" id="description">
                    <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
                </div>

            </div>
        </>;
    }
    async appInstall() {

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

            const raw = urlparse.giturl(url, branch);
            
            await this.loadIcon(raw, branch);
            await this.loadReadme(raw, branch);

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