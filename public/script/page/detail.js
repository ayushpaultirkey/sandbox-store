import "./../../style/main.css";
import H12 from "@library/h12";
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

                <div class="flex flex-row space-x-2">
                    <div class="w-24 h-24 bg-zinc-700 rounded-lg"></div>
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
    async loadDetail({ url, branch }) {
        try {

            const domain = "https://raw.githubusercontent.com/";
            const repository = url.split("https://github.com/")[1];

            const raw = `${domain}${repository}/${branch}`;
            const readmeURL = `${raw}/README.md`;

            const response = await fetch(readmeURL);
            if(!response.ok) {
                throw new Error("Unable to get README.md");
            }

            const data = await response.text();
    
            const { description } = this.element;
            const renderer = {
                image: (token) => {
                    return `<img src="${ `${raw}/${token.href}` }"/>`;
                }
            }
            marked.use({ renderer });

            description.innerHTML = marked.parse(data);

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