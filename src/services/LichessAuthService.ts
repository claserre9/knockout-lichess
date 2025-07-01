import page from 'page';

export class LichessAuthService {
    private clientId: string;
    private redirectUri: string;
    private scope: string;
    private storageKey = 'lichess_token';
    private verifierKey = 'lichess_verifier';

    constructor(clientId: string, redirectUri: string, scope: string = 'challenge:write') {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.scope = scope;
    }

    /**
     * Initiates the OAuth PKCE flow by redirecting the user to Lichess.
     */
    async authenticate(): Promise<void> {
        const verifier = this.generateVerifier();
        const challenge = await this.generateChallenge(verifier);
        sessionStorage.setItem(this.verifierKey, verifier);

        const url = new URL('https://lichess.org/oauth');
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', this.clientId);
        url.searchParams.set('redirect_uri', this.redirectUri);
        url.searchParams.set('scope', this.scope);
        url.searchParams.set('code_challenge', challenge);
        url.searchParams.set('code_challenge_method', 'S256');
        window.location.href = url.toString();
    }

    /**
     * Returns the stored access token if available.
     */
    async getAccessToken(): Promise<string | null> {
        const tokenInStorage = localStorage.getItem(this.storageKey);
        if (tokenInStorage) {
            return tokenInStorage;
        }

        const code = this.extractCodeFromUrl();
        const verifier = sessionStorage.getItem(this.verifierKey);

        if (code && verifier) {
            try {
                const token = await this.exchangeCodeForToken(code, verifier);
                this.saveToken(token);
                sessionStorage.removeItem(this.verifierKey);
                this.clearUrlParams();
                page('/lichess');
                return token;
            } catch (err) {
                console.error(err);
            }
        }
        return null;
    }

    logout(): void {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.verifierKey);
    }

    private saveToken(token: string): void {
        localStorage.setItem(this.storageKey, token);
    }

    private extractCodeFromUrl(): string | null {
        const params = new URLSearchParams(window.location.search);
        return params.get('code');
    }

    private clearUrlParams(): void {
        if (window.history.replaceState) {
            const url = this.redirectUri;
            window.history.replaceState(null, '', url);
        }
    }

    private async exchangeCodeForToken(code: string, verifier: string): Promise<string> {
        const params = new URLSearchParams();
        params.set('grant_type', 'authorization_code');
        params.set('code', code);
        params.set('code_verifier', verifier);
        params.set('redirect_uri', this.redirectUri);
        params.set('client_id', this.clientId);

        const response = await fetch('https://lichess.org/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error(`Lichess token request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token as string;
    }

    private generateVerifier(): string {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    private async generateChallenge(verifier: string): Promise<string> {
        const data = new TextEncoder().encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
        return base64.replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}
