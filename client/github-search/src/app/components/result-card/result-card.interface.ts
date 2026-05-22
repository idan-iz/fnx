export interface IOwner {
    avatar_url: string;
}

export interface IResultCard {
    id: number;
    name: string;
    full_name: string;
    owner: IOwner;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number
}

