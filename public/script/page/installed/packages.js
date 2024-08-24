import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/dispatcher";
import Card from "../../component/card";

const { manager } = plugin;

@Component
export default class Installed extends H12 {
    constructor() {
        super();
    }
    async init() {

        this.getPackages();

    }
    async render() {
        return <>
            <div class="w-full h-full p-8 px-10 space-y-4">
                <label class="text-2xl text-zinc-300">Installed Packages</label>
                <div class="space-y-4 text-zinc-400">
                    {list}
                </div>
            </div>
        </>;
    }
    async getPackages() {

        try {

            this.set("{list}", <><i class="fa-solid fa-circle-notch fa-spin text-2xl text-zinc-400"></i></>);

            const data = await manager.package.getInstalled();
            
            this.set("{list}", "No app found");

            for(const item in data) {

                const { id, name } = data[item];
                const icon = await manager.package.getInstalledIcon(id);
                const meta = await manager.package.getInstalledMetadata(id);

                this.set("{list}++", <>
                    <Card args name={ name } onclick={ () => { this.selectPackage(meta) } } icon={ icon } />
                </>);

            }

        }
        catch(error) {
            console.error(error);
        }

    }
    selectPackage(item) {

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