export interface AiChallengeOptions {
    level?: number;
    color?: 'white' | 'black' | 'random';
}

export interface AiChallenge {
    id: string;
    url: string;
}

export type AiChallengeResponse = AiChallenge | { challenge: AiChallenge };

export class LichessApiService {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    async challengeAi(options: AiChallengeOptions = {}): Promise<AiChallengeResponse> {
        const params = new URLSearchParams();
        params.set('level', String(options.level ?? 1));
        params.set('color', options.color ?? 'random');

        const response = await fetch('https://lichess.org/api/challenge/ai', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error(`Lichess API error: ${response.statusText}`);
        }
        return response.json() as Promise<AiChallengeResponse>;
    }
}
