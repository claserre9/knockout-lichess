import { BaseViewModel } from "../core/BaseViewModel";
import { observable } from "knockout";
import { LichessApiService } from "../services/LichessApiService";

export class LichessGameViewModel extends BaseViewModel {
    public gameUrl = observable<string | null>(null);
    private api: LichessApiService;

    constructor(context: PageJS.Context | undefined) {
        super(context);
        this.api = new LichessApiService("YOUR_LICHESS_TOKEN");
        this.setTemplate(`
            <div>
                <button data-bind="click: startGame">Start AI Game</button>
                <div data-bind="if: gameUrl">
                    <a data-bind="attr: { href: gameUrl }, text: gameUrl" target="_blank"></a>
                </div>
            </div>
        `);
    }

    async startGame() {
        try {
            const response = await this.api.challengeAi();
            this.gameUrl(response.challenge.url);
        } catch (err) {
            console.error(err);
        }
    }
}
