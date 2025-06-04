package rxlog_util

import (
	std_array "app/pkg/std/array"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSortFunc(t *testing.T) {
	arr := []string{"aewr", "csadf", "bqwr", "caoewr", "bqwr"}

	// 按照 key 的字母順序排序
	std_array.Sort(arr, func(a, b string) bool {
		return strings.Compare(strings.ToLower(a), strings.ToLower(b)) < 0
	})

	assert.Equal(t, "aewr", arr[0])
	assert.Equal(t, "bqwr", arr[1])
	assert.Equal(t, "bqwr", arr[2])
	assert.Equal(t, "caoewr", arr[3])
	assert.Equal(t, "csadf", arr[4])
}
