export interface Events {
    events: Event[];
}

export interface Event {
    type:       string;
    properties: Property[];
}

export interface Property {
    property: string;
    type:     TType;
}

export type TType = "number" | 'string';
