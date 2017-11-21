# maybe

Just another maybe approach in Javascript. I did this because there was always something small missing everywhere and since it's not hard to create a maybe polyfill I did one on my own.

With version **0.0.3** there is full support of promises.

## Where to use

You should use this on values where you are not sure if you get anything back. Usually using maybes the right way helps you avoiding if-then-elses.

## Installation
```sh
npm install another-maybe --save-dev
```

## How to use

#### Classic default value handling
```javascript
const value = maybe('originalValue')
    .orValue('alternativeValue')
    .get();
```

#### Classic default value handling via callback
```javascript
const value = maybe('originalValue')
    .orElse(() => 'alternativeValue')
    .get();
```

#### Usage of is method
```javascript
const value = maybe('originalValue')
    .is((v) => v === 'originalValue')
    .orValue('alternativeValue')
    .get();
```

#### Usage of map method
```javascript
const value = maybe('originalValue')
    .map((v) => v + '1')
    .get(); // originalValue1
```

#### Usage of for-each method
```javascript
const value = maybe('originalValue')
    .forEach((v) => console.log(v))
    .get();
```

#### Usage in async operation
```javascript
const test = async () => delayFunction(200);
const value = await maybe('originalValue')
    .map(async (v) => {
        await test();

        return v;
    })
    .orElse(async () => {
        await test();

        return 'alternativeValue';
    })
    .get();
```

#### Usage in an advanced async operation
```javascript
const test = async () => delayFunction(200);
const value = await maybe(1)
    .map(async (v) => {
        await test();

        return v + 1;
    }) // returns Promise with value "2"
    .is(async (v) => {
        return v === 1;
    }) // returns Promise with value undefined
    .orElse(async () => {
        await test();

        return  0;
    }) // returns Promise with value 0
    .forEach((v) => {
        console.log(v);
    })
    .map(async (v) => {
        await test();

        return undefined;
    }) // returns Promise with value undefined
    .forEach((v) => {
        console.log(v);
    })
    .orValue(2) // returns Promise with value 2
    .map(async (v) => {
        await test();

        return v + 1;
    }) // returns Promise with value 3
    .get();

/* end result: value === 3 */
```

