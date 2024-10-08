import "@style/main.css";
import H12 from "@library/h12";
import urlparse from "@library/urlparse";
import dispatcher from "@library/dispatcher";
import Card from "../component/card";

@Component
export default class Home extends H12 {
    constructor() {
        super();
    }
    async init() {

        this.getPackages();

    }
    async render() {
        return <>
            <div class="w-full h-full p-8 px-10 space-y-4">
                <label class="text-2xl text-zinc-300">Home</label>
                <div class="bg-zinc-300 text-xs rounded-md flex flex-row shadow-lg shadow-zinc-700">
                    <input 
                        type="text"
                        id="searchBox"
                        placeholder="Search..."
                        class="bg-transparent p-2 px-4 pr-0 w-full"
                        onkeypress={
                            (e) => {
                                if(e.key === "Enter") {
                                    this.getPackages(this.element.searchBox.value);
                                }
                            }
                        } />
                    <button
                        class="px-4 fa fa-search hover:text-blue-500"
                        onclick={
                            () => {
                                this.getPackages(this.element.searchBox.value);
                            }
                        } >
                    </button>
                </div>
                <div class="space-y-4 text-zinc-400">
                    {list}
                </div>
            </div>
        </>;
    }
    async getPackages(name) {
        try {

            this.set("{list}", <>
                <i class="fa-solid fa-circle-notch fa-spin text-2xl text-zinc-400"></i>
            </>);

            const query = (name) ? `?name=${name}` : "";
            
            const response = await fetch(`https://script.google.com/macros/s/AKfycbzn9Q0sc7hZ-JQFwLIRJnUG5q--HRNpFPKXaSTxAIN6_ONHdDm9shdgAyzbQcFdCSXd7Q/exec${query}`);
            if(!response.ok) {
                throw new Error("Unable to get README.md");
            }
            
            this.set("{list}", "No app found");

            const data = await response.json();
            for(const item of data) {
                const raw = urlparse.giturl(item.url, item.branch);
                this.set("{list}++", <>
                    <Card args name={ item.name } description={ item.description } onclick={ () => { this.selectPackage(item) } } icon={ `${raw}/favicon.png` } />
                </>);
            }

        }
        catch(error) {
            console.error(error);
        }
    }
    selectPackage(item) {
        if(item) {
            dispatcher.call("onPackageSelected", {
                id: item.id,
                name: item.name,
                repository: {
                    url: item.url,
                    branch: item.branch,
                }
            });
        }
    }
}