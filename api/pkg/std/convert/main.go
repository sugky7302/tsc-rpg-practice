package std_convert

import (
	"strconv"
	"time"
)

// Str2Int 提供字串轉整數。如果轉換失敗，會回傳預設值。
func Str2Int(v string, defaultValue int) int {
	if v1, err := strconv.ParseInt(v, 10, 64); err == nil {
		return int(v1)
	} else {
		return defaultValue
	}
}

// Str2Time 是一個解析字串為 Time 的函式。
// 這個函式會嘗試使用格式 f 來解析字串。
// 如果都失敗，則會回傳一個錯誤。
/*
 * param {string} s - 字串。
 * param {string} f - 格式。
 * return {time.Time} - 解析成功的時間。
 * return {error} - 解析失敗的錯誤。
 */
func Str2Time(s string, f []string) *time.Time {
	for _, format := range f {
		t, err := time.Parse(format, s)
		if err == nil {
			return &t // 解析成功，返回 time.Time
		}
	}

	return nil
}
