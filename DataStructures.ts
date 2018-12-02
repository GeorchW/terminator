interface IHashable {
    hash: number;
    equals(other: any): boolean;
}

class OrderedFrozenSet<T extends IHashable> implements IHashable {
    private hash_: number = 0;
    public get hash() : number {
        return this.hash_
    }
    public readonly array:ReadonlyArray<T> = []
    
    equals(other: any): boolean {
        if (other instanceof OrderedFrozenSet) {
            if (this.buckets.size != other.buckets.size)
                return false
            for (const [number, list] of this.buckets) {
                let otherList = other.buckets.get(number)
                if(otherList == undefined)
                    return false
                if (otherList.length != list.length)
                    return false
                for (const item of list)
                    if (!otherList.some(otherItem => otherItem == item))
                        return false
            }
            return true
        }
        return false
    }
    private buckets = new Map<number, T[]>();

    constructor(items:T[]){
        var array = []
        for (const item of items) {
            if(this.add(item))
                array.push(item)
        }
        this.array = array
    }

    public toArray(): T[] {
        return this.array.slice()
    }

    private add(obj: T): boolean {
        const objHash = obj.hash;
        const list = this.buckets.get(objHash);
        if(list != undefined) {
            if (list.some(x => x.equals(obj)))
                return false
            list.push(obj)
        }
        else {
            this.buckets.set(objHash, [obj])
        }
        this.hash_ ^= objHash
        return true
    }

    public has(obj: T): boolean {
        const objHash = obj.hash;
        const list = this.buckets.get(objHash);
        if (list != undefined) {
            if (list.some(x => x.equals(obj)))
                return true
        }
        return false
    }

    public *iterate(): Iterable<T> {
        for (const item of this.array)
            yield item
    }
}

class KeyValuePair<TKey extends IHashable, TValue> {
    constructor(public readonly key:TKey, public readonly value:TValue){}
}
class CustomMap<TKey extends IHashable, TValue>{
    private buckets = new Map<number, KeyValuePair<TKey, TValue>[]>();
    
    private add(key: TKey, value:TValue): boolean {
        const objHash = key.hash;
        const list = this.buckets.get(objHash);
        if (list != undefined) {
            if (list.some(x => x.key.equals(key)))
                return false
            list.push({key, value})
        }
        else {
            this.buckets.set(objHash, [{key, value}])
        }
        return true
    }
    
    public get(key: TKey): TValue | undefined {
        const keyHash = key.hash;
        const list = this.buckets.get(keyHash);
        if (list != undefined) {
            const result = list.find(x => x.key.equals(key))
            if(result != undefined)
                return result.value
        }
        return undefined
    }
}

// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
function stringHash(str:String) {
    var hash = 0;
    if (str.length == 0)
        return hash;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

interface AccumulationFunction<T>
{
    (a:T, b:T) : T
}

class Accumulator<TKey extends IHashable, TValue>{
    private hash_: number = 0;
    public get hash() : number {
        return this.hash_
    }
    public readonly array:ReadonlyArray<[TKey, TValue]> = []
    
    equals(other: any): boolean {
        if (other instanceof Accumulator) {
            if (this.buckets.size != other.buckets.size)
                return false
            for (const [number, list] of this.buckets) {
                let otherList = other.buckets.get(number)
                if(otherList == undefined)
                    return false
                if (otherList.length != list.length)
                    return false
                for (const item of list)
                    if (!otherList.some(otherItem => otherItem == item))
                        return false
            }
            return true
        }
        return false
    }
    private buckets = new Map<number, [TKey, TValue][]>();

    constructor(items:[TKey, TValue][], aggregator:AccumulationFunction<TValue>) {
        var array = []
        for (const item of items)
            if(this.add(item))
                array.push(item[0])
            else {
                let tuple = this.get(item[0]) as [TKey, TValue]
                tuple[1] = aggregator(tuple[1], item[1])
            }
        this.array = array.map(key => this.get(key) as [TKey, TValue])
    }

    public toArray(): [TKey, TValue][] {
        return this.array.slice()
    }

    private add(pair: [TKey, TValue]): boolean {
        const objHash = pair[0].hash;
        const list = this.buckets.get(objHash);
        if(list != undefined) {
            if (list.some(x => x[0].equals(pair[0])))
                return false
            list.push([pair[0], pair[1]])
        }
        else {
            this.buckets.set(objHash, [[pair[0], pair[1]]])
        }
        return true
    }

    public has(key: TKey): boolean {
        const objHash = key.hash;
        const list = this.buckets.get(objHash);
        if (list != undefined) {
            if (list.some(x => x[0].equals(key)))
                return true
        }
        return false
    }
    
    public get(key: TKey): [TKey, TValue] | undefined {
        const keyHash = key.hash;
        const list = this.buckets.get(keyHash);
        if (list != undefined) {
            const result = list.find(x => x[0].equals(key))
            if(result != undefined)
                return result
        }
        return undefined
    }

    public *iterate(): Iterable<[TKey, TValue]> {
        for (const item of this.array)
            yield item
    }
}
