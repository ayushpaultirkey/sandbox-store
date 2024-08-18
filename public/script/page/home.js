import "./../../style/main.css";
import H12 from "@library/h12";
import urlparse from "@library/urlparse";
import dispatcher from "@library/dispatcher";
import Card from "../component/card";

const { fs, path, electron, axios, express, http, directory, bundle } = plugin;

@Component
export default class Home extends H12 {
    constructor() {
        super();
    }
    async init() {

        this.getApp();

    }
    async render() {
        return <>
            <div class="w-full h-full p-8 px-10 space-y-4">
                <label class="text-2xl text-zinc-300">Home</label>
                <div class="bg-zinc-300 text-xs rounded-md flex flex-row shadow-lg shadow-zinc-700">
                    <input type="text" placeholder="Search..." class="bg-transparent p-2 px-4 pr-0 w-full" />
                    <button class="px-4 fa fa-search hover:text-blue-500"></button>
                </div>
                <div class="space-y-4 text-zinc-400">
                    {app.list}
                </div>
            </div>
        </>;
    }
    async getApp() {
        try {

            this.set("{app.list}", <><i class="fa-solid fa-circle-notch fa-spin text-2xl text-zinc-400"></i></>);

            const { status, data } = await axios.get("https://script.google.com/macros/s/AKfycbzn9Q0sc7hZ-JQFwLIRJnUG5q--HRNpFPKXaSTxAIN6_ONHdDm9shdgAyzbQcFdCSXd7Q/exec?name=store");
            if(status !== 200) {
                throw new Error("Unable to get apps");
            }

            this.set("{app.list}", "No app found");

            for(const item of data) {
                const raw = urlparse.giturl(item.url, item.branch);
                this.set("{app.list}++", <>
                    <Card args name={ item.name } description={ item.description } onclick={ () => { this.loadApp(item) } } icon={ `${raw}/favicon.png` } />
                </>);
            }

        }
        catch(error) {
            console.error(error);
        }
    }
    loadApp(item) {
        dispatcher.call("OnAppSelected", item);
    }
}