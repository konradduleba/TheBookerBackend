import { EQueryType } from "../Enums/EQueryType";

export default interface ISearchContent {
    type: EQueryType;
    query: string;
}