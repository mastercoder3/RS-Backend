export interface IFavorite{
    _id: string;
    name: string;
    address: string;
    phone: string;
    type: string;
    userId: string;
    locationId: string;
}

export interface IFavoriteUserInput{
    userId: string;
}

export interface IFavoriteExistInput{
    userId: string;
    locationId: string;
}