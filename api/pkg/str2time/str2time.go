package str2time

import (
	"math"
	"regexp"
	"strconv"
	"time"
)

const INFINITY_STR = "inf"
const INFINITY_DUR = 2500000 * time.Hour // 大約是 285 年

var (
	rDuration = regexp.MustCompile(`(\d+)(ms|us|ns|[yMwdhms])`)
	// Time2Str 的讀取順序
	durOrder  = []string{"y", "M", "w", "d", "h", "m", "s", "ms", "us", "ns"}
	durFormat = map[string]time.Duration{
		"y":  time.Hour * 24 * 365,
		"M":  time.Hour * 24 * 30,
		"w":  time.Hour * 24 * 7,
		"d":  time.Hour * 24,
		"h":  time.Hour,
		"m":  time.Minute,
		"s":  time.Second,
		"ms": time.Millisecond,
		"us": time.Microsecond,
		"ns": time.Nanosecond,
	}
)

// MatchTime 是檢查字串是否符合 rDuration 的格式。
func MatchTime(s string) bool {
	return rDuration.MatchString(s)
}

// ParseTime 是把 rDuration 允許的格式轉成時間數量和單位。
// 只能轉換一個單位，例如 1y2M3w4d5h6m7s8ms9us10ns 會轉成 1 年。
// 如果是多個單位，它只會回傳第一個單位的數量和單位。
// 如果遇到 inf 就轉成 285 年。
// 如果無法轉換，則回傳 0 和空字串。
func ParseTime(s string) (int, string) {
	if s == INFINITY_STR {
		return 285, "year"
	}

	if t := rDuration.FindStringSubmatch(s); t != nil {
		n, _ := strconv.Atoi(t[1])
		return n, t[2]
	}

	return 0, ""
}

// Str2Time 是把 rDuration 允許的格式轉成 time.Duration。
// 如果遇到 inf 就轉成 -1 秒。
func Str2Time(dur string) time.Duration {
	if dur == INFINITY_STR {
		return INFINITY_DUR
	}

	// FindAllStringSubmatch 就是 regex 的 global match
	c := time.Duration(0)
	if t := rDuration.FindAllStringSubmatch(dur, -1); t != nil {
		for i := range t {
			if f, ok := durFormat[t[i][2]]; ok {
				n, _ := strconv.Atoi(t[i][1])
				c += f * time.Duration(n)
			}
		}
	}
	return c
}

// Time2Str 是把 time.Duration 轉成以 yMdhms 為單位的字串。遇到 -1 秒會轉成 inf。
// units 是使用者指定轉換後的單位。第一個是最大單位，預設為年(y)；第二個是最小單位，預設為納秒(ns)。
// units 的單位順序和 durOrder 一樣。
// 例如:
// t=123*24*time.Hour，我希望出來是 123d，這時候 units = "d" 就會跳過年和月的換算。
// t=(123*24+5)*time.Hour+10*time.Second，我希望出來是 123d5h，這時候 units = "d", "h" 就會跳過年和月的換算，並且只到 h。
func Time2Str(t time.Duration, units ...string) string {
	if t == INFINITY_DUR {
		return INFINITY_STR
	}

	// 取得使用者指定的單位。第一個是最大單位，第二個是最小單位。
	var (
		maxUnit = "y"
		isMax   = false // 是否搜尋到 maxUnit
		minUnit = "ns"
	)
	if len(units) > 1 {
		maxUnit = units[0]
		minUnit = units[1]
	} else if len(units) > 0 {
		maxUnit = units[0]
	}

	// 把 duration 轉成 second(float64)，才能做除法
	x := t.Seconds()
	s := ""
	var p, q float64

	// 因為 durFormat 轉成 key-value 會是隨機順序
	// 所以這裡使用 durOrder
	for _, u := range durOrder {
		// 比對是否為最大單位
		if u == maxUnit {
			isMax = true
		}

		// 如果還沒輪到最大單位，就不要換算
		if !isMax {
			continue
		}

		// 取商數
		q = durFormat[u].Seconds()
		p = math.Floor(x / q)

		// 如果商數 > 0，就把商數和單位加進字串裡
		if p > 0 {
			x -= p * q
			s += strconv.FormatFloat(p, 'f', 0, 64) + u
		}

		// 如果已經到最小單位，就不要再換算了
		// 放在最後是因為這一輪還是要先把單位加進字串裡
		if u == minUnit {
			break
		}
	}

	return s
}
