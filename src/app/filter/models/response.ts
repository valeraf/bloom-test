export interface Response {
    filters: Filter[];
}

export interface Filter {
    /**
     * Helper 
     */
    key:        number;
    event:      string;
    attributes: Attribute[];
}

export interface Attribute {
    property:   string;
    comparator: string;
    value:      Range | string | number;
    type:       string;
}

export interface Range {
    from: number;
    to:   number;
}
