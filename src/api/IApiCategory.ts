/* Color including hash; e.g. #ffeeff */
type Color = string;

export interface IApiCategory {
    cat_id: number;
    name: string;
    color: Color;
}
