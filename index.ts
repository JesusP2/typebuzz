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

type Substract<N, Amount> = {
  amount_is_zero: N;
  recurse: Substract<Decrement<N>, Decrement<Amount>>;
}[Amount extends GetN<0> ? "amount_is_zero" : "recurse"];

type test_sub = [
  Eq<Substract<GetN<2>, GetN<1>>, GetN<1>>,
  Eq<Substract<GetN<2>, GetN<2>>, GetN<0>>,
  Eq<Substract<GetN<2>, GetN<0>>, GetN<2>>,
  Eq<Substract<GetN<1>,GetN<2>>, NAN>
];

type IsDivisibleBy<A, B> = {
  a_eq_0: true;
  a_lt_0: false;
  recurse: IsDivisibleBy<Substract<A, B>, B>;
}[A extends NAN ? "a_lt_0" : A extends GetN<0> ? "a_eq_0" : "recurse"];

type test_divisable_by = [
  Eq<IsDivisibleBy<GetN<4>, GetN<2>>, true>,
  Eq<IsDivisibleBy<GetN<3>, GetN<2>>, false>,
  Eq<IsDivisibleBy<GetN<5>, GetN<3>>, false>,
  Eq<IsDivisibleBy<GetN<6>, GetN<3>>, true>
];

type IsDivisibleBy3<N> = IsDivisibleBy<N, GetN<3>>;
type IsDivisibleBy5<N> = IsDivisibleBy<N, GetN<5>>;
type IsDivisibleBy15<N> = IsDivisibleBy<N, GetN<15>>;
type IsDivisibleBy8<N> = IsDivisibleBy<N, GetN<8>>;

// NOTE: here is where you define the fizzbuzz logic
type FizzBuzzNth<N> = IsDivisibleBy15<N> extends true
  ? "FizzBuzz"
  : IsDivisibleBy3<N> extends true
  ? "Fizz"
  : IsDivisibleBy8<N> extends true
  ? "Kap"
  : IsDivisibleBy5<N> extends true
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
  Eq<FizzBuzzNth<GetN<16>>, "Kap">
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
      GetN<1>, GetN<2>, "Fizz", GetN<4>, "Buzz", "Fizz", GetN<7>, "Kap",
      "Fizz", "Buzz", GetN<11>, "Fizz", GetN<13>, GetN<14>, "FizzBuzz", "Kap" 
    ]
  >
];
