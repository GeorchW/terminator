interface IHashable {
    hash: number;
    equals(other: any): boolean;
}