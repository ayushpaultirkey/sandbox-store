import "@style/main.css";
import H12 from "@library/h12";
import urlparse from "@library/urlparse";
import dispatcher from "@library/dispatcher";
import Card from "../component/card";

const { fs, path, electron, axios, express, http, directory, bundle } = plugin;

@Component
export default class Installed extends H12 {
    constructor() {
        super();
    }
    async init() {

        this.getApp();

    }
    async render() {
        return <>
            <div class="w-full h-full p-8 px-10 space-y-4">
                <label class="text-2xl text-zinc-300">Installed</label>
                <div class="space-y-4 text-zinc-400">
                    {app.list}
                </div>
            </div>
        </>;
    }
    async getApp() {

        try {

            this.set("{app.list}", <><i class="fa-solid fa-circle-notch fa-spin text-2xl text-zinc-400"></i></>);

            const data = await bundle.getInstalled();
            
            this.set("{app.list}", "No app found");

            for(const item in data) {

                const { id, name } = data[item];
                const icon = await bundle.getInstalledIcon(id);
                const meta = await bundle.getInstalledMetadata(id);

                this.set("{app.list}++", <>
                    <Card args name={ name } description={ "" } onclick={ () => { this.loadPackage(meta) } } icon={ icon } />
                </>);

            }

        }
        catch(error) {
            console.error(error);
        }

    }
    loadPackage(item) {

        dispatcher.call("onPackageSelected", {
            id: item.id,
            name: item.name,
            repository: {
                url: item.repository.url,
                branch: item.repository.branch,
            }
        });

    }
}