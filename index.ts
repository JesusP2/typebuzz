type Eq<A, B extends A> = "passes";
type test_eq = [
  Eq<"Hello", "Hello">,
  Eq<"Hello", "world">
];

type NAN = null;
type Increment<N> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Extract<N, number>];
type Decrement<N> = [NAN, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Extract<N, number>];
type GetN<N, A extends any[] = [], P = 0> = N extends A['length'] ? P : GetN<N, [...A, N], Increment<P>>;

type test_decrement = [
  Eq<Decrement<GetN<1>>, 0>,
  Eq<Decrement<Decrement<GetN<1>>>, NAN>,
  Eq<Decrement<Decrement<GetN<2>>>, 0>
];

type Subtract<N, Amount> = {
  amount_is_zero: N;
  recurse: Subtract<Decrement<N>, Decrement<Amount>>;
}[Amount extends GetN<0> ? "amount_is_zero" : "recurse"];

type test_sub = [
  Eq<Subtract<GetN<2>, GetN<1>>, GetN<1>>,
  Eq<Subtract<GetN<2>, GetN<2>>, GetN<0>>,
  Eq<Subtract<GetN<2>, GetN<0>>, GetN<2>>,
  Eq<Subtract<GetN<1>,GetN<2>>, NAN>
];

type IsDivisableBy<A, B> = {
  a_eq_0: true;
  a_lt_0: false;
  recurse: IsDivisableBy<Subtract<A, B>, B>;
}[A extends NAN ? "a_lt_0" : A extends GetN<0> ? "a_eq_0" : "recurse"];

type test_divisable_by = [
  Eq<IsDivisableBy<GetN<4>, GetN<2>>, true>,
  Eq<IsDivisableBy<GetN<3>, GetN<2>>, false>,
  Eq<IsDivisableBy<GetN<5>, GetN<3>>, false>,
  Eq<IsDivisableBy<GetN<6>, GetN<3>>, true>
];

type IsDivisableBy3<N> = IsDivisableBy<N, GetN<3>>;
type IsDivisableBy5<N> = IsDivisableBy<N, GetN<5>>;

type And<A, B> = A extends true ? (B extends true ? true : false) : false;
type IsDivisableBy15<N> = And<IsDivisableBy3<N>, IsDivisableBy5<N>>;

type FizzBuzzNth<N> = IsDivisableBy15<N> extends true
  ? "FizzBuzz"
  : IsDivisableBy3<N> extends true
  ? "Fizz"
  : IsDivisableBy5<N> extends true
  ? "Buzz"
  : N;

type test_fizzbuzznth = [
  Eq<FizzBuzzNth<GetN<1>>, GetN<1>>,
  Eq<FizzBuzzNth<GetN<2>>, GetN<2>>,
  Eq<FizzBuzzNth<GetN<3>>, "Fizz">,
  Eq<FizzBuzzNth<GetN<4>>, GetN<4>>,
  Eq<FizzBuzzNth<GetN<5>>, "Buzz">,
  Eq<FizzBuzzNth<GetN<6>>, "Fizz">,
  Eq<FizzBuzzNth<GetN<14>>, GetN<14>>,
  Eq<FizzBuzzNth<GetN<15>>, "FizzBuzz">,
  Eq<FizzBuzzNth<GetN<16>>, GetN<16>>
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
}[N extends GetN<0> ? "output" : "recurse"];

type test_fizzbuzzupto = [
  Eq<
    FizzBuzzUpTo<GetN<16>>,
    [
      GetN<1>, GetN<2>, "Fizz", GetN<4>, "Buzz", "Fizz", GetN<7>, GetN<8>,
      "Fizz", "Buzz", GetN<11>, "Fizz", GetN<13>, GetN<14>, "FizzBuzz", GetN<16>
    ]
  >
];
