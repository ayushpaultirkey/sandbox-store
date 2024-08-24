import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/dispatcher";
import Home from "./page/home";
import Detail from "./page/detail";
import IPackages from "./page/installed/packages";
import IPlugins from "./page/installed/plugins";

const { manager } = window.plugin;

@Component
class App extends H12 {
    constructor() {
        super();
    }
    async init() {

        this.tabSwitch();
        manager.package.validate();

        dispatcher.on("onPackageSelected", this.onPackageSelected.bind(this));

    }
    async render() {
        return <>
            <div class="w-full h-full overflow-hidden relative flex flex-row">
                <div class="bg-zinc-800 flex flex-col text-zinc-300 p-2 py-8">
                    <button class="text-left p-3 text-xs font-semibold flex flex-col items-center cursor-pointer hover:bg-zinc-700 hover:text-blue-400 rounded-md fa fa-home" onclick={ () => { this.tabSwitch(0); } }></button>
                    <button class="text-left p-3 text-xs font-semibold flex flex-col items-center cursor-pointer hover:bg-zinc-700 hover:text-blue-400 rounded-md fa fa-list" onclick={ () => { this.tabSwitch(2); } }></button>
                    <button class="text-left p-3 text-xs font-semibold flex flex-col items-center cursor-pointer hover:bg-zinc-700 hover:text-blue-400 rounded-md fa fa-puzzle-piece" onclick={ () => { this.tabSwitch(3); } }></button>
                </div>
                <div class="bg-zinc-900 w-full h-full overflow-auto scroll" id="tab">
                    <Home args></Home>
                    <Detail args></Detail>
                    <IPackages args ref="IPackages"></IPackages>
                    <IPlugins args ref="IPlugins"></IPlugins>
                </div>
            </div>
        </>;
    }
    tabSwitch(index = 0) {

        const { tab } = this.element;
        tab.childNodes.forEach(x => {
            x.classList.add("hidden");
        });
        tab.childNodes[index].classList.remove("hidden");

    }
    onPackageSelected(e) {
        this.tabSwitch(1);
    }
}

H12.load(App, ".app");