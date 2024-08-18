import "./../../style/main.css";
import H12 from "@library/h12";
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
                <div class="space-y-4">
                    {app.list}
                </div>
            </div>
        </>;
    }
    async getApp() {
        try {

            const { status, data } = await axios.get("http://localhost:2000/api/app.json");
            if(status !== 200) {
                throw new Error("Unable to get apps");
            }

            for(const item of data) {
                this.set("{app.list}++", <>
                    <Card args name={ item.name } description={ item.description } onclick={ () => { this.loadApp(item) } } />
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