import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/dispatcher";
import Home from "./page/home";
import Detail from "./page/detail";
import Installed from "./page/installed";

@Component
class App extends H12 {
    constructor() {
        super();
    }
    async init() {

        this.tabSwitch();

        dispatcher.on("onPackageSelected", this.onPackageSelected.bind(this));

    }
    async render() {
        return <>
            <div class="w-full h-full overflow-hidden relative flex flex-row">
                <div class="bg-zinc-800 flex flex-col text-zinc-300 p-2">
                    <button class="text-left p-3 text-xs font-semibold flex flex-col items-center cursor-pointer hover:bg-zinc-700 hover:text-blue-400 rounded-md fa fa-home" onclick={ () => { this.tabSwitch(0); } }></button>
                    <button class="text-left p-3 text-xs font-semibold flex flex-col items-center cursor-pointer hover:bg-zinc-700 hover:text-blue-400 rounded-md fa fa-list" onclick={ () => { this.tabSwitch(2); } }></button>
                </div>
                <div class="bg-zinc-900 w-full h-full overflow-auto scroll" id="tab">
                    <Home args></Home>
                    <Detail args></Detail>
                    <Installed args></Installed>
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