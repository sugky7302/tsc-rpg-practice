package std_json

import (
	"encoding/json"
	"regexp"
)

// 封裝 json.Marshal
// 如果 v 是 nil，則回傳 defaultString
func JSONStringify(v interface{}, defaultString string) (string, error) {
	re := regexp.MustCompile(`^0x`)
	b, e := json.Marshal(v)
	s := string(b)
	if s == "null" || re.MatchString(s) {
		s = defaultString
	}
	return s, e
}
