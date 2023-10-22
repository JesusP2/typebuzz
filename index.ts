type Eq<A, B extends A> = "passes";
type test_eq = [
  Eq<"Hello", "Hello">, // passes
  Eq<"Hello", "world"> // fails with "'world' does not satisfy constraint 'Hello'"
];

type NAN = null;
type _0 = 0;

type _1 = Increment<_0>;
type _2 = Increment<_1>;
type _3 = Increment<_2>;
type _4 = Increment<_3>;
type _5 = Increment<_4>;
type _6 = Increment<_5>;
type _7 = Increment<_6>;
type _8 = Increment<_7>;
type _9 = Increment<_8>;
type _10 = Increment<_9>;
type _11 = Increment<_10>;
type _12 = Increment<_11>;
type _13 = Increment<_12>;
type _14 = Increment<_13>;
type _15 = Increment<_14>;
type _16 = Increment<_15>;

type test_decrement = [
  Eq<Decrement<_1>, _0>,
  Eq<Decrement<Decrement<_1>>, NAN>,
  Eq<Decrement<Decrement<_2>>, _0>
];

type Subtract<N, Amount> = {
  amount_is_zero: N;
  recurse: Subtract<Decrement<N>, Amount>;
}[Amount extends _0 ? "amount_is_zero" : "recurse"];

type test_sub = [
  Eq<Subtract<_2, _1>, _1>,
  Eq<Subtract<_2, _2>, _0>,
  Eq<Subtract<_2, _0>, _2>,
  Eq<Subtract<_1, _2>, NAN>
];

type IsDivisableBy<A, B> = {
  a_eq_0: true;
  a_lt_0: false;
  recurse: IsDivisableBy<Substract<A, B>, B>;
}[A extends _0 ? "a_eq_0" : A extends NAN ? "a_lt_0" : "recurse"];

type test_divisable_by = [
  Eq<IsDivisableBy<_4, _2>, true>,
  Eq<IsDivisableBy<_3, _2>, false>,
  Eq<IsDivisableBy<_5, _3>, false>,
  Eq<IsDivisableBy<_6, _3>, true>
];

type IsDivisableBy3<N> = IsDivisableBy<N, _3>;
type IsDivisableBy5<N> = IsDivisableBy<N, _5>;

type And<A, B> = A extends true ? (B extends true ? true : false) : false;
type IsDivisableBy15<N> = And<IsDivisableBy3<N>, IsDivisableBy5<N>>;

type FizzBuzzNth<N> = IsDivisableBy15<N> extends true
  ? "Fizzbuzz"
  : IsDivisableBy<N, _3> extends true
  ? "Fizz"
  : IsDivisableBy<N, _5> extends true
  ? "Buzz"
  : N;

type test_fizzbuzznth = [
  Eq<FizzBuzzNth<_1>, _1>,
  Eq<FizzBuzzNth<_2>, _2>,
  Eq<FizzBuzzNth<_3>, "Fizz">,
  Eq<FizzBuzzNth<_4>, _4>,
  Eq<FizzBuzzNth<_5>, "Buzz">,
  Eq<FizzBuzzNth<_6>, "Fizz">,
  Eq<FizzBuzzNth<_14>, _14>,
  Eq<FizzBuzzNth<_15>, "FizzBuzz">,
  Eq<FizzBuzzNth<_16>, _16>
];

type Unshift<Element, List extends Array<any>> = Parameters<
  (e: Element, ...list: List) => any
>;

type test_unshift = [
  Eq<Unshift<1, []>, [1]>,
  Eq<Unshift<2, [1]>, [2, 1]>,
  Eq<Unshift<"hello", [2, 1]>, ["hello", 2, 1]>
];

type FizzBuzzUpTo<N, Output extends any[] = []> = {
  output: Output;
  recurse: FizzBuzzUpTo<Decrement<N>, Unshift<FizzBuzzNth<N>, Output>>;
}[N extends _0 ? "output" : "recurse"];

// prettier-ignore
type test_fizzbuzzupto = [
  Eq<
    FizzBuzzUpTo<_16>,
    [
      _1, _2, "Fizz", _4, "Buzz", "Fizz", _7, _8,
      "Fizz", "Buzz", _11, "Fizz", _13, _14, "FizzBuzz", _16
    ]
  >
];

// prettier-ignore
type Increment<N> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Extract<N, number>];
// prettier-ignore
type Decrement<N> = [NAN, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Extract<N, number>];

type FIZZBUZZ = FizzBuzzUpTo<_16>;
