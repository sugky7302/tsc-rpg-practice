package rxlog_util

import (
	"fmt"
	"strings"

	"golang.org/x/exp/slices"

	"app/pkg/rxlog/logrus"
	std_array "app/pkg/std/array"
)

// Fields2Str 用到 range，會去讀取 fields，在多執行緒的情況下，
// 容易出現 fatal error: concurrent map iteration and map write
func Fields2Str(fields logrus.Fields, exclude []string) string {
	arr := make([]string, 0)
	for k, v := range fields {
		if !slices.Contains(exclude, k) {
			arr = append(arr, fmt.Sprintf("%v=%v", k, v))
		}
	}
	if len(arr) == 0 {
		return ""
	}

	// 按照 key 的字母順序排序
	std_array.Sort(arr, func(a, b string) bool {
		return strings.Compare(strings.ToLower(a), strings.ToLower(b)) < 0
	})

	return " " + strings.Join(arr, " ")
}
