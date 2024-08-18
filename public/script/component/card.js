import "./../../style/main.css";
import H12 from "@library/h12";

@Component
export default class Card extends H12 {
    constructor() {
        super();
    }
    async init() {

    }
    async render() {

        const { name, description, onclick } = this.args;

        return <>
            <div class="flex flex-row space-x-2 cursor-pointer select-none" onclick={ onclick }>
                <div class="w-16 h-16 bg-zinc-700 rounded-lg"></div>
                <div class="flex flex-col">
                    <label class="pointer-events-none text-zinc-300">{ name }</label>
                    <label class="pointer-events-none text-xs text-zinc-500">{ description }</label>
                </div>
            </div>
        </>;

    }
}