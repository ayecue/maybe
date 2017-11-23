# maybe

Just another maybe approach in Javascript. I did this because there was always something small missing everywhere and since it's not hard to create a maybe polyfill I did one on my own.

Since version **0.0.3** this maybe approach supports Promises. So what this means is that if you have an async callback somewhere or multiple async callbacks the maybe will wait for each of those async callbacks until it proceeds. In the how-to part of this readme is an example showing this behavior (last example).

## Where to use

You should use this on values where you are not sure if you get anything back. Usually using maybes the right way helps you avoiding if-then-elses.

## Installation
```sh
npm install another-maybe --save-dev
```

## API
**```maybe(value)```**

Constructor takes one argument which can be any kind of type. So basically this value then gets wrapped and reached through.



**```maybe(value).isNothing()```**

Returns a boolean if the wrapped value is undefined/null.



**```maybe(value).is(functionWhichReturnsBoolean)```**

Returns a maybe which contains depending on the condition a certain value. If the ```.is``` was positive the given value will stay. If the ```.is``` was negative it'll return an maybe containing an ```undefined```.



**```maybe(value).map(functionWhichReturnsValue)```**

Returns a maybe which contains a value returned by the function in ```.map```. The function will be just executed if the value is not null/undefined. If the value is null/undefined the original maybe will be returned.



**```maybe(value).flatMap(functionWhichReturnsValue)```**

Returns a raw value which was returned by the function in ```.flatMap```. The function will be just executed if the value is not null/undefined. If the value is null/undefined the original maybe will be returned.



**```maybe(value).forEach(function)```**

Returns the original maybe. The function will be executed if the value is not null/undefined.



**```maybe(value).orElse(functionWhichReturnsValue)```**

Returns a maybe which contains a value returned by the function in ```.orElse```. The function will be just executed if the value is null/undefined. If the value is not null/undefined the original maybe will be returned.



**```maybe(value).orValue(anyValueType)```**

Returns a maybe which contains the value given in ```.orValue```. The value will be just returned if the original value is null/undefined. If the value is not null/undefined the original maybe will be returned.



**```maybe(value).get()```**

Returns raw value.



**```maybe.provider({options})```**

Returns custom maybe provider. So what you can do for example is that you can exchange the ```.isNothing``` condition. So you could do something like this:
```javascript
const myOwnMaybeProvider = maybe.provider({
    isNothing: (v) => {
        return v === 'test';
    }
});
const value = myOwnMaybeProvider('test').get(); // returns undefined
```
So as you can see you could for example define ```'test'``` as a undefined/null type in the ```.isNothing``` condition.

You can do this for all it's handlers. Right now the handlers include the following methods: ```isNothing```, ```isPromise``` and ```nil```.

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

