package std_map

import (
	"fmt"
	"slices"
	"strings"
)

// Map2Str 將 map[T]V 轉換成字串
func Map2Str[T comparable, V any](m map[T]any, exclude []T) string {
	arr := make([]string, 0)
	for k, v := range m {
		if slices.Contains(exclude, k) {
			continue
		}
		arr = append(arr, fmt.Sprintf("%v=%v", k, v))
	}
	if len(arr) == 0 {
		return ""
	}

	return " " + strings.Join(arr, " ")
}
