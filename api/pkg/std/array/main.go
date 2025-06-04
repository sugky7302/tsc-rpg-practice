package std_array

import "sort"

// 將數組中的元素映射為另一個數組
/*
 * param {[]T} slice - 數組
 * param {func(T) V} f - 映射函數
 * return {[]V}
 */
func Map[T, V any](slice []T, f func(T) V) []V {
	var n []V
	for _, e := range slice {
		n = append(n, f(e))
	}
	return n
}

// Every 會檢查數組中的所有元素是否符合條件。
// 如果有一個不符合就會回傳 false，所有元素都符合才會回傳 true。
/*
 * param {[]T} slice - 數組
 * param {func(T) bool} f - 條件函數
 * return {bool}
 */
func Every[T any](slice []T, f func(T) bool) bool {
	for _, e := range slice {
		if !f(e) {
			return false
		}
	}
	return true
}

// Some 會檢查數組中是否有元素符合條件。
// 只要有一個符合就會回傳 true。所有元素都不符合才會回傳 false。
/*
 * param {[]T} slice - 數組
 * param {func(T) bool} f - 條件函數
 * return {bool}
 */
func Some[T any](slice []T, f func(T) bool) bool {
	for _, e := range slice {
		if f(e) {
			return true
		}
	}
	return false
}

// Filter 會過濾掉數組中不符合條件的元素
/*
 * param {[]T} slice - 數組
 * param {func(T) bool} f - 過濾函數
 * return {[]T}
 */
func Filter[T any](slice []T, f func(T) bool) []T {
	var n []T
	for _, e := range slice {
		if f(e) {
			n = append(n, e)
		}
	}
	return n
}

// Reduce 是將一個陣列（或集合）的所有元素進行累積運算，最後得到一個值。
// 它會接受一個二元函數（操作），並從陣列的第一個元素開始，將這個元素和下一個元素進行操作，
// 然後再將結果和下一個元素進行操作，直到遍歷完所有元素，最終返回一個累積的值。
/*
 * param {[]T} slice - 數組
 * param {func(initial V, element T) V} f - 操作函數
 * param {V} initial - 初始值
 * return {V}
 */
func Reduce[T, V any](slice []T, f func(V, T) V, initial V) V {
	result := initial
	for _, val := range slice {
		result = f(result, val)
	}
	return result
}

// Sort 是封裝 Golang 的 Sort 方法，然後回傳自己，方便鏈式呼叫。
func Sort[T any](slice []T, f func(T, T) bool) []T {
	sort.Slice(slice, func(i, j int) bool {
		return f(slice[i], slice[j])
	})
	return slice
}
