export class LichessAuthService {
    private clientId: string;
    private redirectUri: string;
    private scope: string;
    private storageKey = 'lichess_token';

    constructor(clientId: string, redirectUri: string, scope: string = 'challenge:write') {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.scope = scope;
    }

    /**
     * Initiates the OAuth flow by redirecting the user to Lichess.
     */
    authenticate(): void {
        const url = new URL('https://lichess.org/oauth');
        url.searchParams.set('response_type', 'token');
        url.searchParams.set('client_id', this.clientId);
        url.searchParams.set('redirect_uri', this.redirectUri);
        url.searchParams.set('scope', this.scope);
        window.location.href = url.toString();
    }

    /**
     * Returns the stored access token if available.
     */
    getAccessToken(): string | null {
        const tokenInStorage = localStorage.getItem(this.storageKey);
        if (tokenInStorage) {
            return tokenInStorage;
        }
        const tokenInUrl = this.extractTokenFromUrl();
        if (tokenInUrl) {
            this.saveToken(tokenInUrl);
            this.clearUrlFragment();
            return tokenInUrl;
        }
        return null;
    }

    logout(): void {
        localStorage.removeItem(this.storageKey);
    }

    private saveToken(token: string): void {
        localStorage.setItem(this.storageKey, token);
    }

    private extractTokenFromUrl(): string | null {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');
        return token;
    }

    private clearUrlFragment(): void {
        if (window.history.replaceState) {
            const url = window.location.origin + window.location.pathname;
            window.history.replaceState(null, '', url);
        }
    }
}
