import { IResultCard } from "../result-card/result-card.interface";

export interface IHangarResult {
    total_count: number;
    incomplete_results: boolean;
    items: IResultCard[];
}
