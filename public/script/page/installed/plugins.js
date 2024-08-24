import "@style/main.css";
import icon from "@image/plugin.png";
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
        
        this.getPlugins();

    }
    async render() {
        return <>
            <div class="w-full h-full p-8 px-10 space-y-4">
                <label class="text-2xl text-zinc-300">Installed Plugins</label>
                <div class="space-y-4 text-zinc-400">
                    {list}
                </div>
            </div>
        </>;
    }
    async getPlugins() {

        try {

            this.set("{list}", <><i class="fa-solid fa-circle-notch fa-spin text-2xl text-zinc-400"></i></>);

            const data = await manager.plugin.getInstalled();
            
            this.set("{list}", "No app found");

            for(const item in data) {

                const { id, name } = data[item];
                const meta = await manager.plugin.getInstalledMetadata(id);

                this.set("{list}++", <>
                    <Card args name={ name } onclick={ () => { } } icon={ icon } />
                </>);

            }

        }
        catch(error) {
            console.error(error);
        }

    }
    selectPackage(item) {


    }
}