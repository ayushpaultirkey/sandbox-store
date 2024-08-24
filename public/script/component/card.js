import "@style/main.css";
import H12 from "@library/h12";

@Component
export default class Card extends H12 {
    constructor() {
        super();
    }
    async init() {

    }
    async render() {

        const { name, description, onclick, icon, size } = this.args;

        return <>
            <div class="flex flex-row space-x-2 cursor-pointer select-none" onclick={ onclick }>
                <div class="w-20 h-20 max-w-20 min-w-20 bg-zinc-700 rounded-lg bg-cover bg-no-repeat bg-center" style={ `background-image: url(${icon})` }></div>
                <div class="flex flex-col">
                    <label class="pointer-events-none text-zinc-300">{ name }</label>
                    <label class="pointer-events-none text-xs text-zinc-500">{ (description) ? description : "" }</label>
                </div>
            </div>
        </>;

    }
}