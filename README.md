# maybe

Just another maybe approach in Javascript. I did this because there was always something small missing everywhere and since it's not hard to create a maybe polyfill I did one on my own.

## Where to use

You should use this on values where you are not sure if you get anything back. Usually using maybes the right way helps you avoiding if-then-elses.

## Installation
```
npm install another-maybe --save-dev
```

## How to use

#### Classic default value handling
```
const value = maybe('originalValue')
    .orValue('alternativeValue')
    .get();
```

#### Classic default value handling via callback
```
const value = maybe('originalValue')
    .orElse(() => 'alternativeValue')
    .get();
```

#### Usage of is method
```
const value = maybe('originalValue')
    .is((v) => v === 'originalValue')
    .orValue('alternativeValue')
    .get();
```

#### Usage of map method
```
const value = maybe('originalValue')
    .map((v) => v + '1')
    .get(); // originalValue1
```

#### Usage of for-each method
```
const value = maybe('originalValue')
    .forEach((v) => console.log(v))
    .get();
```

#### Usage in async operation
```
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
