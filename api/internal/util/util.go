// util 是一個給 routers 用的工具包，裡面放置了一些常用的函式。
package api_util

import (
	std_array "app/pkg/std/array"
	std_convert "app/pkg/std/convert"
	std_operator "app/pkg/std/operator"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// IsBadRequest 是一個檢查是否為 Bad Request 的函式。
// 設計這個函式的目的是為了減少重複的程式碼。
//* form 的表單名稱要跟宣告的一樣，不然會無法綁定。
//* 盡量不用使用 _，因為 golang 的變數風格是駝峰式命名法。
// 例如:
// type PostForm struct {
// 	Username string `form:"username" binding:"required"`
// 	Password string `form:"password" binding:"required"`
// }
/*
 * param {gin.Context} c - Gin 的 Context 物件。
 * param {PostForm} form - 表單資料的指標。
 */
func IsBadRequest(c *gin.Context, form interface{}) bool {
	e := c.ShouldBind(form)
	if e != nil {
		BadRequest(c, e.Error())
	}
	return e != nil
}

// IsNumber 是一個檢查字串是否為數字的函式。
func IsNumber(c *gin.Context, s string, errorMsg string) (bool, int) {
	if s == "" {
		BadRequest(c, "參數不可為空。")
		return false, 0
	} else if n, err := strconv.Atoi(s); err != nil {
		BadRequest(c, errorMsg)
		return false, 0
	} else {
		return true, n
	}
}

// CheckDateFormat 是一個檢查日期格式是否正確的函式。
// 如果日期格式錯誤，則會回傳一個空的 time.Time。
// 這個函數會自動把日期格式轉換成 YYYYMMDD。  - 2024/01/08
func CheckDateFormat(c *gin.Context, date string, formatters ...string) *time.Time {
	// 如果沒有指定格式，則使用預設格式。
	if len(formatters) == 0 {
		formatters = []string{"2006-01-02", "20060102"}
	}

	t := std_convert.Str2Time(date, formatters)
	if t == nil {
		BadRequest(c, fmt.Sprintf(
			"無法解析日期 %s，目前只允許 %s。",
			std_operator.BoolExpr(date == "", "<空白>", date),
			strings.Join(std_array.Map(formatters, func(s string) string {
				s = strings.ReplaceAll(s, "2006", "YYYY")
				s = strings.ReplaceAll(s, "01", "MM")
				s = strings.ReplaceAll(s, "02", "DD")
				return s
			}), "、"),
		),
		)
		return nil
	}
	return t
}

// CheckTimeFormat 是一個檢查時間格式是否正確的函式。
// 如果時間格式錯誤，則會回傳一個空的 time.Time。
func CheckTimeFormat(c *gin.Context, s string, formatters ...string) *time.Time {
	// 如果沒有指定格式，則使用預設格式。
	if len(formatters) == 0 {
		formatters = []string{"2006-01-02 15:04:05", "20060102150405"}
	}
	t := std_convert.Str2Time(s, formatters)
	if t == nil {
		BadRequest(c, fmt.Sprintf(
			"無法解析時間 %s，目前只允許 %s。",
			std_operator.BoolExpr(s == "", "<空白>", s),
			strings.Join(std_array.Map(formatters, func(s string) string {
				s = strings.ReplaceAll(s, "2006", "YYYY")
				s = strings.ReplaceAll(s, "01", "MM")
				s = strings.ReplaceAll(s, "02", "DD")
				s = strings.ReplaceAll(s, "15", "HH")
				s = strings.ReplaceAll(s, "04", "mm")
				s = strings.ReplaceAll(s, "05", "ss")
				return s
			}), "、"),
		))
		return nil
	}
	return t
}

// GetUserFromContext 是一個從 Context 中取得使用者資訊的函式。
// 通常使用這個函數的前提是使用者已經通過驗證(middleware.JWT)。
// 因此這邊只是單純的解析 JWT，並不會再次檢查使用者是否存在。
// func GetUserFromContext(c *gin.Context) *auth_user.Payload {
// 	token := c.GetHeader("Authorization")

// 	if token == "" || len(token) < 7 {
// 		return nil
// 	}

// 	return auth_user.ParseAccessToken(token[7:])
// }

// 因為現在機台格式五花八門，所以這邊只檢查最尾巴有沒有 A 或 B。
var rPu = regexp.MustCompile("(.+)([A-E])$")

// ParseEquipment 會檢查機台名稱是否正確，並回傳結果。
// 因為使用 /.+([A-C])?$/ 會抓不到尾巴，所以做法改成有成功抓到的話，就回傳第一個結果。
// 如果沒有抓到，則回傳 []string{eqp,eqp}，保持一致性。
func ParseEquipment(eqp string) []string {
	match := rPu.FindAllStringSubmatch(eqp, -1)
	if len(match) == 0 {
		return []string{eqp, eqp}
	} else {
		return match[0]
	}
}

// ParsePu 會檢查 Chamber 名稱是否正確，並回傳結果。
func ParsePu(pu string) []string {
	result := rPu.FindAllStringSubmatch(pu, -1)
	if len(result) == 0 {
		return nil
	} else {
		return result[0]
	}
}

// MergeDepartment 是把部門合成為一個。預設使用 / 作為分隔符號，可以自訂。
func MergeDepartment(dep1 string, dep2 string, dep3 string, sep ...string) string {
	s := []string{dep1, dep2}

	if dep3 != "" {
		s = append(s, dep3)
	}

	if len(sep) > 0 {
		return strings.Join(s, sep[0])
	}
	return strings.Join(s, "/")
}

// getStringOrDefault 是一個取得陣列第一個字串的函式。
// 如果陣列長度為 0，則回傳預設字串。
func getStringOrDefault(s []string, defaultString string) string {
	if len(s) > 0 {
		return s[0]
	}
	return defaultString
}

// MarkdownToHTML 是一個將 Markdown 轉換成 HTML 的函式。
// 一開始先用 blackfriday 轉換成 HTML，再用 html.UnescapeString 把 &amp; 之類的 HTML 字元
// 轉換成正常的字元。
// func MarkdownToHTML(s string) string {
// 	return html.UnescapeString(string(blackfriday.MarkdownCommon([]byte(s))))
// }

// TrimHTML 是一個將 HTML 去除多餘空白的函式。
// func TrimHTML(html string) string {
// 	// 把HTML標籤全轉成小寫
// 	re, _ := regexp.Compile("\\<[\\S\\s]+?\\>")
// 	html = re.ReplaceAllStringFunc(html, strings.ToLower)
// 	// 去除STYLE
// 	re, _ = regexp.Compile("\\<style[\\S\\s]+?\\</style\\>")
// 	html = re.ReplaceAllString(html, "")
// 	// 去掉 pre
// 	re, _ = regexp.Compile("\\<pre\\>|\\</pre\\>")
// 	html = re.ReplaceAllString(html, "")
// 	// 去除SCRIPT
// 	// re, _ = regexp.Compile("\\<script[\\S\\s]+?\\</script\\>")
// 	// html = re.ReplaceAllString(html, "")
// 	// 去除所有尖括號內的HTML代碼並換成換行符
// 	// re, _ = regexp.Compile("\\<[\\S\\s]+?\\>")
// 	// html = re.ReplaceAllString(html, "\n")
// 	// 去除連續的換行符
// 	// re, _ = regexp.Compile("\\s{2,}")
// 	// html = re.ReplaceAllString(html, "\t")
// 	// 因為 mail 不支援 code，所以轉換成背景為灰色的區塊
// 	re, _ = regexp.Compile("\\<code[^>]*\\>([^>]+)\\</code\\>")
// 	html = re.ReplaceAllString(html, "<div style=\"background-color: #272822; color: white; padding: 10px; border-radius: 8px; white-space: pre-wrap;\">$1</div>")
// 	return strings.TrimSpace(html)
// }

// FindDirectoryResourceNameByRole 會根據角色名稱找到資料夾型資源名稱。
// 因為資料夾型資源的名字都是 dir-{資料夾}-{C,R,U,D}，所以要用 Map 把資料夾名稱取出來。
// func FindDirectoryResourceNameByRole(role string) []string {
// 	return std_array.Map(
// 		auth_sql.FindResourceByRole(role),
// 		func(r *auth_model.SysResource) string {
// 			return strings.ReplaceAll(strings.Split(r.Name, "-")[1], "/", "")
// 		},
// 	)
// }

// FindDirectoryResourcesByPermission 會根據權限名稱找到資料夾型資源名稱。
// func FindDirectoryResourcesByPermission(perm string) []string {
// 	if perm == "" {
// 		return nil
// 	}

// 	if rows, err := auth_sql.ListFilesByPermission(perm); err != nil {
// 		return nil
// 	} else {
// 		return std_array.Map(
// 			rows,
// 			func(r string) string {
// 				return strings.ReplaceAll(strings.Split(r, "-")[1], "/", "")
// 			},
// 		)
// 	}
// }
