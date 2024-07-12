package std_operator

// BoolExpr 是模擬三元運算子的功能，因為 Golang 沒有提供。
func BoolExpr[T any](cnd bool, a, b T) T {
	if cnd {
		return a
	} else {
		return b
	}
}
