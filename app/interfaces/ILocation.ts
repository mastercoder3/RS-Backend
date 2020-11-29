export interface ILocation{
    _id: string;
    name: string;
    address: string;
    phone: string;
    type: string;
}

export interface ILocationInput {
    name: string;
    address: string;
    phone: string;
    type: string;
}

export interface ILocationSearchInput {
    name: string;
}
  