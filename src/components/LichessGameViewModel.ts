import { BaseViewModel } from "../core/BaseViewModel";
import { observable } from "knockout";
import { LichessApiService } from "../services/LichessApiService";
import { LichessAuthService } from "../services/LichessAuthService";

export class LichessGameViewModel extends BaseViewModel {
    public gameUrl = observable<string | null>(null);
    public boardUrl = observable<string | null>(null);
    public isAuthenticated = observable<boolean>(false);
    private api: LichessApiService | null = null;
    private auth: LichessAuthService;

    constructor(context: PageJS.Context | undefined) {
        super(context);
        this.auth = new LichessAuthService("YOUR_CLIENT_ID", window.location.origin + "/lichess");
        this.init();
        this.setTemplate(`
            <div>
                <!-- ko if: isAuthenticated -->
                <button data-bind="click: startGame">Start AI Game</button>
                <button data-bind="click: logout">Logout</button>
                <div data-bind="if: boardUrl">
                    <iframe data-bind="attr: { src: boardUrl }" style="width: 600px; height: 397px; border:0;"></iframe>
                </div>
                <div data-bind="if: gameUrl" style="margin-top: 8px;">
                    <a data-bind="attr: { href: gameUrl }, text: gameUrl" target="_blank"></a>
                </div>
                <!-- /ko -->
                <!-- ko ifnot: isAuthenticated -->
                <button data-bind="click: login">Login with Lichess</button>
                <!-- /ko -->
            </div>
        `);
    }

    private async init(): Promise<void> {
        const token = await this.auth.getAccessToken();
        if (token) {
            this.api = new LichessApiService(token);
            this.isAuthenticated(true);
        }
    }

    login() {
        void this.auth.authenticate();
    }

    logout(): void {
        this.auth.logout();
        this.isAuthenticated(false);
        this.api = null;
        this.gameUrl(null);
        this.boardUrl(null);
    }

    async startGame() {
        if (!this.api) {
            const token = await this.auth.getAccessToken();
            if (!token) {
                void this.auth.authenticate();
                return;
            }
            this.api = new LichessApiService(token);
            this.isAuthenticated(true);
        }
        try {
            const response = await this.api.challengeAi();
            if (response.challenge && response.challenge.url) {
                this.gameUrl(response.challenge.url);
                const match = response.challenge.url.match(/lichess\.org\/(\w+)/);
                if (match) {
                    this.boardUrl(`https://lichess.org/embed/${match[1]}?theme=auto&bg=auto`);
                }
            } else {
                console.error("Unexpected response from Lichess", response);
            }
        } catch (err) {
            console.error(err);
        }
    }
}
